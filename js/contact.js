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
    
    // Gestion du formulaire de contact - Gestion de la case à cocher UNIQUEMENT
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
        
        // Vérification UNIQUEMENT de la case à cocher avant envoi
        contactForm.addEventListener('submit', function(e) {
            if (checkbox && !checkbox.checked) {
                e.preventDefault();
                alert('Veuillez accepter la politique de confidentialité pour envoyer votre demande.');
                return false;
            }
        });
    }
});

// Animation bounce des boutons CTA au scroll
document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.querySelectorAll('.cta-buttons .btn');
    const ctaSection = document.querySelector('.contact-cta');
    
    if (ctaButtons.length === 0 || !ctaSection) return;
    
    let bounceTriggered = false;
    
    // Fonction pour vérifier si l'élément est visible dans la fenêtre
    function isElementInViewport(el, offset = 100) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // L'élément est considéré visible quand il entre dans la fenêtre
        return rect.top <= windowHeight - offset && rect.bottom >= 0;
    }
    
    // Fonction pour déclencher l'animation bounce
    function triggerBounceAnimation() {
        if (bounceTriggered) return;
        
        // Vérifier si la section CTA est visible
        if (isElementInViewport(ctaSection, 150)) {
            bounceTriggered = true;
            
            // Ajouter l'animation à chaque bouton avec un léger délai
            ctaButtons.forEach((button, index) => {
                setTimeout(() => {
                    button.classList.add('bounce-animation');
                    
                    // Retirer la classe après l'animation pour permettre un éventuel re-jeu
                    setTimeout(() => {
                        button.classList.remove('bounce-animation');
                    }, 800);
                }, index * 300); // Délai progressif : 0ms, 150ms
            });
        }
    }
    
    // Observer l'apparition de la section CTA avec Intersection Observer (plus performant)
    function setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !bounceTriggered) {
                    bounceTriggered = true;
                    
                    // Déclencher l'animation sur les boutons
                    ctaButtons.forEach((button, index) => {
                        setTimeout(() => {
                            button.classList.add('bounce-animation');
                            setTimeout(() => {
                                button.classList.remove('bounce-animation');
                            }, 800);
                        }, index * 150);
                    });
                    
                    // Déconnecter l'observateur une fois l'animation déclenchée
                    observer.disconnect();
                }
            });
        }, {
            threshold: 0.3, // Se déclenche quand 30% de la section est visible
            rootMargin: '0px'
        });
        
        observer.observe(ctaSection);
    }
    
    // Fallback avec scroll si Intersection Observer n'est pas supporté
    if ('IntersectionObserver' in window) {
        setupIntersectionObserver();
    } else {
        // Fallback pour les navigateurs plus anciens
        window.addEventListener('scroll', function() {
            triggerBounceAnimation();
        });
        window.addEventListener('resize', function() {
            triggerBounceAnimation();
        });
        // Vérifier au chargement
        triggerBounceAnimation();
    }
});