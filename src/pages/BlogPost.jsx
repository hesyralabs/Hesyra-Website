import { useParams, Link } from 'react-router-dom'
import { blogPosts } from '../data/blogPosts'
import './Blog.css'

export default function BlogPost() {
    const { slug } = useParams()
    const post = blogPosts.find(p => p.slug === slug)

    if (!post) {
        return (
            <section className="blog-post-page">
                <div className="container blog-post-inner">
                    <h1>Post not found</h1>
                    <Link to="/blog" className="blog-back">← Back to Blog</Link>
                </div>
            </section>
        )
    }

    // Simple markdown-like rendering for the content
    const renderContent = (content) => {
        const lines = content.trim().split('\n')
        const elements = []
        let i = 0
        let listItems = []
        let isOrdered = false
        let inTable = false
        let tableRows = []

        const flushList = () => {
            if (listItems.length > 0) {
                if (isOrdered) {
                    elements.push(<ol key={`ol-${elements.length}`}>{listItems.map((item, idx) => <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />)}</ol>)
                } else {
                    elements.push(<ul key={`ul-${elements.length}`}>{listItems.map((item, idx) => <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />)}</ul>)
                }
                listItems = []
            }
        }

        const flushTable = () => {
            if (tableRows.length > 0) {
                const headers = tableRows[0]
                const body = tableRows.slice(2) // skip separator row
                elements.push(
                    <div key={`table-${elements.length}`} style={{ overflowX: 'auto', margin: '1.5rem 0' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                                <tr>
                                    {headers.map((h, idx) => (
                                        <th key={idx} style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid var(--border-default)', color: 'var(--text-primary)', fontWeight: 600 }}>
                                            {h.trim()}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {body.map((row, ridx) => (
                                    <tr key={ridx}>
                                        {row.map((cell, cidx) => (
                                            <td key={cidx} style={{ padding: '0.6rem 0.75rem', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                                                {cell.trim()}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
                tableRows = []
                inTable = false
            }
        }

        const formatInline = (text) => {
            return text
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
        }

        while (i < lines.length) {
            const line = lines[i]

            // Table
            if (line.trim().startsWith('|')) {
                flushList()
                const cells = line.trim().split('|').filter(c => c.trim() !== '')
                if (!inTable) inTable = true
                tableRows.push(cells)
                i++
                continue
            } else if (inTable) {
                flushTable()
            }

            // Headers
            if (line.startsWith('### ')) {
                flushList()
                elements.push(<h3 key={i}>{line.slice(4)}</h3>)
            } else if (line.startsWith('## ')) {
                flushList()
                elements.push(<h2 key={i}>{line.slice(3)}</h2>)
            }
            // Blockquote
            else if (line.startsWith('> ')) {
                flushList()
                elements.push(
                    <div className="blog-callout" key={i}>
                        <p dangerouslySetInnerHTML={{ __html: formatInline(line.slice(2)) }} />
                    </div>
                )
            }
            // Unordered list
            else if (line.match(/^- \*\*|^- [A-Z]|^- [a-z]/)) {
                isOrdered = false
                listItems.push(formatInline(line.slice(2)))
            }
            // Ordered list
            else if (line.match(/^\d+\. /)) {
                isOrdered = true
                listItems.push(formatInline(line.replace(/^\d+\. /, '')))
            }
            // Paragraph
            else if (line.trim() !== '') {
                flushList()
                elements.push(<p key={i} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />)
            } else {
                flushList()
            }

            i++
        }
        flushList()
        flushTable()
        return elements
    }

    return (
        <section className="blog-post-page">
            <div className="container blog-post-inner">
                <div className="blog-post-meta">
                    <span className="blog-card-tag">{post.category}</span>
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                </div>
                <h1>{post.title}</h1>

                <div className="blog-post-body">
                    {renderContent(post.content)}
                </div>

                <div className="blog-cta-box">
                    <h3>Ready to go digital?</h3>
                    <p>Partner with Hesyra Labs and get a free test crown to experience our quality firsthand.</p>
                    <a href="/#cta" className="btn btn-brand">Request Free Sample →</a>
                </div>

                <Link to="/blog" className="blog-back">← Back to Blog</Link>
            </div>

            {/* Article structured data */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": post.title,
                "description": post.description,
                "image": `https://hesyralabs.com${post.image}`,
                "datePublished": post.date,
                "dateModified": post.date,
                "author": {
                    "@type": "Organization",
                    "name": "Hesyra Labs",
                    "url": "https://hesyralabs.com"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "Hesyra Labs",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://hesyralabs.com/logo.png"
                    }
                },
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": `https://hesyralabs.com/blog/${post.slug}`
                }
            }) }} />
        </section>
    )
}
