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
        'Interview': ['Interview'],
        'filtre1': ['filtre1'],
        'filtre2': ['filtre2'],
        'filtre3': ['filtre3'],
    };
    
    // Récupérer tous les articles
    function initArticles() {
        if (articlesGrid) {
            allArticles = Array.from(articlesGrid.querySelectorAll('.article-card'));
            console.log("Articles trouvés :", allArticles.length);
            
            allArticles.forEach(article => {
                const titleElem = article.querySelector('h3');
                const title = titleElem ? titleElem.innerText : '';
                
                const paragraphElem = article.querySelector('p');
                const paragraph = paragraphElem ? paragraphElem.innerText : '';
                
                const tags = Array.from(article.querySelectorAll('.tag'))
                    .map(tag => tag.innerText.trim());
                
                const categorySpan = article.querySelector('.article-category');
                const articleCategory = categorySpan ? categorySpan.innerText.trim() : '';
                
                article.setAttribute('data-title', title);
                article.setAttribute('data-paragraph', paragraph);
                article.setAttribute('data-tags', JSON.stringify(tags));
                article.setAttribute('data-tags-string', tags.join(' '));
                article.setAttribute('data-category', articleCategory);
            });
        }
    }
    
    // Mettre à jour l'apparence du bouton filtre
    function updateFilterButtonAppearance() {
        const hasActiveFilters = activeCategories.size > 0;
        
        if (filterToggleBtn) {
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
        if (!allArticles.length) return;
        
        let visibleCount = 0;
        const searchTerm = currentSearchTerm.toLowerCase().trim();
        
        allArticles.forEach(article => {
            const title = article.getAttribute('data-title') || '';
            const paragraph = article.getAttribute('data-paragraph') || '';
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
                const paragraphLower = paragraph.toLowerCase();
                const tagsLower = tagsString.toLowerCase();
                const categoryLower = articleCategory.toLowerCase();
                
                searchMatch = titleLower.includes(searchTerm) || 
                            paragraphLower.includes(searchTerm) ||
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
                notificationBadge.classList.add('badge-update');
                setTimeout(() => {
                    notificationBadge.classList.remove('badge-update');
                }, 300);
            } else {
                notificationBadge.style.display = 'none';
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

    // === GESTION DU SCROLL : permet le scroll interne et ferme le dropdown quand on scroll la page ===
    let lastScrollY = window.scrollY;
    let scrollTimeout = null;
    
    // NE PAS fermer le dropdown si on scrolle à l'intérieur du conteneur
    function handlePageScroll() {
        if (!isDropdownOpen) return;
        
        const currentScrollY = window.scrollY;
        const scrollDelta = Math.abs(currentScrollY - lastScrollY);
        
        // Seuil de 10px pour éviter les fermetures accidentelles
        if (scrollDelta > 10) {
            closeDropdown();
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
                scrollTimeout = null;
            }
        }
        
        lastScrollY = currentScrollY;
    }
    
    // Version optimisée pour les performances
    let ticking = false;
    function onScrollHandler() {
        if (!isDropdownOpen) return;
        
        if (!ticking) {
            requestAnimationFrame(() => {
                handlePageScroll();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Ajouter l'écouteur de scroll sur la fenêtre
    window.addEventListener('scroll', onScrollHandler);
    
    // === PERMETTRE LE SCROLL À L'INTÉRIEUR DU DROPDOWN SANS FERMER ===
    if (filterDropdown) {
        const scrollContainer = filterDropdown.querySelector('.filter-scroll-container');
        
        if (scrollContainer) {
            // S'assurer que le conteneur est scrollable
            scrollContainer.style.overflowY = 'auto';
            scrollContainer.style.maxHeight = 'calc(2.5 * 42px)'; // déjà dans le CSS
            
            // Empêcher la propagation du scroll de la roulette quand on est dans le conteneur
            scrollContainer.addEventListener('wheel', function(e) {
                const isAtTop = scrollContainer.scrollTop === 0;
                const isAtBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop === scrollContainer.clientHeight;
                
                // Si on est en haut et qu'on scroll vers le haut, ou en bas et qu'on scroll vers le bas
                if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                    // On laisse le scroll passer à la page (ne rien faire)
                    return;
                }
                
                // Sinon, on laisse le scroll se faire à l'intérieur sans fermer le dropdown
                // On n'appelle pas e.preventDefault() pour que le scroll fonctionne normalement
                // On arrête juste la propagation pour ne pas déclencher la fermeture
                e.stopPropagation();
            });
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
        
        // Fermer le dropdown lorsqu'on clique ailleurs sur la page
        document.addEventListener('click', function(e) {
            // Ne pas fermer si on clique sur le bouton filtre ou à l'intérieur du dropdown
            if (filterToggleBtn.contains(e.target) || filterDropdown.contains(e.target)) {
                return;
            }
            closeDropdown();
        });
        
        // Empêcher la fermeture quand on clique à l'intérieur du dropdown
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

// Ajouter la croix de suppression dans la barre de recherche
function addClearSearchButton() {
    const searchContainer = document.querySelector('.search-input-container');
    const searchInput = document.getElementById('blog-search-input');
    
    if (!searchContainer || !searchInput) return;
    
    if (searchContainer.querySelector('.search-clear-btn')) return;
    
    const clearBtn = document.createElement('button');
    clearBtn.className = 'search-clear-btn';
    clearBtn.setAttribute('aria-label', 'Effacer la recherche');
    clearBtn.innerHTML = '<i class="fas fa-times-circle"></i>';
    searchContainer.appendChild(clearBtn);
    
    function toggleClearButton() {
        if (searchInput.value.length > 0) {
            clearBtn.classList.add('visible');
        } else {
            clearBtn.classList.remove('visible');
        }
    }
    
    searchInput.addEventListener('input', toggleClearButton);
    
    clearBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        searchInput.focus();
        toggleClearButton();
        
        if (typeof filterAndSearchArticles === 'function') {
            filterAndSearchArticles();
        } else if (typeof updateBlogSearch === 'function') {
            updateBlogSearch();
        }
    });
    
    toggleClearButton();
}

document.addEventListener('DOMContentLoaded', addClearSearchButton);