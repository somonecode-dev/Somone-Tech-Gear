// Initialisation globale et gestion du state local
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateBadges();
  initMobileMenu(); // Initialisation du menu hamburger mobile
});

// 1. Mise à jour des compteurs (Badges Navbar)
function updateBadges() {
  const panier = JSON.parse(localStorage.getItem('panier')) || [];
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  // Somme totale des quantités dans le panier
  const totalPanier = panier.reduce((total, item) => total + item.quantite, 0);

  const cartBadge = document.getElementById('cart-badge');
  const wishlistBadge = document.getElementById('wishlist-badge');

  if (cartBadge) cartBadge.textContent = totalPanier;
  if (wishlistBadge) wishlistBadge.textContent = wishlist.length;
}

// 2. Gestion du Thème (Dark / Light)
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme');

  if (currentTheme === 'light') {
    document.body.classList.add('light-mode');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  }
}

// 3. Gestion du Menu Hamburger Mobile
function initMobileMenu() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Fermer le menu au clic sur un lien de navigation
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }
}

// Fonction pour ouvrir la modale d'un produit avec ses 3 images
function openQuickView(productId) {
  const product = PRODUITS.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('quickview-modal');
  const mainImg = document.getElementById('qv-main-img');
  const thumbsContainer = document.getElementById('qv-thumbnails');

  // Remplissage des données
  document.getElementById('qv-title').textContent = product.nom;
  document.getElementById('qv-category').textContent = product.categorie;
  document.getElementById('qv-price').textContent = `${product.prix.toLocaleString('fr-FR')} FCFA`;
  document.getElementById('qv-description').textContent = product.description;

  // Image principale (1ère image)
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  mainImg.src = images[0];

  // Génération des vignettes (les 3 images)
  thumbsContainer.innerHTML = images.map((imgSrc, index) => `
    <img 
      src="${imgSrc}" 
      class="thumb-img ${index === 0 ? 'active' : ''}" 
      onclick="changeQuickViewImage('${imgSrc}', this)"
      alt="${product.nom}"
    />
  `).join('');

  // Bouton d'ajout au panier dans la modale
  const addBtn = document.getElementById('qv-add-btn');
   addBtn.onclick = () => {
     if (typeof addToCartWishlist === 'function') {
       addToCartWishlist(product.id);
     } else if (typeof addToCartBoutique === 'function') {
       addToCartBoutique(product.id);
     } else if (typeof addToCart === 'function') {
       addToCart(product.id);
     }
  
     closeQuickView();
    };

  modal.classList.add('active');
}

// Fonction pour changer l'image principale au clic sur une vignette
function changeQuickViewImage(imgSrc, element) {
  document.getElementById('qv-main-img').src = imgSrc;
  document.querySelectorAll('.thumb-img').forEach(el => el.classList.remove('active'));
  element.classList.add('active');
}

// Fermer la modale
function closeQuickView() {
  document.getElementById('quickview-modal').classList.remove('active');
}