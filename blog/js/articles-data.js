const ARTICLES_DATA = {
  // Liste de tous les articles

  featuredArticleId: 1,  

  
  list: [
    {
      id: 1,
      url: "./blog/interviews/1.html",
      urlFull: "../interviews/1.html",         
      title: " Interview - Supply Chain Event",
      description: "Quels sont les challenges auxquels la supply chain doit faire face ?",
      date: "Novembre 2024",
      dateIso: "2024-11",
      author: "Vincent Dermont",
      readTime: "durée",
      tags: ["Interview", "Supply Chain Event"],
      image: "blog/images/event.webp",
      imageFull: "../images/event.webp",
      imageAlt: "Interview transport international 2026",
      lazyLoad: true  
    },
    
    {
      id: 2,
      url: "./blog/articles/2.html",
      urlFull: "../articles/2.html",         
      title: "Échange métier avec des étudiants du Master Spécialisé SupplyChain de NEOMA Business School Paris.",
      description: "########################################################################################################################################################################################",
      date: "Avril 2026",
      dateIso: "2026-04",
      author: "Vincent Dermont",
      readTime: "Durée",
      tags: ["échange", "campus"],
      image: "blog/images/etudiant.webp",
      imageFull: "../images/etudiant.webp",
      imageAlt: "Supply chain durable",
      lazyLoad: true  
    },

    {
      id: 3,
      url: "./blog/articles/3.html",
      urlFull: "../articles/3.html",         
      title: "Qui suis-je ? Mon métier, Ma vision.",
      description: "Derrière chaque projet se cache une histoire. Apprenez à me connaître, découvrez mon métier, mes ambitions et la manière dont je vois l'évolution du numérique et du développement logiciel.",
      date: "Mai 2026",
      dateIso: "2026-05",
      author: "Vincent Dermont",
      readTime: "durée",
      tags: ["A propos", "Tag"],
      image: "blog/images/Image-VDe.webp",
      imageFull: "../images/Image-VDe.webp",
      imageAlt: "Gestion d'entrepôt",
      lazyLoad: true  
    },

    {
      id: 4,
      url: "./blog/interviews/4.html",
      urlFull: "../interviews/4.html",         
      title: "Témoignage métier avec Louis-Dupont - Management de Transition",
      description: "À travers cet entretien avec Louis Dupont, expert en management de transition, découvrez comment le processus S&OP (Sales & Operations Planning) permet d'aligner les objectifs commerciaux, la production et la chaîne d'approvisionnement afin d'améliorer la performance globale de l'entreprise.",
      date: "Avril 2026",
      dateIso: "2026-04",
      author: "Vincent Dermont",
      readTime: "durée",
      tags: ["Interview", "S&OP"],
      image: "blog/images/louis-dupont.webp",
      imageFull: "../images/louis-dupont.webp",
      imageAlt: "Gestion d'entrepôt",
      lazyLoad: true  

    },
    
  ],


  // Fonction pour récupérer l'article à la une
  getFeaturedArticle: function() {
    return this.list.find(article => article.id === this.featuredArticleId);
  },

  // Fonction pour récupérer un article par son ID
  getArticleById: function(id) {
    return this.list.find(article => article.id === id);
  },

  // Fonction pour récupérer un article par son URL
  getArticleByUrl: function(url) {
    return this.list.find(article => article.url === url);
  },

  // Fonction pour récupérer des articles aléatoires (exclut un ID si nécessaire)
  getRandomArticles: function(count = 3, excludeId = null) {
    let filtered = [...this.list];
    if (excludeId) {
      filtered = filtered.filter(article => article.id !== excludeId);
    }
    const shuffled = [...filtered];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
  }
};