document.addEventListener('DOMContentLoaded', function() {
    // Éléments DOM
    const searchInput = document.getElementById('blog-search-input');
    const filterToggleBtn = document.getElementById('filter-toggle-btn');
    const filterDropdown = document.getElementById('filter-dropdown-menu');
    const resultsCountSpan = document.getElementById('results-count');
    const notificationBadge = document.getElementById('filter-notification-badge');
    const articlesGrid = document.querySelector('.articles-grid');
    const clearAllBtn = document.getElementById('clear-all-filters');
    
    // Variables d'état
    let currentSearchTerm = '';
    let activeCategories = new Set();
    let allArticles = [];
    let isDropdownOpen = false;
    
    // Mapping des catégories de filtre vers les valeurs possibles (catégorie principale + tags)
    const filterMapping = {
        'Audit': ['Audit'],
        'Diagnostic': ['Diagnostic'],
        'Méthodologie': ['Méthodologie'],
        'Projet': ['Projet'],
        'WMS': ['WMS'],
        'ERP': ['ERP'],
        'RSE': ['RSE', 'Écologie', 'Développement Durable'],
        'Transport': ['Transport'],
        'Douane': ['Douane']
    };
    
    // Récupérer tous les articles
    function initArticles() {
        if (articlesGrid) {
            allArticles = Array.from(articlesGrid.querySelectorAll('.article-card'));
            console.log("Articles trouvés :", allArticles.length);
            
            allArticles.forEach(article => {
                const titleElem = article.querySelector('h3');
                const title = titleElem ? titleElem.innerText : '';
                
                // Récupérer le contenu du paragraphe
                const paragraphElem = article.querySelector('p');
                const paragraph = paragraphElem ? paragraphElem.innerText : '';
                
                const tags = Array.from(article.querySelectorAll('.tag'))
                    .map(tag => tag.innerText.trim());
                
                const categorySpan = article.querySelector('.article-category');
                const articleCategory = categorySpan ? categorySpan.innerText.trim() : '';
                
                article.setAttribute('data-title', title);
                article.setAttribute('data-paragraph', paragraph);  // NOUVEAU
                article.setAttribute('data-tags', JSON.stringify(tags));
                article.setAttribute('data-tags-string', tags.join(' '));
                article.setAttribute('data-category', articleCategory);
                
                console.log("Article chargé :", title, "| Paragraphe:", paragraph.substring(0, 50) + "...");
            });
        } else {
            console.error("articlesGrid non trouvé - Vérifiez la classe .articles-grid dans le HTML");
        }
    }
    
    // Mettre à jour l'apparence du bouton filtre
    function updateFilterButtonAppearance() {
        const hasActiveFilters = activeCategories.size > 0;
        
        if (filterToggleBtn) {
            // Le bouton est actif si : des filtres sont sélectionnés OU le dropdown est ouvert
            if (hasActiveFilters || isDropdownOpen) {
                filterToggleBtn.classList.add('active-filter');
            } else {
                filterToggleBtn.classList.remove('active-filter');
            }
        }
    }
    
    // Vérifier si un article correspond aux catégories/filtres sélectionnés
    function matchesSelectedFilters(articleCategory, articleTags) {
        if (activeCategories.size === 0) return true;
        
        for (let filter of activeCategories) {
            const filterTerms = filterMapping[filter] || [filter];
            
            if (filterTerms.includes(articleCategory)) {
                return true;
            }
            
            for (let term of filterTerms) {
                if (articleTags.includes(term)) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
 // Mettre à jour l'affichage
    function filterAndSearch() {
        if (!allArticles.length) {
            console.log("Aucun article à filtrer");
            return;
        }
        
        let visibleCount = 0;
        const searchTerm = currentSearchTerm.toLowerCase().trim();
        
        console.log("Recherche :", searchTerm, "| Catégories actives :", Array.from(activeCategories));
        
        allArticles.forEach(article => {
            const title = article.getAttribute('data-title') || '';
            const paragraph = article.getAttribute('data-paragraph') || '';  // NOUVEAU
            const tagsString = article.getAttribute('data-tags-string') || '';
            let articleTags = [];
            try {
                articleTags = JSON.parse(article.getAttribute('data-tags') || '[]');
            } catch(e) {
                articleTags = [];
            }
            const articleCategory = article.getAttribute('data-category') || '';
            
            const categoryMatch = matchesSelectedFilters(articleCategory, articleTags);
            
            let searchMatch = true;
            if (searchTerm !== '') {
                const titleLower = title.toLowerCase();
                const paragraphLower = paragraph.toLowerCase();  // NOUVEAU
                const tagsLower = tagsString.toLowerCase();
                const categoryLower = articleCategory.toLowerCase();
                
                // Ajout du paragraphe dans la recherche
                searchMatch = titleLower.includes(searchTerm) || 
                            paragraphLower.includes(searchTerm) ||  // NOUVEAU
                            tagsLower.includes(searchTerm) ||
                            categoryLower.includes(searchTerm);
            }
            
            const shouldShow = categoryMatch && searchMatch;
            article.style.display = shouldShow ? '' : 'none';
            if (shouldShow) visibleCount++;
        });
        
        if (resultsCountSpan) {
            resultsCountSpan.textContent = visibleCount;
        }
        
        animateFilteredCards();
        updateNotificationBadge();
        updateCheckboxStates();
        updateFilterButtonAppearance();
    }
        

    
    // Animation des cartes
    function animateFilteredCards() {
        const visibleCards = allArticles.filter(article => article.style.display !== 'none');
        visibleCards.forEach((card) => {
            card.classList.add('filter-highlight');
            setTimeout(() => {
                card.classList.remove('filter-highlight');
            }, 400);
        });
    }
    
    // Mise à jour de la bulle de notification
    function updateNotificationBadge() {
        const filterCount = activeCategories.size;
        
        if (notificationBadge) {
            if (filterCount > 0) {
                notificationBadge.textContent = filterCount;
                notificationBadge.style.display = 'flex';
                notificationBadge.setAttribute('data-count', filterCount);
                
                notificationBadge.classList.add('badge-update');
                setTimeout(() => {
                    notificationBadge.classList.remove('badge-update');
                }, 300);
            } else {
                notificationBadge.style.display = 'none';
                notificationBadge.removeAttribute('data-count');
            }
        }
    }
    
    // Synchroniser l'état des checkboxes
    function updateCheckboxStates() {
        const checkboxes = filterDropdown?.querySelectorAll('.filter-checkbox-option input[type="checkbox"]');
        checkboxes?.forEach(checkbox => {
            const categoryValue = checkbox.value;
            checkbox.checked = activeCategories.has(categoryValue);
        });
    }
    
    // Ajouter ou retirer une catégorie
    function toggleCategory(category) {
        if (activeCategories.has(category)) {
            activeCategories.delete(category);
        } else {
            activeCategories.add(category);
        }
        filterAndSearch();
    }
    
    // Réinitialisation complète
    function resetAllFilters() {
        currentSearchTerm = '';
        activeCategories.clear();
        if (searchInput) searchInput.value = '';
        updateCheckboxStates();
        filterAndSearch();
        closeDropdown();
    }
    
    // Ouvrir le dropdown
    function openDropdown() {
        isDropdownOpen = true;
        if (filterDropdown) {
            filterDropdown.classList.add('show');
        }
        // Ajouter une classe au parent pour le style CSS
        const filterDropdownContainer = document.querySelector('.filter-dropdown');
        if (filterDropdownContainer) {
            filterDropdownContainer.classList.add('open');
        }
        updateFilterButtonAppearance();
    }
    
    // Fermer le dropdown
    function closeDropdown() {
        isDropdownOpen = false;
        if (filterDropdown) {
            filterDropdown.classList.remove('show');
        }
        const filterDropdownContainer = document.querySelector('.filter-dropdown');
        if (filterDropdownContainer) {
            filterDropdownContainer.classList.remove('open');
        }
        updateFilterButtonAppearance();
    }
    
    // Toggle du dropdown
    function toggleDropdown() {
        if (isDropdownOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
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
            toggleDropdown();
        });
        
        document.addEventListener('click', function() {
            closeDropdown();
        });
        
        filterDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Gestion des cases à cocher
        const checkboxes = filterDropdown.querySelectorAll('.filter-checkbox-option input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function(e) {
                e.stopPropagation();
                const categoryValue = this.value;
                toggleCategory(categoryValue);
            });
        });
        
        // Gestion du bouton "Tout désactiver"
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                activeCategories.clear();
                updateCheckboxStates();
                filterAndSearch();
            });
        }
    }
    
    // Initialisation
    initArticles();
    filterAndSearch();
});

