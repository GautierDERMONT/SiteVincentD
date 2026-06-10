// Fonction pour mélanger un tableau (algorithme de Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Récupérer des articles aléatoires en excluant un ID
function getRandomArticles(articlesList, count, excludeId = null) {
    if (!articlesList || articlesList.length === 0) return [];
    
    // Filtrer pour exclure l'article avec l'ID spécifié
    let filtered = [...articlesList];
    if (excludeId !== null) {
        filtered = filtered.filter(article => article.id !== excludeId);
    }
    
    // S'il n'y a pas assez d'articles après filtrage, retourner tous ceux disponibles
    if (filtered.length === 0) return [];
    
    const shuffled = shuffleArray([...filtered]);
    return shuffled.slice(0, Math.min(count, filtered.length));
}

// Récupérer l'ID de l'article courant depuis l'URL
function getCurrentArticleId() {
    const path = window.location.pathname;
    const match = path.match(/\/(\d+)\.html$/);
    if (match) {
        return parseInt(match[1]);
    }
    return null;
}

// Générer le HTML des suggestions avec image
function displayRandomArticles() {
    const container = document.getElementById('random-articles-container');
    if (!container) return;
    
    // Utiliser les données centralisées si disponibles
    let articlesData = [];
    
    if (typeof ARTICLES_DATA !== 'undefined' && ARTICLES_DATA.list) {
        articlesData = ARTICLES_DATA.list;
    } else {
        console.warn('ARTICLES_DATA non trouvé, utilisation des données locales');
        articlesData = window.localArticles || [];
    }
    
    if (articlesData.length === 0) {
        container.innerHTML = '<p>Aucun article disponible</p>';
        return;
    }
    
    // Récupérer l'ID de l'article courant pour l'exclure
    const currentArticleId = getCurrentArticleId();
    
    // Récupérer 3 articles aléatoires en excluant l'article courant
    const randomArticles = getRandomArticles(articlesData, 3, currentArticleId);
    
    // Si pas d'articles après exclusion, afficher un message
    if (randomArticles.length === 0) {
        container.innerHTML = '<p>Aucun autre article disponible</p>';
        return;
    }
    
    container.innerHTML = randomArticles.map(article => `
        <a href="${article.urlFull}" class="suggestion-card-link" style="text-decoration: none; color: inherit;">
            <div class="suggestion-card">
                <div class="suggestion-card-image">
                    <img src="${article.imageFull}" alt="${article.title}" loading="lazy">
                </div>
                <div class="suggestion-card-content">
                    <div class="suggestion-meta">
                        <span class="suggestion-date"><i class="far fa-calendar"></i> ${article.date}</span>
                        <span class="suggestion-author"></i> ${article.author}</span>
                    </div>
                    <h4 class="suggestion-title">${article.title}</h4>
                    <div class="suggestion-footer">
                        <div class="suggestion-tags">
                            ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        <span class="suggestion-reading-time"><i class="fas fa-eye"></i> ${article.readTime}</span>
                    </div>
                </div>
            </div>
        </a>
    `).join('');
}

// Exécuter au chargement de la page
document.addEventListener('DOMContentLoaded', displayRandomArticles);