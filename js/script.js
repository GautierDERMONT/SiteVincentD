// Menu burger responsive
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (burger && navMenu) {
        // Positionne le menu exactement sous la navbar (évite le trait bleu)
        function updateMenuPosition() {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                const navbarHeight = navbar.getBoundingClientRect().height;
                document.documentElement.style.setProperty('--navbar-height', navbarHeight + 'px');
            }
        }
        updateMenuPosition();
        window.addEventListener('resize', updateMenuPosition);

        burger.addEventListener('click', function() {
            updateMenuPosition(); // recalcule au moment du clic
            burger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Fermer le menu en cliquant sur un lien
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // ===== ANIMATION AU SCROLL AMÉLIORÉE =====
    
    // Configuration de l'observateur avec des options optimisées
    const observerOptions = {
        threshold: 0.15,      // Déclenche quand 15% de l'élément est visible
        rootMargin: '0px 0px -30px 0px'  // Petit décalage pour un meilleur timing
    };
    
    // Créer l'observateur avec une fonction de rappel optimisée
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ajouter la classe d'animation
                entry.target.classList.add('animate-in');
                
                // Pour les éléments stagger (cascade), ajouter un délai progressif
                if (entry.target.classList.contains('stagger-container')) {
                    const items = entry.target.querySelectorAll('.stagger-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animate-in');
                        }, index * 80); // Délai de 80ms entre chaque élément
                    });
                }
                
                // Une fois animé, on peut arrêter de l'observer (optionnel)
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Configuration des animations par défaut
    const defaultAnimatedElements = [
        '.service-card',
        '.testimonial-card',
        '.hero-content',
        '.about-content',
        '.expertise-card',
        '.blog-card',
        '.contact-info',
        '.contact-form',
        '.cta-content',
        '.feature-card'
    ];
    
    // Observer tous les éléments par défaut avec fade-up
    defaultAnimatedElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            // Ajouter la classe d'animation si elle n'existe pas déjà
            if (!el.classList.contains('fade-up') && 
                !el.classList.contains('fade-left') && 
                !el.classList.contains('fade-right') && 
                !el.classList.contains('fade-zoom') &&
                !el.classList.contains('fade-bounce')) {
                el.classList.add('fade-up');
            }
            observer.observe(el);
        });
    });
    
    // Observer les éléments avec des animations personnalisées via data attribute
    document.querySelectorAll('[data-animation]').forEach(el => {
        const animationType = el.getAttribute('data-animation');
        el.classList.add(animationType);
        observer.observe(el);
    });
    
    // Observer les conteneurs stagger
    document.querySelectorAll('.stagger-container').forEach(container => {
        observer.observe(container);
        // Les enfants seront animés via le callback
    });
    
    // Animation des statistiques dans la section hero
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            // Éviter de ré-animer plusieurs fois
            if (stat.getAttribute('data-animated') === 'true') return;
            
            const originalText = stat.textContent;
            const match = originalText.match(/([+-]?)(\d+)([+%]?)/);
            if (!match) return;
            
            const symbol = match[1] || '';
            const finalValue = parseInt(match[2]);
            const suffix = match[3] || '';
            
            let startValue = 0;
            const duration = 2000;
            const increment = finalValue / (duration / 16);
            
            const timer = setInterval(() => {
                startValue += increment;
                if (startValue >= finalValue) {
                    stat.textContent = symbol + finalValue + suffix;
                    clearInterval(timer);
                } else {
                    stat.textContent = symbol + Math.floor(startValue) + suffix;
                }
            }, 16);
            
            stat.setAttribute('data-animated', 'true');
        });
    }
    
    // Lancer l'animation des stats quand la section est visible
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(statsSection);
    }
    
    // Smooth scroll pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Optionnel : Ajouter une classe au body quand on scroll pour des effets supplémentaires
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        document.body.classList.add('scrolling');
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            document.body.classList.remove('scrolling');
        }, 150);
    });
});


// Lazy loading pour les images du carousel hero
document.addEventListener('DOMContentLoaded', function() {
    // Chargement différé des images hero
    const lazyBgElements = document.querySelectorAll('[data-bg]');
    
    const bgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const bgUrl = element.getAttribute('data-bg');
                if (bgUrl) {
                    element.style.backgroundImage = `url('${bgUrl}')`;
                    element.removeAttribute('data-bg');
                }
                bgObserver.unobserve(element);
            }
        });
    }, { rootMargin: '200px' });
    
    lazyBgElements.forEach(el => bgObserver.observe(el));
});


// ===== SPINNER DE CHARGEMENT BLEU/ORANGE AVEC FLÈCHE =====
(function initScrollSpinner() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createScrollSpinner);
    } else {
        createScrollSpinner();
    }
    
    function createScrollSpinner() {
        if (document.querySelector('.scroll-spinner')) return;
        
        // Créer le spinner
        const spinner = document.createElement('div');
        spinner.className = 'scroll-spinner';
        spinner.innerHTML = `
            <div class="spinner-ring"></div>
            <div class="spinner-core">
                <i class="fas fa-arrow-up spinner-icon"></i>
            </div>
        `;
        document.body.appendChild(spinner);
        
        // Récupérer les éléments
        const ring = spinner.querySelector('.spinner-ring');
        
        function updateScrollProgress() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
            
            // Mettre à jour l'anneau de progression
            if (ring) {
                const progressDeg = (scrollPercent / 100) * 360;
                ring.style.background = `conic-gradient(from 0deg, #ff7e30 ${progressDeg}deg, #e0e0e0 ${progressDeg}deg)`;
                // Stocker la progression pour le hover
                ring.style.setProperty('--progress-deg', `${progressDeg}deg`);
            }
            
            // Gérer l'affichage du spinner
            if (scrollTop > 100) {
                spinner.classList.add('show');
            } else {
                spinner.classList.remove('show');
            }
        }
        
        // Optimisation du scroll avec requestAnimationFrame
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(function() {
                    updateScrollProgress();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        window.addEventListener('resize', updateScrollProgress);
        updateScrollProgress();
        
        // Clic pour revenir en haut
        spinner.addEventListener('click', function(e) {
            e.stopPropagation();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            if (window.innerWidth <= 768) {
                spinner.classList.add('clicked');
                setTimeout(() => {
                    spinner.classList.remove('clicked');
                }, 300);
            }
        });
    }
})();

