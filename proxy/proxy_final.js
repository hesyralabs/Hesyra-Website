const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// CONFIGURATION
const PORT = 3000;
const USE_OLLAMA = true; // CHANGED: Now using local device model
const OLLAMA_URL = "http://localhost:11434/v1/chat/completions";
const OLLAMA_MODEL = "qwen3:4b"; // Verified local model

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const CLOUD_MODEL = "google/gemini-2.0-flash-lite-preview-02-05:free";

console.log(`[Proxy] Starting... Mode: ${USE_OLLAMA ? 'LOCAL OLLAMA' : 'OpenRouter'}`);
console.log(`[Proxy] Model: ${USE_OLLAMA ? OLLAMA_MODEL : CLOUD_MODEL}`);

app.use((req, res, next) => {
    console.log(`[Proxy] ${req.method} ${req.url}`);
    res.setHeader('anthropic-version', '2023-06-01');
    next();
});

app.post('*messages', async (req, res) => {
    try {
        if (!req.body || !req.body.messages) {
            return res.status(400).json({ error: "Missing messages" });
        }

        const isStream = req.body.stream;
        const targetModel = USE_OLLAMA ? OLLAMA_MODEL : CLOUD_MODEL;
        const targetUrl = USE_OLLAMA ? OLLAMA_URL : 'https://openrouter.ai/api/v1/chat/completions';
        
        console.log(`[Proxy] Routing request to ${targetModel} (Stream: ${isStream})`);

        // Convert messages to standard format
        const messages = req.body.messages.map(m => {
            let content = m.content;
            if (Array.isArray(content)) {
                content = content.map(block => block.type === 'text' ? block.text : JSON.stringify(block)).join('\n');
            }
            return { role: m.role, content: content };
        });

        if (req.body.system) {
            messages.unshift({ role: 'system', content: req.body.system });
        }

        const response = await axios({
            method: 'post',
            url: targetUrl,
            headers: USE_OLLAMA ? {} : {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': 'https://github.com/anthropic-ai/claude-code',
                'X-Title': 'Claude Code Proxy'
            },
            data: {
                model: targetModel,
                messages: messages,
                stream: isStream
            },
            responseType: isStream ? 'stream' : 'json'
        });

        if (isStream) {
            res.setHeader('Content-Type', 'text/event-stream');
            res.write('event: message_start\n');
            res.write(`data: ${JSON.stringify({ type: 'message_start', message: { id: `msg_${Date.now()}`, type: 'message', role: 'assistant', model: req.body.model, content: [], stop_reason: null, usage: { input_tokens: 0, output_tokens: 0 } } })}\n\n`);
            res.write('event: content_block_start\n');
            res.write(`data: ${JSON.stringify({ type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } })}\n\n`);

            response.data.on('data', chunk => {
                const lines = chunk.toString().split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.slice(6).trim();
                        if (dataStr === '[DONE]') continue;
                        try {
                            const data = JSON.parse(dataStr);
                            const text = data.choices[0]?.delta?.content;
                            if (text) {
                                res.write('event: content_block_delta\n');
                                res.write(`data: ${JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: text } })}\n\n`);
                            }
                        } catch (e) {}
                    }
                }
            });

            response.data.on('end', () => {
                res.write('event: content_block_stop\n');
                res.write(`data: ${JSON.stringify({ type: 'content_block_stop', index: 0 })}\n\n`);
                res.write('event: message_stop\n');
                res.write(`data: ${JSON.stringify({ type: 'message_stop' })}\n\n`);
                res.end();
            });
        } else {
            res.json({
                id: `msg_${Date.now()}`,
                type: 'message',
                role: 'assistant',
                model: req.body.model,
                content: [{ type: 'text', text: response.data.choices[0].message.content }],
                stop_reason: 'end_turn',
                usage: { input_tokens: 0, output_tokens: 0 }
            });
        }
    } catch (e) {
        const detail = e.response?.data || e.message;
        console.error('[Proxy Error]', detail);
        res.status(500).json({ error: e.message, details: detail });
    }
});

app.get('*models', (req, res) => res.json({ data: [{ id: 'claude-sonnet-4-6', name: 'Claude 4.6 Sonnet', type: 'model' }] }));
app.get('*models/:id', (req, res) => res.json({ id: req.params.id, name: req.params.id, type: 'model' }));

app.listen(PORT, '0.0.0.0', () => console.log(`[Proxy] Local Claude Active at http://localhost:${PORT}`));
