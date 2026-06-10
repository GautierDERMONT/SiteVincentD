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
    
    // Mapping des catégories de filtre vers les valeurs possibles
    const filterMapping = {
        'Interview': ['Interview'],
        'Audit': ['Audit'],
        'Optimisation': ['Optimisation'],
        'Transport': ['Transport'],
    };
    
    // =============================================
    // FONCTIONS DE SURlIGNAGE
    // =============================================
    
    // Fonction pour surligner le texte recherché
    function highlightText(text, searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') {
            return text;
        }
        
        // Échapper les caractères spéciaux regex
        const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedTerm})`, 'gi');
        
        return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    }
    
    // Fonction pour restaurer le contenu original
    function restoreOriginalContent() {
        allArticles.forEach(articleLink => {
            const article = articleLink.querySelector('.article-card');
            if (!article) return;
            
            // Restaurer le titre
            const titleElem = article.querySelector('h3');
            if (titleElem && titleElem.getAttribute('data-original-title')) {
                titleElem.innerHTML = titleElem.getAttribute('data-original-title');
            }
            
            // Restaurer la description
            const descElem = article.querySelector('p');
            if (descElem && descElem.getAttribute('data-original-desc')) {
                descElem.innerHTML = descElem.getAttribute('data-original-desc');
            }
            
            // Restaurer les tags
            const tagElems = article.querySelectorAll('.tag');
            tagElems.forEach(tagElem => {
                if (tagElem.getAttribute('data-original-tag')) {
                    tagElem.innerHTML = tagElem.getAttribute('data-original-tag');
                }
            });
        });
    }
    
    // Fonction pour appliquer le surlignage aux articles visibles
    function applyHighlightToVisibleArticles(searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') return;
        
        // Parcourir les articles visibles
        const visibleArticles = allArticles.filter(articleLink => articleLink.style.display !== 'none');
        
        visibleArticles.forEach(articleLink => {
            const article = articleLink.querySelector('.article-card');
            if (!article) return;
            
            // Surligner dans le titre
            const titleElem = article.querySelector('h3');
            if (titleElem) {
                const originalTitle = titleElem.getAttribute('data-original-title') || titleElem.innerText;
                const highlightedTitle = highlightText(originalTitle, searchTerm);
                if (highlightedTitle !== originalTitle) {
                    titleElem.innerHTML = highlightedTitle;
                }
            }
            
            // Surligner dans la description
            const descElem = article.querySelector('p');
            if (descElem) {
                const originalDesc = descElem.getAttribute('data-original-desc') || descElem.innerText;
                const highlightedDesc = highlightText(originalDesc, searchTerm);
                if (highlightedDesc !== originalDesc) {
                    descElem.innerHTML = highlightedDesc;
                }
            }
            
            // Surligner dans les tags
            const tagElems = article.querySelectorAll('.tag');
            tagElems.forEach(tagElem => {
                const originalTag = tagElem.getAttribute('data-original-tag') || tagElem.innerText;
                const highlightedTag = highlightText(originalTag, searchTerm);
                if (highlightedTag !== originalTag) {
                    tagElem.innerHTML = highlightedTag;
                }
            });
        });
    }
    
    // Animation pop des articles
    function animatePopArticles() {
        const visibleArticles = allArticles.filter(articleLink => articleLink.style.display !== 'none');
        
        visibleArticles.forEach((articleLink, index) => {
            const article = articleLink.querySelector('.article-card');
            if (article) {
                article.classList.add('pop-animation');
                setTimeout(() => {
                    article.classList.remove('pop-animation');
                }, 400);
            }
        });
    }
    
    // Vérifier si un article correspond aux catégories/filtres sélectionnés
    function matchesSelectedFilters(articleCategory, articleTags, title, paragraph) {
        if (activeCategories.size === 0) return true;
        
        const titleLower = title.toLowerCase();
        const paragraphLower = paragraph.toLowerCase();
        
        for (let filter of activeCategories) {
            const filterLower = filter.toLowerCase();
            const filterTerms = filterMapping[filter] || [filter];
            
            // Vérification dans la catégorie
            if (filterTerms.includes(articleCategory)) {
                return true;
            }
            
            // Vérification dans les tags
            for (let term of filterTerms) {
                if (articleTags.includes(term)) {
                    return true;
                }
            }
            
            // Vérification dans le TITRE
            if (titleLower.includes(filterLower)) {
                return true;
            }
            
            // Vérification dans la DESCRIPTION
            if (paragraphLower.includes(filterLower)) {
                return true;
            }
        }
        
        return false;
    }
    
    // Récupérer tous les articles
    function initArticles() {
        if (articlesGrid) {
            // Récupérer les liens <a> qui contiennent les articles
            allArticles = Array.from(articlesGrid.querySelectorAll('.article-card-link'));
            console.log("Articles trouvés :", allArticles.length);
            
            allArticles.forEach(articleLink => {
                const article = articleLink.querySelector('.article-card');
                if (!article) return;
                
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
                
                // Sauvegarder le contenu HTML original
                if (titleElem && !titleElem.getAttribute('data-original-title')) {
                    titleElem.setAttribute('data-original-title', titleElem.innerHTML);
                }
                if (paragraphElem && !paragraphElem.getAttribute('data-original-desc')) {
                    paragraphElem.setAttribute('data-original-desc', paragraphElem.innerHTML);
                }
                article.querySelectorAll('.tag').forEach(tagElem => {
                    if (!tagElem.getAttribute('data-original-tag')) {
                        tagElem.setAttribute('data-original-tag', tagElem.innerHTML);
                    }
                });
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
    
    function filterAndSearch(isFilterClick = false) {
        if (!allArticles.length) return;
        
        let visibleCount = 0;
        const searchTerm = currentSearchTerm.toLowerCase().trim();
        
        // D'abord, masquer/afficher les articles
        allArticles.forEach(articleLink => {
            const article = articleLink.querySelector('.article-card');
            if (!article) return;
            
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
            
            const categoryMatch = matchesSelectedFilters(articleCategory, articleTags, title, paragraph);
            
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
            articleLink.style.display = shouldShow ? '' : 'none';
            if (shouldShow) visibleCount++;
        });
        
        // Restaurer le contenu original puis appliquer le surlignage
        restoreOriginalContent();
        if (searchTerm !== '') {
            applyHighlightToVisibleArticles(currentSearchTerm);
        }
        
        if (resultsCountSpan) {
            resultsCountSpan.textContent = visibleCount;
        }
        
        // PLUS DE RÉORGANISATION DE LA GRILLE - on garde l'ordre original
        
        // Si c'est un clic sur filtre, on anime les articles
        if (isFilterClick) {
            animatePopArticles();
        }
        
        updateNotificationBadge();
        updateCheckboxStates();
        updateFilterButtonAppearance();
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
        filterAndSearch(true);
    }
    
    // Réinitialisation complète
    function resetAllFilters() {
        currentSearchTerm = '';
        activeCategories.clear();
        if (searchInput) searchInput.value = '';
        updateCheckboxStates();
        filterAndSearch(true);
        
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

    // === GESTION DU SCROLL ===
    let lastScrollY = window.scrollY;
    let scrollTimeout = null;
    
    function handlePageScroll() {
        if (!isDropdownOpen) return;
        
        const currentScrollY = window.scrollY;
        const scrollDelta = Math.abs(currentScrollY - lastScrollY);
        
        if (scrollDelta > 10) {
            closeDropdown();
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
                scrollTimeout = null;
            }
        }
        
        lastScrollY = currentScrollY;
    }
    
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
    
    window.addEventListener('scroll', onScrollHandler);
    
    if (filterDropdown) {
        const scrollContainer = filterDropdown.querySelector('.filter-scroll-container');
        
        if (scrollContainer) {
            scrollContainer.style.overflowY = 'auto';
            scrollContainer.style.maxHeight = 'calc(2.5 * 42px)';
            
            scrollContainer.addEventListener('wheel', function(e) {
                const isAtTop = scrollContainer.scrollTop === 0;
                const isAtBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop === scrollContainer.clientHeight;
                
                if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
                    return;
                }
                
                e.stopPropagation();
            });
        }
    }
    
    // Événement de recherche
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            currentSearchTerm = e.target.value;
            filterAndSearch(false);
        });
    }
    
    // Gestion du dropdown filtre
    if (filterToggleBtn && filterDropdown) {
        filterToggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleDropdown();
        });
        
        document.addEventListener('click', function(e) {
            if (filterToggleBtn.contains(e.target) || filterDropdown.contains(e.target)) {
                return;
            }
            closeDropdown();
        });
        
        filterDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        const checkboxes = filterDropdown.querySelectorAll('.filter-checkbox-option input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function(e) {
                e.stopPropagation();
                const categoryValue = this.value;
                toggleCategory(categoryValue);
            });
        });
        
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                resetAllFilters();
            });
        }
    }
    
    // Initialisation
    initArticles();
    filterAndSearch(false);
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