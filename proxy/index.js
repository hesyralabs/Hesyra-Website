const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// CONFIGURATION
const PORT = 3000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const DEFAULT_MODEL = "google/gemini-2.0-flash-lite-preview-02-05:free";
const USE_OLLAMA = false; 
const OLLAMA_URL = "http://localhost:11434/v1/chat/completions";
const OLLAMA_MODEL = "qwen3:4b";

console.log(`[Proxy] Starting...`);
console.log(`[Proxy] Mode: ${USE_OLLAMA ? 'Local Ollama' : 'OpenRouter'}`);
console.log(`[Proxy] Model: ${USE_OLLAMA ? OLLAMA_MODEL : DEFAULT_MODEL}`);

app.use((req, res, next) => {
    console.log(`[Proxy] ${req.method} ${req.url}`);
    res.setHeader('anthropic-version', '2023-06-01');
    next();
});

const handleMessages = async (req, res) => {
    const stream = req.body.stream;
    console.log(`[Proxy] Request for ${req.body.model} (Stream: ${stream})`);
    
    try {
        const url = USE_OLLAMA ? OLLAMA_URL : 'https://openrouter.ai/api/v1/chat/completions';
        const headers = USE_OLLAMA ? {} : {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'https://github.com/anthropic-ai/claude-code',
            'X-Title': 'Claude Code Proxy'
        };

        const response = await axios({
            method: 'post',
            url: url,
            headers: headers,
            data: {
                model: USE_OLLAMA ? OLLAMA_MODEL : DEFAULT_MODEL,
                messages: req.body.messages.map(msg => ({
                    role: msg.role,
                    content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
                })),
                stream: stream
            },
            responseType: stream ? 'stream' : 'json'
        });

        if (stream) {
            res.setHeader('Content-Type', 'text/event-stream');
            res.write('event: message_start\n');
            res.write(`data: ${JSON.stringify({ type: 'message_start', message: { id: `msg_${Date.now()}`, type: 'message', role: 'assistant', model: req.body.model, content: [], stop_reason: null, stop_sequence: null, usage: { input_tokens: 0, output_tokens: 0 } } })}\n\n`);
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
                            const content = data.choices[0]?.delta?.content;
                            if (content) {
                                res.write('event: content_block_delta\n');
                                res.write(`data: ${JSON.stringify({ type: 'content_block_delta', index: 0, delta: { type: 'text_delta', text: content } })}\n\n`);
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
            const aiRes = response.data;
            res.json({
                id: aiRes.id || `msg_${Date.now()}`,
                type: 'message',
                role: 'assistant',
                model: req.body.model,
                content: [{ type: 'text', text: aiRes.choices[0].message.content }],
                stop_reason: 'end_turn',
                usage: { input_tokens: 0, output_tokens: 0 }
            });
        }
    } catch (error) {
        console.error('[Proxy Error]', error.message);
        res.status(500).json({ error: error.message });
    }
};

app.post('/v1/messages', handleMessages);
app.post('/messages', handleMessages);

app.get('/v1/models', (req, res) => {
    res.json({
        data: [{ id: 'claude-sonnet-4-6', name: 'Claude 4.6 Sonnet', type: 'model' }]
    });
});

app.get('/v1/models/:id', (req, res) => res.json({ id: req.params.id, name: req.params.id, type: 'model' }));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Proxy] Listening on http://localhost:${PORT}`);
});
