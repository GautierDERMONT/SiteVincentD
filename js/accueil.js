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

    preloadImages();

    function goToSlide(n) {
        if (n < 0 || n >= slides.length) {
            n = 0;
        }
        
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = n;
        
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
        stopCarousel();
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

    goToSlide(0);
    startCarousel();
}

// ===== ANIMATION DES LOGOS CLIENTS AU SCROLL =====
function initClientLogos() {
    const clientsSection = document.querySelector('.clients');
    const logoItems = document.querySelectorAll('.client-logo-item');
    
    console.log('initClientLogos appelée, logos trouvés:', logoItems.length);
    
    if (!clientsSection || logoItems.length === 0) return;
    
    // S'assurer que les logos sont bien cachés au départ
    logoItems.forEach(logo => {
        logo.style.opacity = '0';
        logo.style.transform = 'translateY(30px) scale(0.9)';
        logo.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        // Supprimer les anciennes animations
        logo.style.animation = 'none';
    });
    
    let animationTriggered = false;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animationTriggered) {
                console.log('Section clients visible, déclenchement animation');
                animationTriggered = true;
                
                // Faire apparaître les logos un par un
                logoItems.forEach((logo, index) => {
                    setTimeout(() => {
                        logo.style.opacity = '1';
                        logo.style.transform = 'translateY(0) scale(1)';
                    }, index * 60);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    observer.observe(clientsSection);
}

// Carousel des services
function initServicesCarousel() {
    console.log('Initialisation du carousel services');
    
    const track = document.querySelector('.services-carousel-track');
    const prevBtn = document.querySelector('.carousel-arrow-prev');
    const nextBtn = document.querySelector('.carousel-arrow-next');
    const cards = document.querySelectorAll('.service-card');
    const dotsContainer = document.querySelector('.services-carousel-dots');
    
    if (!track || !prevBtn || !nextBtn || cards.length === 0) {
        console.log('Carousel: éléments manquants');
        return;
    }
    
    let currentIndex = 0;
    let currentPage = 0;
    let cardsPerView = getCardsPerView();
    let maxIndex = Math.max(0, cards.length - cardsPerView);
    let dotElements = [];
    
    function getCardsPerView() {
        if (window.innerWidth <= 768) return 1;
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
    
    // Créer les points
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        dotElements = [];
        const totalDots = Math.ceil(cards.length / getCardsPerView());
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('span');
            dot.className = 'services-dot';
            dot.dataset.index = i;
            dot.onclick = function(e) {
                e.stopPropagation();
                console.log('Dot cliqué:', i);
                goToPage(i);
            };
            dotsContainer.appendChild(dot);
            dotElements.push(dot);
        }
        
        // Mettre à jour l'état des dots
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
        console.log('goToPage appelé avec page:', page);
        updateMaxIndex();
        const cardsPerViewCurrent = getCardsPerView();
        let startIndex = page * cardsPerViewCurrent;
        
        if (startIndex > maxIndex) {
            startIndex = maxIndex;
        }
        currentIndex = startIndex;
        currentPage = page;
        
        console.log('goToPage: nouveau currentIndex =', currentIndex);
        
        const cardWidth = getCardWidth();
        const translateX = -currentIndex * cardWidth;
        track.style.transform = 'translateX(' + translateX + 'px)';
        
        updateDots();
        updateButtons();
    }
    
    // Aller à un slide (pour les flèches) - VERSION CORRIGÉE
    function goToSlide(index) {
        updateMaxIndex();
        index = Math.max(0, Math.min(index, maxIndex));
        currentIndex = index;
        
        // Recalculer la page en fonction de l'index et du nombre de cartes par vue
        const cardsPerViewCurrent = getCardsPerView();
        let newPage = Math.floor(currentIndex / cardsPerViewCurrent);
        
        // Vérifier si on est à la fin et ajuster la page
        const totalDots = Math.ceil(cards.length / cardsPerViewCurrent);
        if (currentIndex === maxIndex) {
            // Si on est à la dernière position, la page est la dernière
            newPage = totalDots - 1;
        }
        
        // S'assurer que la page ne dépasse pas le nombre total de dots
        if (newPage >= totalDots) {
            newPage = totalDots - 1;
        }
        if (newPage < 0) {
            newPage = 0;
        }
        
        currentPage = newPage;
        
        const cardWidth = getCardWidth();
        const translateX = -currentIndex * cardWidth;
        track.style.transform = 'translateX(' + translateX + 'px)';
        
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
            if (window.innerWidth <= 768) {
                track.style.transform = 'none';
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
                if (dotsContainer) dotsContainer.style.display = 'none';
                return;
            } else {
                prevBtn.style.display = 'flex';
                nextBtn.style.display = 'flex';
                if (dotsContainer) dotsContainer.style.display = 'flex';
            }
            
            const newCardsPerView = getCardsPerView();
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                maxIndex = Math.max(0, cards.length - cardsPerView);
                if (currentIndex > maxIndex) currentIndex = Math.max(0, maxIndex);
                track.style.transition = 'none';
                createDots();
                goToSlide(currentIndex);
                setTimeout(function() {
                    track.style.transition = 'transform 0.4s ease-in-out';
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
    
    console.log('Carousel initialisé avec ' + dotElements.length + ' dots');
}

// Lazy loading pour les images des logos
function initLazyLoading() {
    const logoImages = document.querySelectorAll('.client-logo-item img');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    }, { threshold: 0.1 });
    
    logoImages.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM chargé');
    initHeroCarousel();
    initClientLogos();
    initServicesCarousel();
    initLazyLoading();
});

window.addEventListener('load', () => {
    console.log('Page chargée');
}); 