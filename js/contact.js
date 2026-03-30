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
    
    // Gestion du formulaire de contact avec validation de la case à cocher
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const checkbox = contactForm.querySelector('input[type="checkbox"]');
        
        // Désactiver le bouton d'envoi au chargement si la case n'est pas cochée
        if (submitButton && checkbox) {
            submitButton.disabled = !checkbox.checked;
            submitButton.style.opacity = '0.6';
            submitButton.style.cursor = 'not-allowed';
            
            // Écouter les changements de la case à cocher
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    submitButton.disabled = false;
                    submitButton.style.opacity = '1';
                    submitButton.style.cursor = 'pointer';
                } else {
                    submitButton.disabled = true;
                    submitButton.style.opacity = '0.6';
                    submitButton.style.cursor = 'not-allowed';
                }
            });
        }
        
        // Validation du formulaire avant envoi
        contactForm.addEventListener('submit', function(e) {
            // Vérifier que la case à cocher est cochée (sécurité supplémentaire)
            if (!checkbox.checked) {
                e.preventDefault();
                alert('Veuillez accepter la politique de confidentialité pour envoyer votre demande.');
                return false;
            }
            
            // Vérifier que tous les champs requis sont remplis
            const requiredFields = contactForm.querySelectorAll('[required]');
            let allFilled = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    allFilled = false;
                    field.style.borderColor = 'red';
                } else {
                    field.style.borderColor = '';
                }
            });
            
            if (!allFilled) {
                e.preventDefault();
                alert('Veuillez remplir tous les champs obligatoires.');
                return false;
            }
            
            // Si tout est OK, le formulaire sera envoyé normalement
            // (le traitement via EmailJS ou autre se fera dans form.js)
        });
        
        // Réinitialiser les bordures rouges lors de la saisie
        const formInputs = contactForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.style.borderColor = '';
                }
            });
        });
    }
    
    // Optionnel: Ouvrir le premier item par défaut
    // if (faqItems.length > 0) {
    //     faqItems[0].classList.add('active');
    //     faqItems[0].querySelector('.faq-question').setAttribute('aria-expanded', 'true');
    //     const firstAnswer = faqItems[0].querySelector('.faq-answer');
    //     firstAnswer.style.maxHeight = firstAnswer.scrollHeight + "px";
    // }
});