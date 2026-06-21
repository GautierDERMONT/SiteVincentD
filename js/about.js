// =============================================
// GESTION DE LA TIMELINE (Parcours professionnel)
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    const btnMore1 = document.getElementById('btn-show-more-1');
    const btnMore2 = document.getElementById('btn-show-more-2');
    const btnLess = document.getElementById('btn-show-less');
    
    if (btnMore1) {
        let step = 0; // 0: rien, 1: groupe1 visible, 2: groupe2 visible
        
        // Récupérer les éléments des groupes
        const group1Items = document.querySelectorAll('.hidden-timeline[data-group="1"]');
        const group2Items = document.querySelectorAll('.hidden-timeline[data-group="2"]');
        
        // État initial
        btnMore2.style.display = 'none';
        btnLess.style.display = 'none';
        
        // Fonction pour scroller vers un élément avec un délai
        function scrollToElement(element, offset = 100) {
            if (!element) return;
            
            setTimeout(() => {
                const rect = element.getBoundingClientRect();
                const absoluteTop = rect.top + window.pageYOffset;
                window.scrollTo({
                    top: absoluteTop - offset,
                    behavior: 'smooth'
                });
            }, 150);
        }

        // Fonction pour scroller PUIS masquer les éléments une fois arrivé
        function scrollThenHide(targetElement, itemsToHide, buttonsToUpdate, offset = 100) {
            if (!targetElement) return;

            const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({ top: targetTop, behavior: 'smooth' });

            const scrollDuration = Math.abs(window.pageYOffset - targetTop) / 3;
            const delay = Math.min(Math.max(scrollDuration, 400), 800);

            setTimeout(() => {
                itemsToHide.forEach(item => item.style.display = 'none');
                buttonsToUpdate();
            }, delay);
        }
        
        // Afficher groupe 1
        btnMore1.addEventListener('click', function() {
            group1Items.forEach(item => item.style.display = 'block');
            step = 1;
            btnMore1.style.display = 'none';
            btnMore2.style.display = 'inline-block';
            btnLess.style.display = 'inline-block';
            
            scrollToElement(group1Items[0], 100);
        });
        
        // Afficher groupe 2
        btnMore2.addEventListener('click', function() {
            group2Items.forEach(item => item.style.display = 'block');
            step = 2;
            btnMore2.style.display = 'none';
            
            scrollToElement(group2Items[0], 100);
        });
        
        // Masquer progressivement
        btnLess.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (step === 2) {
                step = 1;
                scrollThenHide(
                    group1Items[0],
                    group2Items,
                    () => { btnMore2.style.display = 'inline-block'; }
                );
                
            } else if (step === 1) {
                step = 0;
                const allInitialItems = document.querySelectorAll('.timeline-item:not(.hidden-timeline)');
                const lastInitial = allInitialItems[allInitialItems.length - 1];

                scrollThenHide(
                    lastInitial,
                    group1Items,
                    () => {
                        btnMore1.style.display = 'inline-block';
                        btnMore2.style.display = 'none';
                        btnLess.style.display = 'none';
                    }
                );
            }
        });
    }

    // =============================================
    // CARROUSEL DES CERTIFICATIONS
    // =============================================
    initCertCarousel();
});

// =============================================
// CARROUSEL CERTIFICATIONS - Swipe fluide
// =============================================
function initCertCarousel() {
    console.log('Initialisation du carousel certifications avec swipe fluide');
    
    const track = document.querySelector('.cert-carousel-track');
    const container = document.querySelector('.cert-carousel-container');
    const prevBtn = document.querySelector('.cert-carousel-arrow-prev');
    const nextBtn = document.querySelector('.cert-carousel-arrow-next');
    const cards = document.querySelectorAll('.cert-carousel-track .cert-card');
    const dotsContainer = document.querySelector('.cert-carousel-dots');
    
    if (!track || !prevBtn || !nextBtn || cards.length === 0) {
        console.log('Carousel certifications: éléments manquants');
        return;
    }
    
    let currentIndex = 0;
    let currentPage = 0;
    let cardsPerView = getCardsPerView();
    let maxIndex = Math.max(0, cards.length - cardsPerView);
    let dotElements = [];
    
    // Variables pour le swipe
    let touchStartX = 0;
    let touchStartY = 0;
    let touchCurrentX = 0;
    let isSwiping = false;
    let isDragging = false;
    let startTranslateX = 0;
    let currentTranslateX = 0;
    let isVerticalScroll = false;
    
    function getCardsPerView() {
        if (window.innerWidth <= 576) return 1;
        if (window.innerWidth <= 992) return 2;
        return 3;
    }
    
    function updateMaxIndex() {
        cardsPerView = getCardsPerView();
        maxIndex = Math.max(0, cards.length - cardsPerView);
    }
    
    function getCardWidth() {
        if (cards.length === 0) return 0;
        const firstCard = cards[0];
        const cardWidth = firstCard.offsetWidth;
        const trackStyle = window.getComputedStyle(track);
        const gap = parseInt(trackStyle.gap) || 30;
        return cardWidth + gap;
    }
    
    function getTranslateX() {
        const computedStyle = window.getComputedStyle(track);
        const matrix = computedStyle.transform;
        if (matrix === 'none') return 0;
        const values = matrix.match(/matrix.*\((.+)\)/);
        if (values) {
            const nums = values[1].split(', ');
            return parseFloat(nums[4]) || 0;
        }
        return 0;
    }
    
    // Créer les points
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        dotElements = [];
        const totalDots = Math.ceil(cards.length / getCardsPerView());
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('span');
            dot.className = 'cert-dot';
            dot.dataset.index = i;
            dot.onclick = function(e) {
                e.stopPropagation();
                goToPage(i);
            };
            dotsContainer.appendChild(dot);
            dotElements.push(dot);
        }
        
        updateDots();
    }
    
    // Mettre à jour les dots
    function updateDots() {
        if (dotElements.length === 0) return;
        
        dotElements.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPage);
        });
    }
    
    // Aller à une page (pour les dots)
    function goToPage(page) {
        updateMaxIndex();
        const cardsPerViewCurrent = getCardsPerView();
        let startIndex = page * cardsPerViewCurrent;
        
        if (startIndex > maxIndex) {
            startIndex = maxIndex;
        }
        currentIndex = startIndex;
        currentPage = page;
        
        const cardWidth = getCardWidth();
        const translateX = -currentIndex * cardWidth;
        track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        track.style.transform = 'translateX(' + translateX + 'px)';
        currentTranslateX = translateX;
        
        updateDots();
        updateButtons();
    }
    
    // Aller à un slide (pour les flèches)
    function goToSlide(index) {
        updateMaxIndex();
        index = Math.max(0, Math.min(index, maxIndex));
        currentIndex = index;
        
        const cardsPerViewCurrent = getCardsPerView();
        let newPage = Math.floor(currentIndex / cardsPerViewCurrent);
        
        const totalDots = Math.ceil(cards.length / cardsPerViewCurrent);
        if (currentIndex === maxIndex) {
            newPage = totalDots - 1;
        }
        
        if (newPage >= totalDots) {
            newPage = totalDots - 1;
        }
        if (newPage < 0) {
            newPage = 0;
        }
        
        currentPage = newPage;
        
        const cardWidth = getCardWidth();
        const translateX = -currentIndex * cardWidth;
        track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        track.style.transform = 'translateX(' + translateX + 'px)';
        currentTranslateX = translateX;
        
        updateDots();
        updateButtons();
    }
    
    function updateButtons() {
        if (prevBtn) {
            prevBtn.disabled = currentIndex === 0;
            prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
            prevBtn.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentIndex >= maxIndex;
            nextBtn.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
            nextBtn.style.cursor = currentIndex >= maxIndex ? 'not-allowed' : 'pointer';
        }
    }
    
    function nextSlide() {
        if (currentIndex < maxIndex) {
            goToSlide(currentIndex + 1);
        }
    }
    
    function prevSlide() {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        }
    }
    
    // =============================================
    // GESTION DU SWIPE TACTILE - Version fluide
    // =============================================
    
    // Détecter le début du touch
    track.addEventListener('touchstart', function(e) {
        const touch = e.changedTouches[0];
        touchStartX = touch.screenX;
        touchStartY = touch.screenY;
        touchCurrentX = touchStartX;
        isSwiping = true;
        isDragging = false;
        isVerticalScroll = false;
        
        // Récupérer la position actuelle
        startTranslateX = getTranslateX();
        currentTranslateX = startTranslateX;
        
        // Désactiver la transition pendant le swipe
        track.style.transition = 'none';
        
    }, { passive: true });
    
    // Détecter le mouvement du doigt
    track.addEventListener('touchmove', function(e) {
        if (!isSwiping) return;
        
        const touch = e.changedTouches[0];
        const deltaX = touch.screenX - touchStartX;
        const deltaY = touch.screenY - touchStartY;
        touchCurrentX = touch.screenX;
        
        // Détecter si c'est un swipe horizontal ou vertical
        if (!isDragging && !isVerticalScroll) {
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
                isDragging = true;
                isVerticalScroll = false;
                e.preventDefault(); // Empêcher le scroll vertical
            } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
                isVerticalScroll = true;
                isDragging = false;
                return;
            }
        }
        
        if (!isDragging || isVerticalScroll) return;
        
        e.preventDefault(); // Empêcher le scroll vertical
        
        const cardWidth = getCardWidth();
        const maxTranslate = 0;
        const minTranslate = -maxIndex * cardWidth;
        
        let newTranslate = startTranslateX + deltaX;
        
        // Résistance quand on dépasse les limites
        if (newTranslate > maxTranslate) {
            newTranslate = maxTranslate + (newTranslate - maxTranslate) * 0.2;
        } else if (newTranslate < minTranslate) {
            newTranslate = minTranslate + (newTranslate - minTranslate) * 0.2;
        }
        
        track.style.transform = 'translateX(' + newTranslate + 'px)';
        currentTranslateX = newTranslate;
        
    }, { passive: false });
    
    // Détecter la fin du touch
    track.addEventListener('touchend', function(e) {
        if (!isSwiping) return;
        isSwiping = false;
        
        if (isVerticalScroll || !isDragging) {
            isDragging = false;
            return;
        }
        
        const deltaX = touchCurrentX - touchStartX;
        const cardWidth = getCardWidth();
        const threshold = cardWidth * 0.15; // 15% de la largeur d'une carte
        
        // Réactiver la transition avec easing
        track.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        if (Math.abs(deltaX) > threshold) {
            if (deltaX < 0 && currentIndex < maxIndex) {
                // Swipe vers la gauche -> suivant
                goToSlide(currentIndex + 1);
            } else if (deltaX > 0 && currentIndex > 0) {
                // Swipe vers la droite -> précédent
                goToSlide(currentIndex - 1);
            } else {
                // Revenir à la position actuelle
                goToSlide(currentIndex);
            }
        } else {
            // Swipe trop court -> revenir à la position avec snap
            goToSlide(currentIndex);
        }
        
        isDragging = false;
        touchStartX = 0;
        touchStartY = 0;
        touchCurrentX = 0;
        
    }, { passive: true });
    
    // Annuler le swipe si on quitte le track
    track.addEventListener('touchcancel', function(e) {
        isSwiping = false;
        isDragging = false;
        isVerticalScroll = false;
        track.style.transition = 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        goToSlide(currentIndex);
    }, { passive: true });
    
    // =============================================
    // FIN GESTION DU SWIPE
    // =============================================
    
    // Nettoyer les anciens événements
    prevBtn.onclick = null;
    nextBtn.onclick = null;
    
    // Attacher les nouveaux événements
    prevBtn.onclick = prevSlide;
    nextBtn.onclick = nextSlide;
    
    // Gestion du redimensionnement
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            const newCardsPerView = getCardsPerView();
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                maxIndex = Math.max(0, cards.length - cardsPerView);
                if (currentIndex > maxIndex) currentIndex = Math.max(0, maxIndex);
                track.style.transition = 'none';
                createDots();
                goToSlide(currentIndex);
                setTimeout(function() {
                    track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                }, 50);
            } else {
                goToSlide(currentIndex);
            }
        }, 150);
    });
    
    // INITIALISATION
    updateMaxIndex();
    createDots();
    goToSlide(0);
    
    console.log('Carousel certifications initialisé avec swipe fluide, ' + dotElements.length + ' dots, ' + cardsPerView + ' carte(s) par vue');
}