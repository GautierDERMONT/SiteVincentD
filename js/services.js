// Script pour l'animation des statistiques
document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner tous les blocs de statistiques
    const statNumbers = document.querySelectorAll('.services-premium-stats .stat-number');
    
    // Vérifier si les éléments existent
    if (statNumbers.length === 0) return;
    
    // Observer l'apparition des statistiques dans la vue
    const observerOptions = {
        threshold: 0.3, // Déclenche quand 30% de l'élément est visible
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statElement = entry.target;
                animateNumber(statElement);
                observer.unobserve(statElement); // Ne déclencher qu'une seule fois
            }
        });
    }, observerOptions);
    
    // Observer chaque élément de statistique
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
    
    // Fonction d'animation du compteur
    function animateNumber(element) {
        // Récupérer la valeur cible (ex: "50+" -> 50, "15+" -> 15, "100%" -> 100)
        const textContent = element.textContent;
        let targetValue = parseFloat(textContent);
        let suffix = '';
        
        // Gérer le suffixe (+ ou %)
        if (textContent.includes('+')) {
            suffix = '+';
        } else if (textContent.includes('%')) {
            suffix = '%';
        }
        
        // Vérifier que targetValue est un nombre valide
        if (isNaN(targetValue)) return;
        
        let currentValue = 0;
        const duration = 2500; // Durée de l'animation en ms (2 secondes)
        const stepTime = 20; // Pas de temps en ms
        const steps = duration / stepTime;
        const increment = targetValue / steps;
        
        const timer = setInterval(function() {
            currentValue += increment;
            
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                element.textContent = Math.floor(currentValue) + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(currentValue) + suffix;
            }
        }, stepTime);
    }
});

// Option alternative avec animation plus douce (easing)
// Version premium avec easing personnalisé
function animateNumberEasing(element) {
    const textContent = element.textContent;
    let targetValue = parseFloat(textContent);
    let suffix = '';
    
    if (textContent.includes('+')) suffix = '+';
    else if (textContent.includes('%')) suffix = '%';
    
    if (isNaN(targetValue)) return;
    
    let startValue = 0;
    const duration = 2500;
    const startTime = performance.now();
    
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        let progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        
        const currentValue = Math.floor(easedProgress * targetValue);
        element.textContent = currentValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = targetValue + suffix;
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// =============================================
// NAVIGATION RAPIDE PAR ICÔNES ENTRE LES SERVICES
// (au-dessus du bouton "remonter en haut")
// =============================================
document.addEventListener('DOMContentLoaded', function () {
    const quicknav = document.querySelector('.service-quicknav');
    if (!quicknav) return;

    // Afficher/masquer selon le scroll (même seuil que le bouton remonter)
    function toggleVisibility() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        quicknav.classList.toggle('show', scrollTop > 100);
    }
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();

    // Met en surbrillance l'icône du service actuellement visible à l'écran
    const buttons = quicknav.querySelectorAll('.service-quicknav__btn');
    const sections = Array.from(buttons)
        .map(btn => document.getElementById(btn.dataset.target))
        .filter(Boolean);

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const btn = quicknav.querySelector(`[data-target="${entry.target.id}"]`);
            if (!btn) return;
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => sectionObserver.observe(section));

    // Bouton unique mobile : ouvre/ferme la liste des icônes
    const toggle = quicknav.querySelector('.service-quicknav__toggle');
    if (toggle) {
        toggle.addEventListener('click', function () {
            const isOpen = quicknav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Fermer automatiquement le menu après avoir choisi un service (mobile)
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                quicknav.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
});