// Galerie magazine - clic pour agrandir, flèches pour défiler
(function() {
    // Récupérer toutes les images de la grille
    const gridItems = document.querySelectorAll('.grid-item');
    const images = [];
    
    gridItems.forEach((item, index) => {
        const img = item.querySelector('img');
        if (img) {
            images.push(img.src);
            item.setAttribute('data-index', index);
        }
    });
    
    let currentIndex = 0;
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.modal-close');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');
    const counter = document.getElementById('modal-counter');
    
    // Ouvrir le modal
    function openModal(index) {
        if (images.length === 0) return;
        
        currentIndex = index;
        modalImg.src = images[currentIndex];
        updateCounter();
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    // Fermer le modal
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    // Image suivante
    function nextImage() {
        if (images.length === 0) return;
        currentIndex = (currentIndex + 1) % images.length;
        modalImg.src = images[currentIndex];
        updateCounter();
    }
    
    // Image précédente
    function prevImage() {
        if (images.length === 0) return;
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        modalImg.src = images[currentIndex];
        updateCounter();
    }
    
    // Mettre à jour le compteur
    function updateCounter() {
        if (counter) {
            counter.textContent = `${currentIndex + 1} / ${images.length}`;
        }
    }
    
    // Navigation au clavier
    function handleKeydown(e) {
        if (!modal.classList.contains('show')) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
            case 'Escape':
                closeModal();
                break;
        }
    }
    
    // Initialisation
    function initMagazineGrid() {
        if (gridItems.length === 0) return;
        
        gridItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                openModal(index);
            });
        });
        
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (prevBtn) prevBtn.addEventListener('click', prevImage);
        if (nextBtn) nextBtn.addEventListener('click', nextImage);
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
        }
        
        document.addEventListener('keydown', handleKeydown);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMagazineGrid);
    } else {
        initMagazineGrid();
    }
})();