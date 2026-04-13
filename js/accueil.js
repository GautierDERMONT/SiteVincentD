// Carousel Hero Background
function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-bg-slide');
    const dots = document.querySelectorAll('.hero-dot');
    
    // Vérifier si le carousel existe
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    let slideInterval;
    const slideDuration = 5000;

    // PRÉCHARGEMENT DES IMAGES
    function preloadImages() {
        const imageUrls = [
            'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=70',
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=70'
        ];
        
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }

    // Appeler le préchargement dès que possible
    preloadImages();

    function goToSlide(n) {
        // S'assurer que n est valide
        if (n < 0 || n >= slides.length) {
            n = 0; // Retour au début
        }
        
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = n;
        
        // Vérifier que les éléments existent avant d'y accéder
        if (slides[currentSlide]) {
            slides[currentSlide].classList.add('active');
        }
        
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    }

    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        goToSlide(nextIndex);
    }

    function startCarousel() {
        stopCarousel(); // Arrêter avant de redémarrer
        slideInterval = setInterval(nextSlide, slideDuration);
    }

    function stopCarousel() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopCarousel();
            goToSlide(index);
            startCarousel();
        });
        
        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                stopCarousel();
                goToSlide(index);
                startCarousel();
            }
        });
    });

    const carousel = document.querySelector('.hero-bg-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopCarousel);
        carousel.addEventListener('mouseleave', startCarousel);
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopCarousel();
            } else {
                startCarousel();
            }
        });
    }

    // Initialiser avant de démarrer
    goToSlide(0);
    startCarousel();
}

// Animation d'entrée des logos clients en cercle lors du défilement - LOGO CENTRAL EN PREMIER
function initClientLogos() {
    const clientsSection = document.querySelector('.clients');
    const clientLogos = document.querySelectorAll('.client-logo');
    
    if (!clientsSection || clientLogos.length === 0) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Compter les logos non-centraux pour l'indexation
                const peripheralLogos = [...clientLogos].filter(l => !l.classList.contains('client-logo-center'));
                const centerLogo = document.querySelector('.client-logo-center');
                
                // FAIRE APPARAÎTRE LE LOGO CENTRAL EN PREMIER
                if (centerLogo) {
                    // Logo central apparaît immédiatement
                    centerLogo.style.setProperty('--logo-index', 0);
                    centerLogo.style.animationDelay = '0s';
                    centerLogo.classList.add('animate-logo');
                }
                
                // Puis les logos périphériques apparaissent après un délai
                peripheralLogos.forEach((logo, idx) => {
                    const angle = idx * 60;
                    logo.style.setProperty('--logo-index', idx);
                    logo.style.setProperty('--logo-angle', angle);
                    // Délai progressif pour les logos périphériques (commence après 0.3s)
                    const delay = 0.3 + (idx * 0.1);
                    logo.style.animationDelay = `${delay}s`;
                    
                    setTimeout(() => {
                        logo.classList.add('animate-logo');
                    }, delay * 1000);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    observer.observe(clientsSection);
}

// Carousel des services - VERSION AMÉLIORÉE
function initServicesCarousel() {
    console.log('Initialisation du carousel services'); // Debug
    
    const track = document.querySelector('.services-carousel-track');
    const prevBtn = document.querySelector('.carousel-arrow-prev');
    const nextBtn = document.querySelector('.carousel-arrow-next');
    const cards = document.querySelectorAll('.service-card');
    const container = document.querySelector('.services-carousel-container');
    
    // Vérifications approfondies
    if (!track) {
        console.log('Track non trouvé');
        return;
    }
    
    if (!prevBtn || !nextBtn) {
        console.log('Boutons non trouvés');
        return;
    }
    
    if (cards.length === 0) {
        console.log('Aucune carte trouvée');
        return;
    }
    
    console.log(`Carousel initialisé avec ${cards.length} cartes`);
    
    let currentIndex = 0;
    let cardsPerView = getCardsPerView();
    let maxIndex = Math.max(0, cards.length - cardsPerView);
    
    // Mettre à jour le nombre de cartes visibles selon la largeur de l'écran
    function getCardsPerView() {
        if (window.innerWidth <= 768) return 1; // Mobile
        if (window.innerWidth <= 992) return 2; // Tablette
        return 3; // Desktop
    }
    
    // Recalculer maxIndex quand cardsPerView change
    function updateMaxIndex() {
        cardsPerView = getCardsPerView();
        maxIndex = Math.max(0, cards.length - cardsPerView);
        console.log(`cardsPerView: ${cardsPerView}, maxIndex: ${maxIndex}`);
    }
    
    // Calculer la largeur d'une carte (incluant le gap)
    function getCardWidth() {
        if (cards.length === 0) return 0;
        
        // Récupérer la première carte
        const firstCard = cards[0];
        const cardStyle = window.getComputedStyle(firstCard);
        const cardWidth = firstCard.offsetWidth;
        
        // Récupérer le gap du track
        const trackStyle = window.getComputedStyle(track);
        const gap = parseInt(trackStyle.gap) || 30;
        
        // Récupérer les marges si présentes
        const marginLeft = parseInt(cardStyle.marginLeft) || 0;
        const marginRight = parseInt(cardStyle.marginRight) || 0;
        
        return cardWidth + gap + marginLeft + marginRight;
    }
    
    // Mettre à jour le carousel
    function updateCarousel(index) {
        // S'assurer que l'index est dans les limites
        updateMaxIndex();
        index = Math.max(0, Math.min(index, maxIndex));
        
        if (index !== currentIndex) {
            console.log(`Déplacement de ${currentIndex} à ${index}`);
        }
        
        currentIndex = index;
        
        // Calculer le déplacement
        const cardWidth = getCardWidth();
        const translateX = -currentIndex * cardWidth;
        
        // Appliquer la transformation
        track.style.transform = `translateX(${translateX}px)`;
        
        // Activer/désactiver les flèches
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
    
    // Aller à la carte suivante
    function nextSlide() {
        console.log('Clic sur suivant');
        updateMaxIndex();
        if (currentIndex < maxIndex) {
            updateCarousel(currentIndex + 1);
        } else {
            console.log('Déjà à la fin');
        }
    }
    
    // Aller à la carte précédente
    function prevSlide() {
        console.log('Clic sur précédent');
        if (currentIndex > 0) {
            updateCarousel(currentIndex - 1);
        } else {
            console.log('Déjà au début');
        }
    }
    
    // Événements pour les flèches - avec plusieurs méthodes pour garantir
    if (prevBtn) {
        // Supprimer les anciens événements pour éviter les doublons
        prevBtn.removeEventListener('click', prevSlide);
        prevBtn.addEventListener('click', prevSlide);
        
        // Ajouter aussi un événement sur le bouton parent au cas où
        prevBtn.style.cursor = 'pointer';
    }
    
    if (nextBtn) {
        nextBtn.removeEventListener('click', nextSlide);
        nextBtn.addEventListener('click', nextSlide);
        nextBtn.style.cursor = 'pointer';
    }
    
    // Recalculer lors du redimensionnement
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Si on passe en mobile, désactiver le carousel
            if (window.innerWidth <= 768) {
                if (track) {
                    track.style.transform = 'none';
                }
                // Cacher les flèches
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
                return;
            } else {
                // Afficher les flèches
                if (prevBtn) prevBtn.style.display = 'flex';
                if (nextBtn) nextBtn.style.display = 'flex';
            }
            
            const newCardsPerView = getCardsPerView();
            
            // Si le nombre de cartes par vue change
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                maxIndex = Math.max(0, cards.length - cardsPerView);
                
                // Ajuster l'index si nécessaire
                if (currentIndex > maxIndex) {
                    currentIndex = Math.max(0, maxIndex);
                }
                
                // Réinitialiser la position sans animation
                track.style.transition = 'none';
                updateCarousel(currentIndex);
                
                // Réactiver la transition
                setTimeout(() => {
                    track.style.transition = 'transform 0.4s ease-in-out';
                }, 50);
            } else {
                updateCarousel(currentIndex);
            }
        }, 150);
    });
    
    // Support du swipe
    if (window.innerWidth > 768) {
        let touchStartX = 0;
        let touchEndX = 0;
        const minSwipeDistance = 50;
        
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) > minSwipeDistance) {
                if (swipeDistance > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            }
        }, { passive: true });
    }
    
    // Initialiser
    updateMaxIndex();
    updateCarousel(0);
    
    // Vérifier que les boutons sont bien cliquables
    console.log('Carousel prêt - boutons actifs');
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM chargé');
    initHeroCarousel();
    initClientLogos();
    initServicesCarousel();
});

// Réinitialiser le carousel après un chargement dynamique éventuel
window.addEventListener('load', () => {
    console.log('Page chargée');
    // Réinitialiser le carousel pour s'assurer qu'il fonctionne après tout chargement
    setTimeout(() => {
        initServicesCarousel();
    }, 100);
});