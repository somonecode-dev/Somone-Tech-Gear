document.addEventListener('DOMContentLoaded', () => {
  renderAllProducts();
  initFilters();
});

// Affichage global de la grille des produits
function renderAllProducts(productsToRender = PRODUITS) {
  const container = document.getElementById('products-grid');
  if (!container) return;

  if (typeof PRODUITS === 'undefined') {
    console.error("La variable PRODUITS n'est pas définie dans js/data.js");
    return;
  }

  if (productsToRender.length === 0) {
    container.innerHTML = `<p class="no-results">Aucun produit trouvé.</p>`;
    return;
  }

  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  container.innerHTML = productsToRender.map(product => {
    const isFav = wishlist.includes(product.id);

    let imgSrc = 'https://via.placeholder.com/300x200?text=Somone+Gear';
    if (product.images && product.images.length > 0) {
      imgSrc = product.images[0];
    } else if (product.image) {
      imgSrc = product.image;
    }

    return `
      <div class="product-card">
        <div class="product-image-container">
          <span class="product-category">${product.categorie}</span>
          <button class="fav-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlistBoutique(${product.id})" title="Favoris">
            ${isFav ? '❤️' : '🤍'}
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
            <button class="add-cart-btn" onclick="addToCartBoutique(${product.id})">
              🛒 Ajouter
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Gestion des filtres par catégorie et recherche textuelle
function initFilters() {
  const categoryButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('search-input');

  let activeCategory = 'Tous';
  let searchQuery = '';

  function filterProducts() {
    let filtered = PRODUITS;

    if (activeCategory !== 'Tous') {
      filtered = filtered.filter(p => p.categorie.toLowerCase() === activeCategory.toLowerCase());
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.nom.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

    renderAllProducts(filtered);
  }

  categoryButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      activeCategory = e.target.getAttribute('data-category') || 'Tous';
      filterProducts();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      filterProducts();
    });
  }
}

function addToCartBoutique(productId) {
  let panier = JSON.parse(localStorage.getItem('panier')) || [];
  const existingItem = panier.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantite += 1;
  } else {
    panier.push({ id: productId, quantite: 1 });
  }

  localStorage.setItem('panier', JSON.stringify(panier));

  if (typeof updateBadges === 'function') {
    updateBadges();
  }
}

function toggleWishlistBoutique(productId) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  if (wishlist.includes(productId)) {
    wishlist = wishlist.filter(id => id !== productId);
  } else {
    wishlist.push(productId);
  }

  localStorage.setItem('wishlist', JSON.stringify(wishlist));

  renderAllProducts();
  if (typeof updateBadges === 'function') {
    updateBadges();
  }
}