// Script pour l'animation des statistiques des études de cas
document.addEventListener('DOMContentLoaded', function() {
    
    // Sélectionner tous les blocs de statistiques dans les études de cas
    const caseStudyStats = document.querySelectorAll('.case-studies .results-stats');
    
    if (caseStudyStats.length === 0) return;
    
    // Observer chaque bloc de statistiques
    const observerOptions = {
        threshold: 0.3, // Déclenche quand 30% de l'élément est visible
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statsBlock = entry.target;
                animateStatsBlock(statsBlock);
                observer.unobserve(statsBlock); // Ne déclencher qu'une seule fois
            }
        });
    }, observerOptions);
    
    // Observer chaque bloc de statistiques
    caseStudyStats.forEach(statsBlock => {
        observer.observe(statsBlock);
    });
    
    // Fonction d'animation d'un bloc de statistiques complet
    function animateStatsBlock(block) {
        // Trouver tous les éléments .result-number dans ce bloc
        const resultNumbers = block.querySelectorAll('.result-number');
        
        resultNumbers.forEach(element => {
            animateNumber(element);
        });
    }
    
    // Fonction d'animation du compteur
    function animateNumber(element) {
        // Récupérer le texte original
        const originalText = element.textContent;
        
        // Extraire la valeur numérique et le format
        let targetValue = 0;
        let prefix = '';
        let suffix = '';
        let hasInequality = false;
        let inequalityText = '';
        
        // Gérer "OTD > 98%"
        if (originalText.includes('OTD')) {
            const match = originalText.match(/OTD\s*>\s*(\d+)/);
            if (match) {
                targetValue = parseFloat(match[1]);
                inequalityText = 'OTD > ';
                suffix = '%';
                hasInequality = true;
            }
        }
        // Gérer "x3"
        else if (originalText.includes('x')) {
            const match = originalText.match(/x(\d+)/);
            if (match) {
                targetValue = parseFloat(match[1]);
                prefix = 'x';
            }
        }
        // Gérer "+14%" ou "-30%"
        else if (originalText.includes('%')) {
            const match = originalText.match(/([+-]?\d+)%/);
            if (match) {
                targetValue = parseFloat(match[1]);
                suffix = '%';
                if (originalText.startsWith('+')) prefix = '+';
                if (originalText.startsWith('-')) prefix = '-';
            }
        }
        // Gérer "Break-Even" - pas d'animation
        else if (originalText === 'Break-Even') {
            return;
        }
        
        // Vérifier qu'on a une valeur à animer
        if (targetValue === 0) return;
        
        let currentValue = 0;
        const duration = 2500; // 2 secondes
        const stepTime = 16; // ~60fps
        const steps = duration / stepTime;
        const increment = Math.abs(targetValue) / steps;
        
        const timer = setInterval(function() {
            currentValue += increment;
            
            let displayText = '';
            
            if (currentValue >= Math.abs(targetValue)) {
                currentValue = Math.abs(targetValue);
                
                // Afficher la valeur finale exacte comme dans l'original
                element.textContent = originalText;
                clearInterval(timer);
                return;
            }
            
            // Construire le texte pendant l'animation
            const roundedValue = Math.floor(currentValue);
            
            if (hasInequality) {
                displayText = inequalityText + roundedValue + suffix;
            } else if (prefix === 'x') {
                displayText = prefix + roundedValue;
            } else if (prefix === '+' || prefix === '-') {
                displayText = prefix + roundedValue + suffix;
            } else if (suffix === '%') {
                displayText = roundedValue + suffix;
            } else {
                displayText = roundedValue.toString();
            }
            
            element.textContent = displayText;
        }, stepTime);
    }
});