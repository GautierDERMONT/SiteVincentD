function displayFeaturedArticle() {
    const container = document.getElementById('featured-article-container');
    if (!container) return;
    
    if (typeof ARTICLES_DATA === 'undefined' || !ARTICLES_DATA.getFeaturedArticle) {
        console.error('ARTICLES_DATA non trouvé');
        return;
    }
    
    const article = ARTICLES_DATA.getFeaturedArticle();
    if (!article) {
        console.error('Aucun article vedette trouvé');
        return;
    }
    
    container.innerHTML = `
        <div class="featured-article">
            <div class="article-image">
                <img src="${article.image}" alt="${article.imageAlt}">
                <span class="article-category">${article.featuredTag || 'À la une'}</span>
            </div>
            <div class="article-content">
                <div class="article-meta">
                    <span class="article-date"><i class="far fa-calendar"></i> ${article.date}</span>
                    <span class="article-author"></i> ${article.author}</span>
                </div>
                <h2>${article.title}</h2>
                <p>${article.description}</p>
                <div class="article-footer">
                    <div class="article-tags">
                        ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <span class="reading-time"><i class="fas fa-eye"></i> ${article.readTime}</span>
                </div>
                <a href="${article.url}" class="btn btn-outline" style="margin-top: 1.5rem; display: inline-block;">Lire l'article complet</a>
            </div>
        </div>
    `;
}

// Fonction pour trier les articles par date (du plus récent au plus ancien)
function sortArticlesByDate(articles) {
    return [...articles].sort((a, b) => {
        if (a.dateIso && b.dateIso) {
            return new Date(b.dateIso) - new Date(a.dateIso);
        }
        return 0;
    });
}

function displayArticlesGrid() {
    const gridContainer = document.getElementById('articles-grid');
    if (!gridContainer) return;
    
    if (typeof ARTICLES_DATA === 'undefined' || !ARTICLES_DATA.list) {
        console.error('ARTICLES_DATA ou list non trouvé');
        return;
    }
    
    // Trier les articles par date
    const sortedArticles = sortArticlesByDate(ARTICLES_DATA.list);
    
    // Générer le HTML avec les liens corrects
    gridContainer.innerHTML = sortedArticles.map(article => `
        <a href="${article.url}" class="article-card-link" style="text-decoration: none; color: inherit;">
            <article class="article-card" data-id="${article.id}" data-date="${article.dateIso}">
                <div class="article-card-image">
                    <img src="${article.image}" alt="${article.imageAlt}" loading="lazy">
                </div>
                <div class="article-card-content">
                    <div class="article-meta">
                        <span class="article-date"><i class="far fa-calendar"></i> ${article.date}</span>
                        <span class="article-author"></i> ${article.author}</span>
                    </div>
                    <h3>${escapeHtml(article.shortTitle || article.title)}</h3>
                    <p class="article-excerpt">${escapeHtml(article.description)}</p>
                    <div class="article-footer">
                        <div class="article-tags">
                            ${article.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                        </div>
                        <span class="reading-time"><i class="fas fa-eye"></i> ${article.readTime}</span>
                    </div>
                </div>
            </article>
        </a>
    `).join('');
    
    console.log('Articles affichés triés par date :', sortedArticles.map(a => `${a.date} (${a.dateIso})`));
}

// Fonction utilitaire pour échapper les caractères HTML
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function loadArticleMeta() {
    const path = window.location.pathname;
    const match = path.match(/\/(\d+)\.html$/);
    
    let article = null;
    
    if (match) {
        const articleId = parseInt(match[1]);
        if (typeof ARTICLES_DATA !== 'undefined' && ARTICLES_DATA.list) {
            article = ARTICLES_DATA.list.find(a => a.id === articleId);
        }
    }
    
    if (!article && typeof ARTICLES_DATA !== 'undefined' && ARTICLES_DATA.featuredArticle) {
        article = ARTICLES_DATA.featuredArticle;
        console.warn('Article non trouvé par ID, utilisation de l\'article vedette');
    }
    
    if (!article) {
        console.error('Aucun article trouvé');
        return;
    }
    
    const metaHeader = document.querySelector('.article-meta-header');
    if (metaHeader) {
        metaHeader.innerHTML = `
            <div class="article-meta-left">
                <span class="article-date"><i class="far fa-calendar"></i> ${article.date}</span>
                <span class="article-author"><i class="far fa-user"></i> ${article.author}</span>
            </div>
            <span class="reading-time"><i class="fas fa-eye"></i> ${article.readTime}</span>
        `;
    }
    
    const tagsHeader = document.querySelector('.article-tags-header');
    if (tagsHeader) {
        tagsHeader.innerHTML = article.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    }
}

// Exécuter les fonctions au chargement de la page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        displayFeaturedArticle();
        displayArticlesGrid();
        loadArticleMeta();
    });
} else {
    displayFeaturedArticle();
    displayArticlesGrid();
    loadArticleMeta();
}