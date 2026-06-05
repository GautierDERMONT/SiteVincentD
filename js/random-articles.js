// Liste de tous les articles (sauf celui de la page actuelle)
const articles = [
    {
        title: "Interview : Les défis du transport international en 2026 - Retour d'expérience sur les mutations du secteur",
        description: "Retour d'expérience sur les mutations du secteur du transport et les solutions pour anticiper les perturbations. Découvrez comment les entreprises s'adaptent aux nouvelles réglementations et aux crises géopolitiques.",
        date: "28 février 2026",
        author: "Vincent Dermont",
        readTime: "10 min",
        tags: ["Interview", "Transport"]
    },
    {
        title: "Supply Chain Durable : Comment concilier performance et RSE",
        description: "Les bonnes pratiques pour réduire l'empreinte carbone de votre chaîne logistique sans sacrifier la performance opérationnelle. Un guide complet pour allier écologie et rentabilité.",
        date: "10 février 2026",
        author: "Vincent Dermont",
        readTime: "7 min",
        tags: ["RSE", "Durabilité"]
    },
    {
        title: "7 erreurs fréquentes en gestion d'entrepôt",
        description: "Les pièges à éviter pour optimiser votre entrepôt et réduire les coûts opérationnels. Découvrez les solutions concrètes pour améliorer votre productivité.",
        date: "5 janvier 2026",
        author: "Vincent Dermont",
        readTime: "6 min",
        tags: ["Entrepôt", "Optimisation"]
    },
    {
        title: "Comment choisir son ERP logistique - Les critères essentiels pour bien sélectionner",
        description: "Guide pratique pour sélectionner l'ERP adapté à vos besoins en supply chain. Analyse des fonctionnalités clés et retour d'expérience terrain.",
        date: "20 décembre 2025",
        author: "Vincent Dermont",
        readTime: "9 min",
        tags: ["ERP", "Digitalisation"]
    },
    {
        title: "Les indicateurs clés de performance en entrepôt",
        description: "Les KPI indispensables pour piloter efficacement votre plateforme logistique. Mesurez votre performance et identifiez les axes de progrès.",
        date: "5 novembre 2025",
        author: "Vincent Dermont",
        readTime: "5 min",
        tags: ["KPI", "Entrepôt"]
    },
    {
        title: "Douane : Comment anticiper les nouvelles réglementations",
        description: "Les changements à venir dans les procédures douanières et comment s'y préparer. Anticipez les évolutions réglementaires pour sécuriser vos flux.",
        date: "15 octobre 2025",
        author: "Vincent Dermont",
        readTime: "8 min",
        tags: ["Douane", "Réglementation"]
    }
];

// Fonction pour mélanger un tableau (algorithme de Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Récupérer 3 articles aléatoires
function getRandomArticles(articlesList, count) {
    const shuffled = shuffleArray([...articlesList]);
    return shuffled.slice(0, count);
}

// Générer le HTML des suggestions avec métadonnées
function displayRandomArticles() {
    const container = document.getElementById('random-articles-container');
    if (!container) return;
    
    const randomArticles = getRandomArticles(articles, 3);
    
    container.innerHTML = randomArticles.map(article => `
        <div class="suggestion-card">
            <div class="suggestion-card-content">
                <div class="suggestion-meta">
                    <span class="suggestion-date"><i class="far fa-calendar"></i> ${article.date}</span>
                    <span class="suggestion-author"></i> ${article.author}</span>
                </div>
                <h4 class="suggestion-title">${article.title}</h4>
                <p class="suggestion-description">${article.description}</p>
                <div class="suggestion-footer">
                    <div class="suggestion-tags">
                        ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <span class="suggestion-reading-time"><i class="far fa-clock"></i> ${article.readTime}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Exécuter au chargement de la page
document.addEventListener('DOMContentLoaded', displayRandomArticles);