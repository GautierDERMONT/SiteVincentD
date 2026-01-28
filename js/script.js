// Menu burger responsive
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('.nav-menu');
    
    burger.addEventListener('click', function() {
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
    
    // Animation au scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observer les éléments à animer
    document.querySelectorAll('.service-card, .testimonial-card, .hero-content, .about-content').forEach(el => {
        observer.observe(el);
    });
    
    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupération des données du formulaire
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validation basique
            let isValid = true;
            document.querySelectorAll('.error').forEach(el => el.remove());
            
            if (!data.name || data.name.length < 2) {
                showError('name', 'Veuillez entrer un nom valide');
                isValid = false;
            }
            
            if (!data.email || !isValidEmail(data.email)) {
                showError('email', 'Veuillez entrer un email valide');
                isValid = false;
            }
            
            if (!data.message || data.message.length < 10) {
                showError('message', 'Veuillez entrer un message d\'au moins 10 caractères');
                isValid = false;
            }
            
            if (isValid) {
                // Simulation d'envoi
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Envoi en cours...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    alert('Merci pour votre message ! Je vous répondrai dans les plus brefs délais.');
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            }
        });
    }
    
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const error = document.createElement('div');
        error.className = 'error';
        error.textContent = message;
        error.style.color = '#dc3545';
        error.style.fontSize = '0.9rem';
        error.style.marginTop = '5px';
        field.parentNode.appendChild(error);
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Animation des statistiques dans la section hero
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const finalValue = parseInt(stat.textContent);
            let startValue = 0;
            const duration = 2000;
            const increment = finalValue / (duration / 16);
            
            const timer = setInterval(() => {
                startValue += increment;
                if (startValue >= finalValue) {
                    stat.textContent = finalValue + (stat.textContent.includes('%') ? '%' : '+');
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(startValue) + (stat.textContent.includes('%') ? '%' : '+');
                }
            }, 16);
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
});


