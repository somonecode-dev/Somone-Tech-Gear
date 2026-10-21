document.addEventListener('DOMContentLoaded', () => {
  renderCart();
});

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  renderOrdersHistory(); // Afficher l'historique au chargement
});

// Affichage principal du panier
function renderCart() {
  const container = document.getElementById('cart-items-container');
  const summaryBlock = document.getElementById('cart-summary');
  if (!container) return;

  const panier = JSON.parse(localStorage.getItem('panier')) || [];

  // Cas où le panier est vide
  if (panier.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🛒</div>
        <h2>Votre panier est vide</h2>
        <p>Découvrez nos équipements haute performance et ajoutez vos coups de cœur !</p>
        <a href="produits.html" class="btn-primary">Explorer la boutique</a>
      </div>
    `;
    if (summaryBlock) summaryBlock.style.display = 'none';
    return;
  }

  if (summaryBlock) summaryBlock.style.display = 'block';

  let subtotal = 0;

  // Génération du HTML des articles
  container.innerHTML = panier.map(item => {
    // Retrouver les infos du produit dans la variable globale PRODUITS
    const product = (typeof PRODUITS !== 'undefined') 
      ? PRODUITS.find(p => p.id === item.id) 
      : null;

    if (!product) return '';

    const itemTotal = product.prix * item.quantite;
    subtotal += itemTotal;

    const mainImage = (product.images && product.images.length > 0)
      ? product.images[0]
      : 'https://via.placeholder.com/100x100?text=Somone+Gear';

    return `
      <div class="cart-card">
        <img src="${mainImage}" alt="${product.nom}" class="cart-item-img" onerror="this.src='https://via.placeholder.com/100x100?text=Somone+Gear'">
        
        <div class="cart-item-details">
          <span class="cart-item-category">${product.categorie}</span>
          <h3 class="cart-item-title">${product.nom}</h3>
          <span class="cart-item-unit-price">${product.prix.toLocaleString('fr-FR')} FCFA / unité</span>
        </div>

        <div class="cart-item-quantity">
          <button class="qty-btn" onclick="updateQuantity(${product.id}, -1)">-</button>
          <span class="qty-value">${item.quantite}</span>
          <button class="qty-btn" onclick="updateQuantity(${product.id}, 1)">+</button>
        </div>

        <div class="cart-item-total">
          <span>${itemTotal.toLocaleString('fr-FR')} FCFA</span>
        </div>

        <button class="remove-btn" onclick="removeFromCart(${product.id})" title="Supprimer">
          🗑️
        </button>
      </div>
    `;
  }).join('');

  // Mise à jour du récapitulatif financiers
  updateSummaryCalculations(subtotal);
}

// Mise à jour des montants du récapitulatif
function updateSummaryCalculations(subtotal) {
  const shippingFee = subtotal > 0 ? 2000 : 0; // 2 000 FCFA de frais fixes
  const total = subtotal + shippingFee;

  const subtotalEl = document.getElementById('summary-subtotal');
  const shippingEl = document.getElementById('summary-shipping');
  const totalEl = document.getElementById('summary-total');

  if (subtotalEl) subtotalEl.textContent = `${subtotal.toLocaleString('fr-FR')} FCFA`;
  if (shippingEl) shippingEl.textContent = `${shippingFee.toLocaleString('fr-FR')} FCFA`;
  if (totalEl) totalEl.textContent = `${total.toLocaleString('fr-FR')} FCFA`;
}

// Modifier la quantité (+1 ou -1)
function updateQuantity(productId, change) {
  let panier = JSON.parse(localStorage.getItem('panier')) || [];
  const itemIndex = panier.findIndex(item => item.id === productId);

  if (itemIndex !== -1) {
    panier[itemIndex].quantite += change;

    // Si la quantité passe à 0 ou moins, on supprime
    if (panier[itemIndex].quantite <= 0) {
      panier.splice(itemIndex, 1);
    }

    localStorage.setItem('panier', JSON.stringify(panier));
    renderCart();
    if (typeof updateBadges === 'function') updateBadges();
  }
}

// Supprimer un article
function removeFromCart(productId) {
  let panier = JSON.parse(localStorage.getItem('panier')) || [];
  panier = panier.filter(item => item.id !== productId);

  localStorage.setItem('panier', JSON.stringify(panier));
  renderCart();
  if (typeof updateBadges === 'function') updateBadges();
}

// Fonction générique pour afficher la modale
function openModal({ icon, title, message, showCancel = false, onConfirm }) {
  const modal = document.getElementById('custom-modal');
  const modalIcon = document.getElementById('modal-icon');
  const modalTitle = document.getElementById('modal-title');
  const modalMessage = document.getElementById('modal-message');
  const cancelBtn = document.getElementById('modal-cancel-btn');
  const confirmBtn = document.getElementById('modal-confirm-btn');

  modalIcon.textContent = icon || 'ℹ️';
  modalTitle.textContent = title;
  modalMessage.textContent = message;

  cancelBtn.style.display = showCancel ? 'inline-block' : 'none';

  // Réinitialisation des événements
  const newConfirmBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

  newConfirmBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    if (onConfirm) onConfirm();
  });

  cancelBtn.onclick = () => modal.classList.remove('active');

  modal.classList.add('active');
}

// 1. Vider le panier avec confirmation élégante
function clearCart() {
  openModal({
    icon: '🗑️',
    title: 'Vider le panier ?',
    message: 'Êtes-vous sûr de vouloir retirer tous les articles de votre panier ?',
    showCancel: true,
    onConfirm: () => {
      localStorage.setItem('panier', JSON.stringify([]));
      renderCart();
      if (typeof updateBadges === 'function') updateBadges();
    }
  });
}

// 2. Valider la commande et sauvegarder l'historique
function processCheckout() {
  const panier = JSON.parse(localStorage.getItem('panier')) || [];
  if (panier.length === 0) return;

  // Création de l'objet commande
  const commandId = 'CMD-' + Math.floor(100000 + Math.random() * 900000);
  const nouvelleCommande = {
    id: commandId,
    date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    articles: panier,
    total: document.getElementById('summary-total').textContent
  };

  // Enregistrement dans localStorage
  const commandes = JSON.parse(localStorage.getItem('commandes')) || [];
  commandes.unshift(nouvelleCommande);
  localStorage.setItem('commandes', JSON.stringify(commandes));

  // Modale de confirmation
  openModal({
    icon: '🎉',
    title: 'Commande Confirmée !',
    message: `Merci pour votre achat. Votre commande N° ${commandId} a été enregistrée avec succès.`,
    showCancel: false,
    onConfirm: () => {
      localStorage.setItem('panier', JSON.stringify([]));
      renderCart();
      renderOrdersHistory(); // Rafraîchit directement la liste des commandes passées
      if (typeof updateBadges === 'function') updateBadges();
    }
  });
}

// --- Affichage de l'Historique des Commandes ---
function renderOrdersHistory() {
  const container = document.getElementById('orders-history-container');
  if (!container) return;

  const commandes = JSON.parse(localStorage.getItem('commandes')) || [];

  if (commandes.length === 0) {
    container.innerHTML = `
      <div class="empty-orders">
        <p>Aucune commande passée pour le moment.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = commandes.map(cmd => {
    // Calcul de la liste des items
    const itemsHTML = cmd.articles.map(item => {
      const product = (typeof PRODUITS !== 'undefined') 
        ? PRODUITS.find(p => p.id === item.id) 
        : null;

      if (!product) return '';

      return `
        <div class="order-item">
          <span>${product.nom} <strong>x${item.quantite}</strong></span>
          <span>${(product.prix * item.quantite).toLocaleString('fr-FR')} FCFA</span>
        </div>
      `;
    }).join('');

    return `
      <div class="order-card">
        <div class="order-header">
          <div>
            <span class="order-id">${cmd.id}</span>
            <span class="order-date">• ${cmd.date}</span>
          </div>
          <span class="order-status">Payée / En traitement</span>
        </div>
        <div class="order-body">
          ${itemsHTML}
        </div>
        <div class="order-footer">
          <span>Total réglé :</span>
          <strong class="order-total">${cmd.total}</strong>
        </div>
      </div>
    `;
  }).join('');
}