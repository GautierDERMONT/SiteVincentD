/**
 * BLOG - RECHERCHE ET FILTRAGE DYNAMIQUE
 */

document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const searchInput = document.getElementById('blog-search-input');
    const filterToggleBtn = document.getElementById('filter-toggle-btn');
    const filterDropdown = document.getElementById('filter-dropdown-menu');
    const resultsCountSpan = document.getElementById('results-count');
    const activeFilterCount = document.getElementById('active-filter-count');
    const articlesGrid = document.getElementById('articles-grid');
    
    // Variables d'état
    let currentSearchTerm = '';
    let currentCategory = 'all';
    let allArticles = [];
    
    // Récupérer tous les articles
    function initArticles() {
        if (articlesGrid) {
            allArticles = Array.from(articlesGrid.querySelectorAll('.article-card'));
        }
    }
    
    // Mettre à jour l'affichage
    function filterAndSearch() {
        if (!allArticles.length) return;
        
        let visibleCount = 0;
        const searchTerm = currentSearchTerm.toLowerCase().trim();
        
        allArticles.forEach(article => {
            // Récupération des données
            const title = article.getAttribute('data-title') || 
                         article.querySelector('h3')?.innerText || '';
            const tags = article.getAttribute('data-tags') || '';
            
            // Catégorie de l'article (depuis le span .article-category)
            const categorySpan = article.querySelector('.article-category');
            const articleCategory = categorySpan ? categorySpan.innerText.trim() : '';
            
            // Filtre par catégorie
            let categoryMatch = (currentCategory === 'all') || (articleCategory === currentCategory);
            
            // Filtre par recherche
            let searchMatch = true;
            if (searchTerm !== '') {
                const titleLower = title.toLowerCase();
                const tagsLower = tags.toLowerCase();
                searchMatch = titleLower.includes(searchTerm) || tagsLower.includes(searchTerm);
            }
            
            // Affichage
            const shouldShow = categoryMatch && searchMatch;
            article.style.display = shouldShow ? '' : 'none';
            if (shouldShow) visibleCount++;
        });
        
        // Mettre à jour le compteur
        if (resultsCountSpan) {
            resultsCountSpan.textContent = visibleCount;
        }
        
        // Gérer le message "aucun résultat"
        showNoResultsMessage(visibleCount === 0);
        
        // Animation
        animateFilteredCards();
    }
    
    // Message aucun résultat
    function showNoResultsMessage(noResults) {
        const existingMsg = articlesGrid?.querySelector('.no-results-message');
        if (existingMsg) existingMsg.remove();
        
        if (noResults && allArticles.length > 0) {
            const noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-results-message';
            noResultsDiv.innerHTML = `
                <i class="fas fa-search"></i>
                <p>Aucun article ne correspond à votre recherche.</p>
            `;
            articlesGrid.appendChild(noResultsDiv);
        }
    }
    
    // Animation des cartes
    function animateFilteredCards() {
        const visibleCards = allArticles.filter(article => article.style.display !== 'none');
        visibleCards.forEach((card, index) => {
            card.classList.add('filter-highlight');
            setTimeout(() => {
                card.classList.remove('filter-highlight');
            }, 400);
        });
    }
    
    // Mise à jour du badge
    function updateFilterBadge() {
        if (activeFilterCount) {
            const isActive = currentCategory !== 'all';
            if (isActive) {
                activeFilterCount.textContent = '1';
                activeFilterCount.style.display = 'inline-block';
            } else {
                activeFilterCount.style.display = 'none';
            }
        }
        
        if (filterToggleBtn) {
            if (currentCategory !== 'all') {
                filterToggleBtn.classList.add('active-filter');
            } else {
                filterToggleBtn.classList.remove('active-filter');
            }
        }
    }
    
    // Mettre à jour l'option active dans le dropdown
    function updateActiveCategoryInDropdown() {
        const options = filterDropdown?.querySelectorAll('.filter-option[data-category]');
        options?.forEach(opt => {
            const catValue = opt.getAttribute('data-category');
            if (catValue === currentCategory) {
                opt.classList.add('active-category');
            } else if (catValue !== 'clear') {
                opt.classList.remove('active-category');
            }
        });
    }
    
    // Réinitialisation
    function resetAllFilters() {
        currentSearchTerm = '';
        currentCategory = 'all';
        if (searchInput) searchInput.value = '';
        updateFilterBadge();
        updateActiveCategoryInDropdown();
        filterAndSearch();
        if (filterDropdown) filterDropdown.classList.remove('show');
    }
    
    // Événement de recherche
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            currentSearchTerm = e.target.value;
            filterAndSearch();
        });
    }
    
    // Gestion du dropdown filtre
    if (filterToggleBtn && filterDropdown) {
        filterToggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            filterDropdown.classList.toggle('show');
        });
        
        document.addEventListener('click', function() {
            filterDropdown.classList.remove('show');
        });
        
        filterDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        const filterOptions = filterDropdown.querySelectorAll('.filter-option[data-category]');
        filterOptions.forEach(option => {
            option.addEventListener('click', function() {
                const categoryValue = this.getAttribute('data-category');
                
                if (categoryValue === 'clear') {
                    resetAllFilters();
                } else {
                    currentCategory = categoryValue;
                    updateFilterBadge();
                    updateActiveCategoryInDropdown();
                    filterAndSearch();
                }
                
                filterDropdown.classList.remove('show');
            });
        });
    }
    
    // Initialisation
    initArticles();
    filterAndSearch();
});