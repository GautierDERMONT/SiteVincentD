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

// Animation d'entrée des logos clients en cercle lors du défilement
document.addEventListener('DOMContentLoaded', function() {
    const clientsSection = document.querySelector('.clients');
    const clientLogos = document.querySelectorAll('.client-logo');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                clientLogos.forEach((logo, index) => {
                    logo.style.setProperty('--logo-index', index);
                    logo.style.setProperty('--logo-angle', index * 60);
                    logo.style.animationDelay = `${index * 0.1}s`;
                    
                    setTimeout(() => {
                        logo.classList.add('animate-logo');
                    }, index * 100);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    if (clientsSection) {
        observer.observe(clientsSection);
    }
});

// Initialiser le carousel quand le DOM est chargé
document.addEventListener('DOMContentLoaded', initHeroCarousel);