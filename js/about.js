// =============================================
// GESTION DE LA TIMELINE (Parcours professionnel)
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    const btnMore1 = document.getElementById('btn-show-more-1');
    const btnMore2 = document.getElementById('btn-show-more-2');
    const btnLess = document.getElementById('btn-show-less');
    
    if (btnMore1) {
        let step = 0; // 0: rien, 1: groupe1 visible, 2: groupe2 visible
        
        // Récupérer les éléments des groupes
        const group1Items = document.querySelectorAll('.hidden-timeline[data-group="1"]');
        const group2Items = document.querySelectorAll('.hidden-timeline[data-group="2"]');
        
        // État initial
        btnMore2.style.display = 'none';
        btnLess.style.display = 'none';
        
        // Fonction pour scroller vers un élément avec un délai
        function scrollToElement(element, offset = 100) {
            if (!element) return;
            
            setTimeout(() => {
                const rect = element.getBoundingClientRect();
                const absoluteTop = rect.top + window.pageYOffset;
                window.scrollTo({
                    top: absoluteTop - offset,
                    behavior: 'smooth'
                });
            }, 150);
        }

        // Fonction pour scroller PUIS masquer les éléments une fois arrivé
        function scrollThenHide(targetElement, itemsToHide, buttonsToUpdate, offset = 100) {
            if (!targetElement) return;

            const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

            window.scrollTo({ top: targetTop, behavior: 'smooth' });

            const scrollDuration = Math.abs(window.pageYOffset - targetTop) / 3;
            const delay = Math.min(Math.max(scrollDuration, 400), 800);

            setTimeout(() => {
                itemsToHide.forEach(item => item.style.display = 'none');
                buttonsToUpdate();
            }, delay);
        }
        
        // Afficher groupe 1
        btnMore1.addEventListener('click', function() {
            group1Items.forEach(item => item.style.display = 'block');
            step = 1;
            btnMore1.style.display = 'none';
            btnMore2.style.display = 'inline-block';
            btnLess.style.display = 'inline-block';
            
            scrollToElement(group1Items[0], 100);
        });
        
        // Afficher groupe 2
        btnMore2.addEventListener('click', function() {
            group2Items.forEach(item => item.style.display = 'block');
            step = 2;
            btnMore2.style.display = 'none';
            
            scrollToElement(group2Items[0], 100);
        });
        
        // Masquer progressivement
        btnLess.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (step === 2) {
                step = 1;
                scrollThenHide(
                    group1Items[0],
                    group2Items,
                    () => { btnMore2.style.display = 'inline-block'; }
                );
                
            } else if (step === 1) {
                step = 0;
                const allInitialItems = document.querySelectorAll('.timeline-item:not(.hidden-timeline)');
                const lastInitial = allInitialItems[allInitialItems.length - 1];

                scrollThenHide(
                    lastInitial,
                    group1Items,
                    () => {
                        btnMore1.style.display = 'inline-block';
                        btnMore2.style.display = 'none';
                        btnLess.style.display = 'none';
                    }
                );
            }
        });
    }
});