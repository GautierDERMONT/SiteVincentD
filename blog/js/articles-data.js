const ARTICLES_DATA = {
  // Liste de tous les articles

  featuredArticleId: 1,  

  
  list: [
    {
      id: 1,
      url: "./blog/interviews/1.html",
      urlFull: "../interviews/1.html",         
      title: "############################################################################################",
      description: "########################################################################################################################################################################################",
      date: "12 Mars 2026",
      dateIso: "2026-03-12",
      author: "Vincent Dermont",
      readTime: "durée",
      tags: ["Interview", "Tag"],
      image: "blog/images/event.webp",
      imageFull: "../images/event.webp",
      imageAlt: "Interview transport international 2026"
    },
    
    {
      id: 2,
      url: "./blog/articles/2.html",
      urlFull: "../articles/2.html",         
      title: "Audit######################################################################################",
      description: "########################################################################################################################################################################################",
      date: "18 Février 2026",
      dateIso: "2026-02-10",
      author: "Vincent Dermont",
      readTime: "Durée",
      tags: ["Tag", "Tag"],
      image: "blog/images/etudiant.webp",
      imageFull: "../images/etudiant.webp",
      imageAlt: "Supply chain durable"
    },

    {
      id: 3,
      url: "./blog/articles/3.html",
      urlFull: "../articles/3.html",         
      title: "############################################################################################",
      description: "Optimisation###############################################################################################################################################################################",
      date: "18 Mars 2026",
      dateIso: "2026-03-18",
      author: "Vincent Dermont",
      readTime: "durée",
      tags: ["Tag", "Tag"],
      image: "blog/images/Image-VDe.webp",
      imageFull: "../images/Image-VDe.webp",
      imageAlt: "Gestion d'entrepôt"
    },

    {
      id: 4,
      url: "./blog/interviews/4.html",
      urlFull: "../interviews/4.html",         
      title: "############################################################################################",
      description: "Optimisation###############################################################################################################################################################################",
      date: "19 Mars 2026",
      dateIso: "2026-03-19",
      author: "Vincent Dermont",
      readTime: "durée",
      tags: ["Interview", "Tag"],
      image: "blog/images/Image-VDe.webp",
      imageFull: "../images/Image-VDe.webp",
      imageAlt: "Gestion d'entrepôt"
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