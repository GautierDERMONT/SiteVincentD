// =============================================
// TÉMOIGNAGES - Version fluide avec animations
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.testimonials-track');
    if (!track) return;

    // Variables
    let isModalOpen = false;
    let isClosing = false;
    let hoverTimer = null;
    let closeTimeoutId = null;
    let currentHoveredCard = null;
    let isHoveringModal = false;
    let isHoveringCard = false;

    // Créer la modale
    const modal = document.createElement('div');
    modal.className = 'testimonial-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
        <div class="testimonial-modal__overlay"></div>
        <div class="testimonial-modal__box">
            <button class="testimonial-modal__close" aria-label="Fermer">&times;</button>
            <div class="testimonial-modal__body"></div>
        </div>
    `;
    document.body.appendChild(modal);

    const modalBox = modal.querySelector('.testimonial-modal__box');
    const modalBody = modal.querySelector('.testimonial-modal__body');
    const modalClose = modal.querySelector('.testimonial-modal__close');
    const modalOverlay = modal.querySelector('.testimonial-modal__overlay');

    // Fonction pour ouvrir la modale avec animation
    function openModal(card) {
        if (isModalOpen || isClosing) return;
        
        // Cloner la carte
        const clone = card.cloneNode(true);
        clone.style.cursor = 'default';
        clone.classList.remove('is-hovered');
        
        modalBody.innerHTML = '';
        modalBody.appendChild(clone);
        
        // Nettoyer les classes précédentes
        modal.classList.remove('closing');
        
        // Forcer le reflow pour l'animation
        void modalBox.offsetHeight;
        
        // Ouvrir
        modal.classList.add('active');
        isModalOpen = true;
        isClosing = false;
        
        // Pause du carrousel
        track.style.animationPlayState = 'paused';
        
        // Marquer la carte
        if (currentHoveredCard) {
            currentHoveredCard.classList.remove('is-hovered');
        }
        currentHoveredCard = card;
        card.classList.add('is-hovered');
        track.classList.add('has-hover');
    }

    // Fonction pour fermer la modale - Fermeture immédiate
    function closeModal() {
        if (!isModalOpen || isClosing) return;
        
        isClosing = true;
        
        // Fermeture immédiate sans animation
        modal.classList.remove('active', 'closing');
        isModalOpen = false;
        isClosing = false;
        
        // Reprendre le carrousel
        track.style.animationPlayState = 'running';
        
        // Nettoyer
        if (currentHoveredCard) {
            currentHoveredCard.classList.remove('is-hovered');
            currentHoveredCard = null;
        }
        track.classList.remove('has-hover');
        
        if (closeTimeoutId) {
            clearTimeout(closeTimeoutId);
            closeTimeoutId = null;
        }
    }

    // Gestion du survol des cartes
    track.addEventListener('mouseenter', function() {
        isHoveringCard = true;
    });

    track.addEventListener('mouseleave', function() {
        isHoveringCard = false;
        // Si la modale n'est pas ouverte, on nettoie
        if (!isModalOpen && hoverTimer) {
            clearTimeout(hoverTimer);
            hoverTimer = null;
        }
    });

    track.addEventListener('mouseover', function(e) {
        const card = e.target.closest('.testimonial-card');
        if (!card || !track.contains(card)) return;
        
        if (isModalOpen || isClosing) return;
        
        // Nettoyer les timers
        if (closeTimeoutId) {
            clearTimeout(closeTimeoutId);
            closeTimeoutId = null;
        }
        if (hoverTimer) {
            clearTimeout(hoverTimer);
        }
        
        // Délai avant ouverture (évite les déclenchements intempestifs)
        hoverTimer = setTimeout(() => {
            // Vérifier que la carte est toujours survolée
            if (card.matches(':hover')) {
                openModal(card);
            }
            hoverTimer = null;
        }, 280);
    });

    track.addEventListener('mouseout', function(e) {
        const card = e.target.closest('.testimonial-card');
        if (!card) return;
        
        if (card.contains(e.relatedTarget)) return;
        
        if (hoverTimer) {
            clearTimeout(hoverTimer);
            hoverTimer = null;
        }
    });

    // Gestion du clic (mobile)
    track.addEventListener('click', function(e) {
        const card = e.target.closest('.testimonial-card');
        if (!card) return;
        e.stopPropagation();
        
        if (isModalOpen) {
            closeModal();
        } else {
            if (hoverTimer) {
                clearTimeout(hoverTimer);
                hoverTimer = null;
            }
            if (closeTimeoutId) {
                clearTimeout(closeTimeoutId);
                closeTimeoutId = null;
            }
            openModal(card);
        }
    });

    // Modale - survol
    modal.addEventListener('mouseenter', function() {
        isHoveringModal = true;
        if (closeTimeoutId) {
            clearTimeout(closeTimeoutId);
            closeTimeoutId = null;
        }
    });

    modal.addEventListener('mouseleave', function(e) {
        isHoveringModal = false;
        // Vérifier si la souris est sur une carte du track
        const hoveredCard = track.querySelector('.testimonial-card:hover');
        if (!hoveredCard && isModalOpen) {
            closeTimeoutId = setTimeout(() => {
                closeModal();
                closeTimeoutId = null;
            }, 350);
        }
    });

    // Bouton de fermeture
    modalClose.addEventListener('click', function(e) {
        e.stopPropagation();
        closeModal();
    });
    
    // Overlay (cliquer en dehors)
    modalOverlay.addEventListener('click', function(e) {
        e.stopPropagation();
        closeModal();
    });

    // Touche Echap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isModalOpen) {
            closeModal();
        }
    });

    // Nettoyage
    window.addEventListener('beforeunload', function() {
        if (hoverTimer) {
            clearTimeout(hoverTimer);
            hoverTimer = null;
        }
        if (closeTimeoutId) {
            clearTimeout(closeTimeoutId);
            closeTimeoutId = null;
        }
    });
});

// =============================================
// ANIMATION DES STATISTIQUES
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    const caseStudyStats = document.querySelectorAll('.case-studies .results-stats');
    
    if (caseStudyStats.length === 0) return;
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statsBlock = entry.target;
                animateStatsBlock(statsBlock);
                observer.unobserve(statsBlock);
            }
        });
    }, observerOptions);
    
    caseStudyStats.forEach(statsBlock => {
        observer.observe(statsBlock);
    });
    
    function animateStatsBlock(block) {
        const resultNumbers = block.querySelectorAll('.result-number');
        resultNumbers.forEach(element => {
            animateNumber(element);
        });
    }
    
    function animateNumber(element) {
        const originalText = element.textContent;
        
        let targetValue = 0;
        let prefix = '';
        let suffix = '';
        let hasInequality = false;
        let inequalityText = '';
        
        if (originalText.includes('OTD')) {
            const match = originalText.match(/OTD\s*>\s*(\d+)/);
            if (match) {
                targetValue = parseFloat(match[1]);
                inequalityText = 'OTD > ';
                suffix = '%';
                hasInequality = true;
            }
        } else if (originalText.includes('x')) {
            const match = originalText.match(/x(\d+)/);
            if (match) {
                targetValue = parseFloat(match[1]);
                prefix = 'x';
            }
        } else if (originalText.includes('%')) {
            const match = originalText.match(/([+-]?\d+)%/);
            if (match) {
                targetValue = parseFloat(match[1]);
                suffix = '%';
                if (originalText.startsWith('+')) prefix = '+';
                if (originalText.startsWith('-')) prefix = '-';
            }
        } else if (originalText === 'Break-Even') {
            return;
        }
        
        if (targetValue === 0) return;
        
        let currentValue = 0;
        const duration = 2500;
        const stepTime = 16;
        const steps = duration / stepTime;
        const increment = Math.abs(targetValue) / steps;
        
        const timer = setInterval(function() {
            currentValue += increment;
            
            let displayText = '';
            
            if (currentValue >= Math.abs(targetValue)) {
                currentValue = Math.abs(targetValue);
                element.textContent = originalText;
                clearInterval(timer);
                return;
            }
            
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

// =============================================
// ACCORDÉON FLUIDE
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        
        if (!header || !content) return;
        
        header.addEventListener('click', function() {
            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            if (!item.classList.contains('active')) {
                void content.offsetHeight;
            }
            
            item.classList.toggle('active');
            
            if (item.classList.contains('active')) {
                const rect = header.getBoundingClientRect();
                if (rect.top < 100) {
                    window.scrollBy({ top: rect.top - 80, behavior: 'smooth' });
                }
            }
        });
    });
});
// =============================================
// NAVIGATION RAPIDE PAR ICÔNES ENTRE LES CAS
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

    // Met en surbrillance l'icône du cas actuellement visible à l'écran
    const buttons = quicknav.querySelectorAll('.service-quicknav__btn');
    const sections = Array.from(buttons)
        .map(btn => document.getElementById(btn.dataset.target))
        .filter(Boolean);

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const btn = quicknav.querySelector(`[data-target="${entry.target.id}"]`);
            if (!btn) return;
            if (entry.isIntersecting) {
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            } else {
                // On quitte la section : on désactive son bouton si aucune autre section n'est active
                btn.classList.remove('active');
            }
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

        // Fermer automatiquement le menu après avoir choisi un cas (mobile)
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                quicknav.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
});