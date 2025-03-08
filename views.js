async function fetchRSSFeed() {
    const rssUrl = "https://libertarianparty.in/rss/latest-posts";
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    const container = document.getElementById("rss-feed-container");

    try {
        const response = await fetch(proxyUrl);
        const data = await response.json();

        if (data.status !== "ok") throw new Error("Failed to fetch RSS feed");

        container.innerHTML = "";

        data.items.slice(0, 5).forEach((item, index) => {
            const postElement = document.createElement("div");
            postElement.className = "lpi-view-item";
            
            // Extract thumbnail (adjust based on your RSS feed structure)
            const thumbnail = item.enclosure?.link || 
                            item.thumbnail || 
                            extractFirstImage(item.content) || 
                            'placeholder.jpg';

            postElement.innerHTML = `
                <div class="post-thumbnail">
                    <img src="${thumbnail}" alt="${item.title}">
                </div>
                <div class="post-content">
                    <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                    <p>${stripHTML(item.description).substring(0, 120)}...</p>
                    <div class="post-meta">
                        <span>${new Date(item.pubDate).toLocaleDateString()}</span>
                        <a href="${item.link}" class="read-more" target="_blank">
                            Read More
                            <svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>
                        </a>
                    </div>
                </div>
            `;
            
            // Add animation delay
            postElement.style.animationDelay = `${index * 0.1}s`;
            container.appendChild(postElement);
        });

    } catch (error) {
        container.innerHTML = `<p class="error-message">Failed to load posts. Please try again later.</p>`;
        console.error("RSS Feed Error:", error);
    }
}

// Helper functions
function stripHTML(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
}

function extractFirstImage(content) {
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = content.match(imgRegex);
    return match ? match[1] : null;
}

document.addEventListener("DOMContentLoaded", fetchRSSFeed);