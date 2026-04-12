// Initialisation de EmailJS avec votre clé publique
emailjs.init('PM9XqztJbWOXqRK0G');

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Récupérer les valeurs du formulaire
            const formData = {
                name: document.getElementById('name').value,
                company: document.getElementById('company').value,
                position: document.getElementById('position').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value,
                date: new Date().toLocaleString('fr-FR')
            };
            
            // 1. Vérifier d'abord les champs vides (required)
            if (!contactForm.checkValidity()) {
                return;
            }
            
            // 2. Validation personnalisée
            const errors = validateForm(formData);
            if (errors.length > 0) {
                showModal(errors.join('<br>'), 'error');
                return;
            }
            
            // Afficher un indicateur de chargement
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;
            
            // Envoyer l'email via EmailJS
            emailjs.send('service_ycu98z2', 'template_tcjkkjk', formData)
                .then(function() {
                    showModal('Merci pour votre message ! Je vous répondrai dans les plus brefs délais.', 'success');
                    
                    // Réinitialiser le formulaire
                    contactForm.reset();
                    
                    // Réactiver la case à cocher et désactiver le bouton
                    const checkbox = contactForm.querySelector('input[type="checkbox"]');
                    if (checkbox) {
                        checkbox.checked = false;
                        submitBtn.disabled = true;
                        submitBtn.style.opacity = '0.6';
                        submitBtn.style.cursor = 'not-allowed';
                    } else {
                        submitBtn.disabled = false;
                    }
                    
                    submitBtn.textContent = originalText;
                })
                .catch(function(error) {
                    console.error('Erreur EmailJS:', error);
                    showModal('Une erreur est survenue lors de l\'envoi. Veuillez réessayer ou me contacter directement par email.', 'error');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
    
    // Ajouter les styles de la modal au chargement
    addModalStyles();
});

// Fonction pour afficher la modal
function showModal(message, type) {
    // Supprimer toute modal existante
    const existingModal = document.querySelector('.custom-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Créer la modal
    const modal = document.createElement('div');
    modal.className = `custom-modal ${type}`;
    
    // Icône en fonction du type
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    const title = type === 'success' ? 'Succès !' : 'Erreur';
    
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-container">
            <div class="modal-header ${type}">
                <i class="fas ${icon}"></i>
                <h3>${title}</h3>
            </div>
            <div class="modal-body">
                <p>${message}</p>
            </div>
            <div class="modal-footer">
                <button class="modal-btn ${type}">
                    Fermer
                </button>
            </div>
        </div>
    `;
    
    // Ajouter la modal au body
    document.body.appendChild(modal);
    
    // Animation d'entrée
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Fermeture automatique après 3 secondes pour les succès
    if (type === 'success') {
        setTimeout(() => {
            if (modal && modal.parentNode) {
                modal.remove();
            }
        }, 3000);
    }
    
    // Fermer la modal en cliquant sur l'overlay
    const overlay = modal.querySelector('.modal-overlay');
    overlay.addEventListener('click', () => {
        modal.remove();
    });
    
    // Fermer avec le bouton
    const closeBtn = modal.querySelector('.modal-btn');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
}

// Fonction pour ajouter les styles CSS de la modal
function addModalStyles() {
    // Vérifier si les styles existent déjà
    if (document.getElementById('modal-styles')) return;
    
    const styles = `
        <style id="modal-styles">
            .custom-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                visibility: hidden;
                opacity: 0;
                transition: visibility 0.3s, opacity 0.3s;
            }
            
            .custom-modal.show {
                visibility: visible;
                opacity: 1;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
                cursor: pointer;
            }
            
            .modal-container {
                position: relative;
                background: white;
                border-radius: 15px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                width: 90%;
                max-width: 450px;
                transform: scale(0.7);
                transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                overflow: hidden;
                margin: 0;
            }
            
            .custom-modal.show .modal-container {
                transform: scale(1);
            }
            
            .modal-header {
                padding: 25px 20px;
                text-align: center;
                border-bottom: 1px solid #eee;
            }
            
            .modal-header.success {
                background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
            }
            
            .modal-header.error {
                background: linear-gradient(135deg, #fad0c4 0%, #ff9a9e 100%);
            }
            
            .modal-header i {
                font-size: 60px;
                margin-bottom: 15px;
            }
            
            .modal-header.success i {
                color: #28a745;
            }
            
            .modal-header.error i {
                color: #dc3545;
            }
            
            .modal-header h3 {
                margin: 0;
                font-size: 24px;
                color: #333;
            }
            
            .modal-body {
                padding: 30px 25px;
                text-align: center;
            }
            
            .modal-body p {
                margin: 0;
                font-size: 16px;
                line-height: 1.6;
                color: #666;
            }
            
            .modal-footer {
                padding: 20px 25px;
                text-align: center;
                border-top: 1px solid #eee;
            }
            
            .modal-btn {
                padding: 12px 35px;
                border: none;
                border-radius: 25px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                min-width: 150px;
            }
            
            .modal-btn.success {
                background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
                color: #333;
            }
            
            .modal-btn.error {
                background: linear-gradient(135deg, #fad0c4 0%, #ff9a9e 100%);
                color: #333;
            }
            
            .modal-btn.success:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 20px rgba(40, 167, 69, 0.2);
            }
            
            .modal-btn.error:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 20px rgba(220, 53, 69, 0.2);
            }
            
            /* Animation de pulsation pour l'icône */
            .modal-header i {
                animation: pulse 1.5s ease infinite;
            }
            
            @keyframes pulse {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.1);
                }
                100% {
                    transform: scale(1);
                }
            }
            
            /* Responsive */
            @media (max-width: 480px) {
                .modal-container {
                    width: 95%;
                }
                
                .modal-header i {
                    font-size: 50px;
                }
                
                .modal-header h3 {
                    font-size: 20px;
                }
                
                .modal-body p {
                    font-size: 15px;
                }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}

// Fonction de validation personnalisée
function validateForm(formData) {
    const errors = [];
    
    if (!formData.name || !formData.name.trim()) {
        errors.push('Le nom est requis');
    } else if (formData.name.trim().length < 2) {
        errors.push('Le nom doit contenir au moins 2 caractères');
    }
    
    if (!formData.company || !formData.company.trim()) {
        errors.push('L\'entreprise est requise');
    }
    
    if (!formData.position || !formData.position.trim()) {
        errors.push('La fonction est requise');
    }
    
    if (!formData.email || !formData.email.trim()) {
        errors.push('L\'email est requis');
    } else if (!isValidEmail(formData.email)) {
        errors.push('L\'email n\'est pas valide (ex: nom@domaine.fr)');
    }
    
    if (!formData.service) {
        errors.push('Le service concerné est requis');
    }
    
    // Validation du message : 20 caractères minimum
    if (!formData.message || !formData.message.trim()) {
        errors.push('Le message est requis');
    } else if (formData.message.trim().length < 20) {
        errors.push('Le message doit contenir au moins 20 caractères');
    }
    
    // Validation du téléphone : autorise les espaces, pas de nombre minimum de chiffres
    if (formData.phone && formData.phone.trim()) {
        // Vérifier qu'il n'y a pas de lettres
        if (/[a-zA-Z]/.test(formData.phone.trim())) {
            errors.push('Le numéro de téléphone ne peut pas contenir de lettres');
        }
        // Vérifier qu'il n'y a pas de caractères spéciaux (sauf espaces, +, -, parenthèses)
        if (/[^0-9+\-\s\(\)]/.test(formData.phone.trim())) {
            errors.push('Le numéro de téléphone contient des caractères non autorisés');
        }
    }
    
    return errors;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}