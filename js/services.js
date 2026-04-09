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