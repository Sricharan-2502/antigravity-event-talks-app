document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const refreshBtn = document.getElementById("refresh-btn");
    const refreshIcon = document.getElementById("refresh-icon");
    const searchInput = document.getElementById("search-input");
    const loader = document.getElementById("loader");
    const errorState = document.getElementById("error-state");
    const errorMessage = document.getElementById("error-message");
    const retryBtn = document.getElementById("retry-btn");
    const releasesList = document.getElementById("releases-list");
    const feedStatus = document.getElementById("feed-status");
    
    // Tweet Modal Elements
    const tweetModal = document.getElementById("tweet-modal");
    const tweetText = document.getElementById("tweet-text");
    const charCount = document.getElementById("char-count");
    const tweetPreviewTitle = document.getElementById("tweet-preview-title");
    const tweetPreviewDate = document.getElementById("tweet-preview-date");
    const tweetNowBtn = document.getElementById("tweet-now-btn");
    const closeModal = document.getElementById("close-modal");
    
    let allReleases = [];

    // Format Date beautifully
    function formatDate(dateStr) {
        try {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const date = new Date(dateStr);
            if (isNaN(date)) return dateStr;
            return date.toLocaleDateString('en-US', options);
        } catch (e) {
            return dateStr;
        }
    }

    // Classify content to add badges (Features, Deprecations, Resolved, etc.)
    function detectBadge(content, title) {
        const text = (content + " " + title).toLowerCase();
        if (text.includes("deprecation") || text.includes("deprecated")) {
            return '<span class="badge badge-deprecated">Deprecated</span>';
        }
        if (text.includes("resolved") || text.includes("fixed") || text.includes("bug fix")) {
            return '<span class="badge badge-changed">Resolved</span>';
        }
        if (text.includes("feature") || text.includes("introducing") || text.includes("new support") || text.includes("generally available") || text.includes("beta")) {
            return '<span class="badge badge-feature">Feature</span>';
        }
        return '<span class="badge badge-info">Update</span>';
    }

    // Clean HTML content for tweet preview/drafting
    function stripHtml(html) {
        let doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    // Fetch releases from local Flask API
    async function fetchReleases() {
        // Show loader, hide error/list
        loader.classList.remove("hidden");
        errorState.classList.add("hidden");
        releasesList.classList.add("hidden");
        refreshIcon.classList.add("spin");
        refreshBtn.disabled = true;
        feedStatus.textContent = "Fetching latest feed...";

        try {
            const response = await fetch("/api/releases");
            const data = await response.json();

            if (data.status === "success") {
                allReleases = data.releases;
                renderReleases(allReleases);
                feedStatus.textContent = `Last updated: ${new Date().toLocaleTimeString()} (${allReleases.length} updates found)`;
                
                // Show list, hide loader
                releasesList.classList.remove("hidden");
            } else {
                showError(data.message || "Failed to parse release notes feed.");
            }
        } catch (err) {
            showError("Network error. Make sure the Flask server is running.");
        } finally {
            loader.classList.add("hidden");
            refreshIcon.classList.remove("spin");
            refreshBtn.disabled = false;
        }
    }

    // Render list of releases
    function renderReleases(releases) {
        releasesList.innerHTML = "";
        
        if (releases.length === 0) {
            releasesList.innerHTML = `
                <div class="error-container">
                    <i class="fa-solid fa-folder-open text-muted"></i>
                    <h3>No releases found</h3>
                    <p>Try modifying your search or click Refresh.</p>
                </div>
            `;
            return;
        }

        releases.forEach(release => {
            const card = document.createElement("article");
            card.className = "release-card";
            
            const badge = detectBadge(release.content, release.title);
            const dateStr = formatDate(release.updated);

            card.innerHTML = `
                <div class="release-header">
                    <div class="release-title-area">
                        <h2 class="release-title">${badge}${release.title}</h2>
                        <span class="release-date"><i class="fa-regular fa-calendar-days"></i> ${dateStr}</span>
                    </div>
                    <div class="card-actions">
                        <button class="btn-icon btn-tweet-icon" title="Tweet about this update">
                            <i class="fa-brands fa-x-twitter"></i>
                        </button>
                        <a href="${release.link}" target="_blank" class="btn-icon" title="View official release page">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>
                    </div>
                </div>
                <div class="release-content">
                    ${release.content}
                </div>
            `;

            // Bind Tweet Button
            const tweetBtn = card.querySelector(".btn-tweet-icon");
            tweetBtn.addEventListener("click", () => openTweetModal(release));

            releasesList.appendChild(card);
        });
    }

    // Show error state
    function showError(msg) {
        errorMessage.textContent = msg;
        errorState.classList.remove("hidden");
        releasesList.classList.add("hidden");
        feedStatus.textContent = "Feed loading failed.";
    }

    // Tweet Modal Logic
    function openTweetModal(release) {
        tweetPreviewTitle.textContent = release.title;
        tweetPreviewDate.textContent = formatDate(release.updated);
        
        // Build initial pre-filled tweet
        const cleanContent = stripHtml(release.content).trim();
        // Shorten content for preview if it's too long
        let description = cleanContent.length > 120 ? cleanContent.substring(0, 120) + "..." : cleanContent;
        // Strip out multiple newlines/tabs
        description = description.replace(/\s+/g, ' ');

        const defaultTweet = `🚀 BigQuery Update: ${release.title}\n\n"${description}"\n\nRead more: ${release.link} #BigQuery #GoogleCloud`;
        
        tweetText.value = defaultTweet;
        updateCharCount();
        
        tweetModal.classList.add("show");
        tweetText.focus();
    }

    function closeTweetModal() {
        tweetModal.classList.remove("show");
    }

    function updateCharCount() {
        const remaining = 280 - tweetText.value.length;
        charCount.textContent = remaining;
        
        if (remaining < 0) {
            charCount.classList.add("char-warning");
            tweetNowBtn.disabled = true;
        } else {
            charCount.classList.remove("char-warning");
            tweetNowBtn.disabled = false;
        }
    }

    // Event Listeners
    refreshBtn.addEventListener("click", fetchReleases);
    retryBtn.addEventListener("click", fetchReleases);
    
    // Close Modal Events
    closeModal.addEventListener("click", closeTweetModal);
    tweetModal.addEventListener("click", (e) => {
        if (e.target === tweetModal) closeTweetModal();
    });
    
    // Character Limit count
    tweetText.addEventListener("input", updateCharCount);

    // Send tweet (Redirect to twitter sharing intent)
    tweetNowBtn.addEventListener("click", () => {
        const text = encodeURIComponent(tweetText.value);
        const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${text}`;
        window.open(twitterIntentUrl, "_blank");
        closeTweetModal();
    });

    // Search logic with simple debouncing
    let searchTimeout;
    searchInput.addEventListener("input", (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = e.target.value.toLowerCase().trim();
            if (query === "") {
                renderReleases(allReleases);
                return;
            }

            const filtered = allReleases.filter(release => {
                const titleMatch = release.title.toLowerCase().includes(query);
                const contentMatch = stripHtml(release.content).toLowerCase().includes(query);
                return titleMatch || contentMatch;
            });
            
            renderReleases(filtered);
        }, 300);
    });

    // Initial Load
    fetchReleases();
});
