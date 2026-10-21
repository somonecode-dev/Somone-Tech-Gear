document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedProducts();
});

// Affichage dynamique de 4 produits vedettes sur la page d'accueil
function renderFeaturedProducts() {
  const container = document.getElementById('featured-products');
  if (!container) return;

  // On vérifie que la base de données PRODUITS existe
  if (typeof PRODUITS === 'undefined') {
    console.error("La variable PRODUITS n'est pas définie dans js/data.js");
    return;
  }

  // Filtrer les produits marqués comme vedettes
  let featured = PRODUITS.filter(p => p.vedette);

  // Sécurité (Fallback) : Si aucun produit n'a vedette: true, on prend les 4 premiers produits
  if (featured.length === 0) {
    featured = PRODUITS.slice(0, 4);
  } else {
    featured = featured.slice(0, 4);
  }

  // Récupérer la wishlist depuis localStorage
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  container.innerHTML = featured.map(product => {
    const isFav = wishlist.includes(product.id);

    // Récupération de la première image du tableau 'images'
    const mainImage = (product.images && product.images.length > 0) 
      ? product.images[0] 
      : 'https://via.placeholder.com/300x200?text=Somone+Gear';

    return `
      <div class="product-card">
        <div class="product-image-container">
          <span class="product-category">${product.categorie}</span>
          <button class="fav-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist(${product.id})" title="Favoris">
            ${isFav ? '❤️' : '🤍'}
          </button>
          <img
           src="${mainImage}"
           alt="${product.nom}"
           class="product-image"
           style="cursor: pointer;"
           onclick="openQuickView(${product.id})"
           onerror="this.src='https://via.placeholder.com/300'"
          >
        </div>
        <div class="product-info">
          <h3 class="product-title" style="cursor: pointer;" onclick="openQuickView(${product.id})">${product.nom}</h3>
          <p class="product-desc">${product.description}</p>
          <div class="product-footer">
            <span class="product-price">${product.prix.toLocaleString('fr-FR')} FCFA</span>
            <button class="add-cart-btn" onclick="addToCart(${product.id})">
              🛒 Ajouter
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Fonction d'ajout au panier depuis l'accueil
function addToCart(productId) {
  let panier = JSON.parse(localStorage.getItem('panier')) || [];
  const existingItem = panier.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantite += 1;
  } else {
    panier.push({ id: productId, quantite: 1 });
  }

  localStorage.setItem('panier', JSON.stringify(panier));

  // Met à jour les badges si la fonction globale existe
  if (typeof updateBadges === 'function') {
    updateBadges();
  }
}

// Fonction d'ajout/retrait de la wishlist depuis l'accueil
function toggleWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter(id => id !== productId);
  } else {
    wishlist.push(productId);
  }

  localStorage.setItem('wishlist', JSON.stringify(wishlist));

  renderFeaturedProducts();
  if (typeof updateBadges === 'function') {
    updateBadges();
  }
}