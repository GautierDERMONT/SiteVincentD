// Fonctionnalité FAQ Accordéon
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            
            // Fermer tous les autres items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherAnswer.style.maxHeight = null;
                }
            });
            
            // Ouvrir/fermer l'item actuel
            if (isExpanded) {
                // Fermer
                item.classList.remove('active');
                question.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = null;
            } else {
                // Ouvrir
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
        
        // Initialisation des hauteurs pour les items actifs par défaut
        if (item.classList.contains('active')) {
            question.setAttribute('aria-expanded', 'true');
            answer.style.maxHeight = answer.scrollHeight + "px";
        }
    });
    
    // Optionnel: Ouvrir le premier item par défaut
    // if (faqItems.length > 0) {
    //     faqItems[0].classList.add('active');
    //     faqItems[0].querySelector('.faq-question').setAttribute('aria-expanded', 'true');
    //     const firstAnswer = faqItems[0].querySelector('.faq-answer');
    //     firstAnswer.style.maxHeight = firstAnswer.scrollHeight + "px";
    // }
});