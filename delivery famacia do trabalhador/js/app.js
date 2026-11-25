/**
 * Delivery Farmácia do Trabalhador - Aplicação Principal
 */

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

let currentCategory = "all";
let currentSearchTerm = "";
const CATALOG_PAGE_SIZE = 60;
let visibleCatalogLimit = CATALOG_PAGE_SIZE;

async function initApp() {
  renderStoreInfo();
  renderCategories();
  await StoreDB.initProducts();
  renderProducts(true);
  setupEventListeners();
  setupCartSubscriber();
  checkout.init();
}

/**
 * Renderiza informações do cabeçalho da farmácia
 */
function renderStoreInfo() {
  const config = StoreDB.getStoreConfig();
  
  // Aplica cor do tema dinamicamente
  StoreDB.applyTheme(config.themeColor);

  const nameEl = document.getElementById("store-name-display");
  const sloganEl = document.getElementById("store-slogan-display");
  const addressEl = document.getElementById("store-address-display");
  const hoursEl = document.getElementById("store-hours-display");
  const statusEl = document.getElementById("store-status-badge");
  const minOrderEl = document.getElementById("store-min-order-display");
  const deliveryTimeEl = document.getElementById("store-delivery-time-display");
  const logoContainer = document.getElementById("store-logo-container");

  if (nameEl) nameEl.textContent = config.name;
  if (sloganEl) sloganEl.textContent = config.slogan;
  if (addressEl) addressEl.textContent = config.address;
  if (hoursEl) hoursEl.textContent = config.openingHours;
  if (deliveryTimeEl) deliveryTimeEl.textContent = config.deliveryTimeEstimate;
  if (minOrderEl) minOrderEl.textContent = WhatsAppOrderSender.formatCurrency(config.minOrderValue);

  // Logo da farmácia (personalizada ou padrão)
  if (logoContainer) {
    if (config.logoUrl && config.logoUrl.trim()) {
      logoContainer.innerHTML = `<img src="${config.logoUrl.trim()}" alt="${config.name}" class="store-logo-img" onerror="this.parentElement.innerHTML='<i class=\\\'fas fa-prescription-bottle-alt\\\'></i>'">`;
    } else {
      logoContainer.innerHTML = `<i class="fas fa-prescription-bottle-alt"></i>`;
    }
  }

  if (statusEl) {
    if (config.isOpen) {
      statusEl.className = "status-indicator status-open";
      statusEl.innerHTML = `<i class="fas fa-circle"></i> Aberto Agora`;
    } else {
      statusEl.className = "status-indicator status-closed";
      statusEl.innerHTML = `<i class="fas fa-circle"></i> Fechado`;
    }
  }
}

/**
 * Renderiza as abas de categorias
 */
function renderCategories() {
  const container = document.getElementById("categories-nav-container");
  if (!container) return;

  const categories = StoreDB.getCategories();
  container.innerHTML = "";

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = `category-pill ${cat.id === currentCategory ? "active" : ""}`;
    btn.dataset.category = cat.id;
    btn.innerHTML = `<i class="${cat.icon}"></i> <span>${cat.name}</span>`;

    btn.addEventListener("click", () => {
      document.querySelectorAll(".category-pill").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = cat.id;
      renderProducts(true);
    });

    container.appendChild(btn);
  });
}

/**
 * Renderiza os produtos filtrados com estoque e indicação ("Para que serve")
 */
function renderProducts(resetLimit = false) {
  const grid = document.getElementById("products-grid");
  const countEl = document.getElementById("products-count");
  if (!grid) return;

  if (resetLimit) {
    visibleCatalogLimit = CATALOG_PAGE_SIZE;
  }

  let products = StoreDB.getProducts();

  // Filtro por Categoria
  if (currentCategory !== "all") {
    products = products.filter(p => p.category === currentCategory);
  }

  // Filtro por Busca
  if (currentSearchTerm.trim()) {
    const term = currentSearchTerm.toLowerCase().trim();
    products = products.filter(p => 
      p.name.toLowerCase().includes(term) ||
      (p.indication && p.indication.toLowerCase().includes(term)) ||
      (p.description && p.description.toLowerCase().includes(term)) ||
      (p.laboratory && p.laboratory.toLowerCase().includes(term)) ||
      (p.presentation && p.presentation.toLowerCase().includes(term))
    );
  }

  if (countEl) {
    countEl.textContent = `${products.length} itens`;
  }

  if (products.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <i class="fas fa-prescription-bottle-alt"></i>
        <h3>Nenhum produto encontrado</h3>
        <p>Tente buscar por outro nome ou navegue pelas categorias acima.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = "";

  const visibleProducts = products.slice(0, visibleCatalogLimit);

  visibleProducts.forEach(p => {
    const qtyInCart = cart.getItemQty(p.id);
    const stockQty = p.stockQuantity !== undefined ? Number(p.stockQuantity) : 20;
    const isOutOfStock = p.available === false || stockQty <= 0;

    const card = document.createElement("div");
    card.className = "product-card";

    let badgeHtml = "";
    if (p.badge) {
      badgeHtml = `<span class="product-badge">${p.badge}</span>`;
    }

    let prescriptionHtml = "";
    if (p.requiresPrescription) {
      prescriptionHtml = `<span class="prescription-badge"><i class="fas fa-file-medical"></i> Receita</span>`;
    }

    let oldPriceHtml = "";
    if (p.oldPrice && p.oldPrice > p.price) {
      oldPriceHtml = `<span class="product-price-old">${WhatsAppOrderSender.formatCurrency(p.oldPrice)}</span>`;
    }

    // Selo de Estoque
    let stockBadgeHtml = "";
    if (isOutOfStock) {
      stockBadgeHtml = `<span class="stock-badge stock-out"><i class="fas fa-ban"></i> Esgotado</span>`;
    } else if (stockQty <= 5) {
      stockBadgeHtml = `<span class="stock-badge stock-low"><i class="fas fa-exclamation-circle"></i> Restam ${stockQty} un.!</span>`;
    } else {
      stockBadgeHtml = `<span class="stock-badge stock-in"><i class="fas fa-check-circle"></i> ${stockQty} un. em estoque</span>`;
    }

    // Indicação "Para que serve"
    let indicationHtml = "";
    const indicationText = p.indication || p.description;
    if (indicationText) {
      indicationHtml = `
        <div class="product-indication" title="Para que serve: ${indicationText}">
          <i class="fas fa-notes-medical"></i> <strong>Para que serve:</strong> ${indicationText}
        </div>
      `;
    }

    // Botão de Adicionar ou Controle de Quantidade
    let actionHtml = "";
    if (isOutOfStock) {
      actionHtml = `
        <button class="product-action-btn disabled" disabled>
          <i class="fas fa-ban"></i> Esgotado
        </button>
      `;
    } else if (qtyInCart > 0) {
      actionHtml = `
        <div class="qty-control-wrapper">
          <button class="qty-btn" onclick="handleCardQtyChange(${p.id}, -1)">
            <i class="fas fa-minus"></i>
          </button>
          <span class="qty-value">${qtyInCart}</span>
          <button class="qty-btn" onclick="handleCardQtyChange(${p.id}, 1)">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      `;
    } else {
      actionHtml = `
        <button class="product-action-btn" onclick="handleCardAdd(${p.id})">
          <i class="fas fa-plus"></i> Adicionar
        </button>
      `;
    }

    card.innerHTML = `
      <div class="product-image-wrap">
        <img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80'">
        ${badgeHtml}
        ${prescriptionHtml}
      </div>
      <div class="product-info">
        <span class="product-lab">${p.laboratory || "Genérico / Similar"}</span>
        <h4 class="product-name" title="${p.name}">${p.name}</h4>
        <span class="product-presentation">${p.presentation || ""}</span>
        ${indicationHtml}
        ${stockBadgeHtml}
        <div class="product-pricing">
          ${oldPriceHtml}
          <span class="product-price-current">${WhatsAppOrderSender.formatCurrency(p.price)}</span>
        </div>
        ${actionHtml}
      </div>
    `;

    grid.appendChild(card);
  });

  if (products.length > visibleProducts.length) {
    const remaining = products.length - visibleProducts.length;
    const loadMoreWrap = document.createElement("div");
    loadMoreWrap.style.cssText = "grid-column: 1 / -1; text-align: center; padding: 14px 0;";
    loadMoreWrap.innerHTML = `
      <button type="button" id="btn-load-more-catalog" class="btn-primary-block" style="max-width: 320px; margin: 0 auto; font-size: 13px; padding: 11px 16px;">
        <i class="fas fa-plus-circle"></i> Carregar mais produtos (${remaining} restantes)
      </button>
    `;
    grid.appendChild(loadMoreWrap);

    const loadMoreBtn = document.getElementById("btn-load-more-catalog");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        visibleCatalogLimit += CATALOG_PAGE_SIZE;
        renderProducts(false);
      });
    }
  }
}

function handleCardAdd(productId) {
  const res = cart.addItem(productId);
  if (res && res.success === false) {
    if (res.reason === "max_stock") {
      showToast(`Limite em estoque atingido (${res.maxStock} un.)!`, "error");
    } else if (res.reason === "out_of_stock") {
      showToast("Este produto está esgotado no momento.", "error");
    } else {
      showToast("Produto indisponível para compra.", "error");
    }
    return;
  }
  showToast("Item adicionado à cesta!", "success");
}

function handleCardQtyChange(productId, delta) {
  const res = cart.updateQty(productId, delta);
  if (res && res.success === false && res.reason === "max_stock") {
    showToast(`Limite em estoque atingido (${res.maxStock} un.)!`, "error");
  }
}

/**
 * Assina atualizações do carrinho para sincronizar a interface
 */
function setupCartSubscriber() {
  cart.subscribe((cartInstance) => {
    renderProducts();
    updateFloatingCartBar(cartInstance);
    renderCartModalItems(cartInstance);
    checkout.updateTotals();
  });

  // Atualiza estado inicial
  updateFloatingCartBar(cart);
}

/**
 * Atualiza a barra fixa inferior da sacola
 */
function updateFloatingCartBar(cartInstance) {
  const bar = document.getElementById("floating-cart-bar");
  const countBadge = document.getElementById("floating-cart-count");
  const totalVal = document.getElementById("floating-cart-total");

  if (!bar) return;

  const count = cartInstance.getCount();
  const subtotal = cartInstance.getSubtotal();

  if (count > 0) {
    bar.style.display = "block";
    if (countBadge) countBadge.textContent = `${count} ${count === 1 ? "item" : "itens"}`;
    if (totalVal) totalVal.textContent = WhatsAppOrderSender.formatCurrency(subtotal);
  } else {
    bar.style.display = "none";
  }
}

/**
 * Renderiza itens dentro do modal da sacola
 */
function renderCartModalItems(cartInstance) {
  const list = document.getElementById("cart-modal-items");
  const subtotalEl = document.getElementById("cart-modal-subtotal");
  const totalEl = document.getElementById("cart-modal-total");
  const prescriptionWarning = document.getElementById("cart-prescription-warning");

  if (!list) return;

  const items = cartInstance.getItems();
  const subtotal = cartInstance.getSubtotal();

  if (subtotalEl) subtotalEl.textContent = WhatsAppOrderSender.formatCurrency(subtotal);
  if (totalEl) totalEl.textContent = WhatsAppOrderSender.formatCurrency(subtotal);

  if (prescriptionWarning) {
    prescriptionWarning.style.display = cartInstance.hasPrescriptionItems() ? "flex" : "none";
  }

  if (items.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-shopping-basket"></i>
        <h3>Sua cesta está vazia</h3>
        <p>Escolha seus remédios e produtos de saúde no catálogo.</p>
      </div>
    `;
    const checkoutBtn = document.getElementById("btn-go-to-checkout");
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  const checkoutBtn = document.getElementById("btn-go-to-checkout");
  if (checkoutBtn) checkoutBtn.disabled = false;

  list.innerHTML = "";

  items.forEach(item => {
    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";

    const itemTotal = item.price * item.qty;

    itemEl.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <h5 class="cart-item-title">${item.name}</h5>
        <span class="product-lab">${item.presentation}</span>
        <div class="cart-item-price">${WhatsAppOrderSender.formatCurrency(itemTotal)}</div>
      </div>
      <div class="cart-item-controls">
        <div class="qty-control-wrapper" style="width: 90px;">
          <button class="qty-btn" onclick="cart.updateQty(${item.id}, -1)">
            <i class="fas fa-minus"></i>
          </button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" onclick="cart.updateQty(${item.id}, 1)">
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <button class="drawer-close-btn" style="color: #ef4444;" onclick="cart.removeItem(${item.id})" title="Remover item">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;

    list.appendChild(itemEl);
  });
}

/**
 * Event Listeners gerais da interface
 */
function setupEventListeners() {
  // Busca
  const searchInput = document.getElementById("search-input");
  const clearBtn = document.getElementById("search-clear-btn");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearchTerm = e.target.value;
      if (clearBtn) {
        clearBtn.style.display = currentSearchTerm ? "block" : "none";
      }
      renderProducts(true);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      currentSearchTerm = "";
      clearBtn.style.display = "none";
      renderProducts(true);
    });
  }

  // Abrir Sacola pelo Botão Flutuante
  const cartBtn = document.getElementById("floating-cart-btn");
  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      openModal("cart-modal");
    });
  }

  // Avançar da Sacola para o Checkout
  const goToCheckoutBtn = document.getElementById("btn-go-to-checkout");
  if (goToCheckoutBtn) {
    goToCheckoutBtn.addEventListener("click", () => {
      closeModal("cart-modal");
      openModal("checkout-modal");
      checkout.updateTotals();
    });
  }

  // Voltar do Checkout para a Sacola
  const backToCartBtn = document.getElementById("btn-back-to-cart");
  if (backToCartBtn) {
    backToCartBtn.addEventListener("click", () => {
      closeModal("checkout-modal");
      openModal("cart-modal");
    });
  }

  // Fechar modais ao clicar no overlay ou no botão de fechar
  document.querySelectorAll(".drawer-close-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const modal = e.target.closest(".modal-overlay");
      if (modal) closeModal(modal.id);
    });
  });

  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeModal(overlay.id);
      }
    });
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

/**
 * Sistema de Notificações Toast
 */
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type === "success" ? "toast-success" : type === "error" ? "toast-error" : ""}`;

  let icon = "fa-info-circle";
  if (type === "success") icon = "fa-check-circle";
  if (type === "error") icon = "fa-exclamation-triangle";

  toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px)";
    toast.style.transition = "all 0.3s";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
