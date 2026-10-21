document.addEventListener('DOMContentLoaded', () => {
  renderWishlistPage();
});

// Affiche la liste des favoris ou l'état vide
function renderWishlistPage() {
  const container = document.getElementById('wishlist-container');
  if (!container) return;

  // Récupération sécurisée et conversion explicite en NOMBRES
  const rawWishlist = typeof getWishlist === 'function' 
    ? getWishlist() 
    : JSON.parse(localStorage.getItem('wishlist')) || [];

  const wishlistIds = rawWishlist.map(id => Number(id));

  // Si aucun favori
  if (wishlistIds.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">❤️</div>
        <h2>Votre liste de favoris est vide</h2>
        <p>Vous n'avez pas encore ajouté d'articles à vos favoris.</p>
        <a href="produits.html" class="btn-primary">Explorer la boutique</a>
      </div>
    `;
    return;
  }

  // Filtrage robuste avec conversion explicite des IDs
  const wishlistProducts = PRODUITS.filter(product => wishlistIds.includes(Number(product.id)));

  // Affichage des cartes produits
  container.innerHTML = wishlistProducts.map(product => {
    const imgSrc = (product.images && product.images.length > 0) ? product.images[0] : (product.image || '');

    return `
      <div class="product-card">
        <div class="product-image-container">
          <span class="product-category">${product.categorie}</span>
          <button class="fav-btn active" onclick="event.stopPropagation(); removeWishlistAndRender(${product.id})" title="Retirer des favoris">
            ❤️
          </button>
          <img 
            src="${imgSrc}" 
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
            <button class="add-cart-btn" onclick="addToCartWishlist(${product.id})">
              🛒 Ajouter
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Fonction pour retirer un produit des favoris et rafraîchir la page
function removeWishlistAndRender(productId) {
  if (typeof toggleWishlist === 'function') {
    toggleWishlist(productId);
  } else {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(id => Number(id) !== Number(productId));
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    if (typeof updateBadges === 'function') updateBadges();
  }
  renderWishlistPage();
}

// Ajout au panier depuis la page Favoris avec notification/mise à jour du badge
function addToCartWishlist(productId) {
  if (typeof addToCart === 'function') {
    addToCart(productId);
  } else {
    // Solution de secours si addToCart n'est pas accessible
    const panier = JSON.parse(localStorage.getItem('panier')) || [];
    const produit = PRODUITS.find(p => p.id === productId);
    
    if (produit) {
      const index = panier.findIndex(item => item.id === productId);
      if (index !== -1) {
        panier[index].quantite = (panier[index].quantite || 1) + 1;
      } else {
        panier.push({ ...produit, quantite: 1 });
      }
      localStorage.setItem('panier', JSON.stringify(panier));
    }
  }

  // Met à jour les badges du header (panier et favoris)
  if (typeof updateBadges === 'function') {
    updateBadges();
  }
}