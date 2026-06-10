// Fonction pour copier le lien de la page
function copyPageUrl() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(function() {
        const notification = document.getElementById('copy-notification');
        if (notification) {
            notification.classList.add('show');
            setTimeout(function() {
                notification.classList.remove('show');
            }, 2000);
        }
    }).catch(function(err) {
        console.error('Erreur lors de la copie : ', err);
        alert('Impossible de copier le lien. Veuillez le copier manuellement.');
    });
}

// Partager sur LinkedIn - version qui fonctionne sans aperçu
function shareOnLinkedIn() {
    const url = window.location.href;
    // Utiliser l'API de partage direct sans aperçu
    window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url), '_blank', 'width=600,height=500');
}

// Partager sur X (Twitter)
function shareOnX() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open('https://twitter.com/intent/tweet?url=' + url + '&text=' + title, '_blank', 'width=600,height=400');
}

// Partager par email
function shareByEmail() {
    const url = window.location.href;
    const title = document.title;
    window.location.href = 'mailto:?subject=' + encodeURIComponent(title) + '&body=' + encodeURIComponent('Je vous recommande cet article : ' + url);
}