import { Link } from 'react-router-dom'
import { blogPosts } from '../data/blogPosts'
import './Blog.css'

export default function Blog() {
    return (
        <section className="blog-page">
            <div className="container blog-inner">
                <div className="mono-label" style={{ marginBottom: '1rem' }}>[KNOWLEDGE_BASE]</div>
                <h1>Insights & Resources</h1>
                <p className="blog-subtitle">
                    Clinical guides, technology deep-dives, and industry perspectives from the Hesyra Labs team.
                </p>

                <div className="blog-grid">
                    {blogPosts.map(post => (
                        <Link
                            key={post.slug}
                            to={`/blog/${post.slug}`}
                            className="glass-panel blog-card"
                        >
                            <img
                                src={post.image}
                                alt={post.title}
                                className="blog-card-image"
                                loading="lazy"
                                width="200"
                                height="140"
                            />
                            <div className="blog-card-content">
                                <div className="blog-card-meta">
                                    <span className="blog-card-tag">{post.category}</span>
                                    <span>{post.date}</span>
                                    <span>{post.readTime}</span>
                                </div>
                                <h3>{post.title}</h3>
                                <p>{post.description}</p>
                                <span className="blog-read-more">
                                    Read Article →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Blog listing structured data */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Blog",
                "name": "Hesyra Labs Blog",
                "description": "Clinical guides, technology insights, and dental industry resources from Hesyra Labs.",
                "url": "https://hesyralabs.com/blog",
                "publisher": {
                    "@type": "Organization",
                    "name": "Hesyra Labs",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://hesyralabs.com/logo.png"
                    }
                },
                "blogPost": blogPosts.map(post => ({
                    "@type": "BlogPosting",
                    "headline": post.title,
                    "description": post.description,
                    "datePublished": post.date,
                    "image": `https://hesyralabs.com${post.image}`,
                    "author": {
                        "@type": "Organization",
                        "name": "Hesyra Labs"
                    },
                    "url": `https://hesyralabs.com/blog/${post.slug}`
                }))
            }) }} />
        </section>
    )
}
