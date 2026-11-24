/**
 * Delivery Farmácia do Trabalhador - Gerenciador do Carrinho / Sacola
 * Suporte a verificação de estoque em tempo real
 */

class CartManager {
  constructor() {
    this.storageKey = "farmacia_cart_items";
    this.items = this.loadCart();
    this.listeners = [];
  }

  loadCart() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Erro ao carregar sacola:", e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
      this.notifyListeners();
    } catch (e) {
      console.error("Erro ao salvar sacola:", e);
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  notifyListeners() {
    this.listeners.forEach(cb => cb(this));
  }

  getItems() {
    return this.items;
  }

  getItemQty(productId) {
    const item = this.items.find(i => i.id === Number(productId));
    return item ? item.qty : 0;
  }

  addItem(productId) {
    const products = StoreDB.getProducts();
    const product = products.find(p => p.id === Number(productId));
    if (!product || product.available === false) {
      return { success: false, reason: "unavailable" };
    }

    const maxStock = product.stockQuantity !== undefined ? Number(product.stockQuantity) : 999;
    if (maxStock <= 0) {
      return { success: false, reason: "out_of_stock" };
    }

    const existing = this.items.find(i => i.id === product.id);
    if (existing) {
      if (existing.qty >= maxStock) {
        return { success: false, reason: "max_stock", maxStock };
      }
      existing.qty += 1;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        presentation: product.presentation,
        laboratory: product.laboratory,
        price: product.price,
        image: product.image,
        requiresPrescription: product.requiresPrescription || false,
        stockQuantity: maxStock,
        qty: 1
      });
    }

    this.saveCart();
    return { success: true };
  }

  updateQty(productId, delta) {
    const itemIndex = this.items.findIndex(i => i.id === Number(productId));
    if (itemIndex === -1) return { success: false };

    if (delta > 0) {
      const products = StoreDB.getProducts();
      const product = products.find(p => p.id === Number(productId));
      const maxStock = (product && product.stockQuantity !== undefined) ? Number(product.stockQuantity) : 999;
      if (this.items[itemIndex].qty >= maxStock) {
        return { success: false, reason: "max_stock", maxStock };
      }
    }

    this.items[itemIndex].qty += delta;

    if (this.items[itemIndex].qty <= 0) {
      this.items.splice(itemIndex, 1);
    }

    this.saveCart();
    return { success: true };
  }

  removeItem(productId) {
    this.items = this.items.filter(i => i.id !== Number(productId));
    this.saveCart();
  }

  clear() {
    this.items = [];
    this.saveCart();
  }

  getSubtotal() {
    return this.items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  }

  getCount() {
    return this.items.reduce((acc, item) => acc + item.qty, 0);
  }

  hasPrescriptionItems() {
    return this.items.some(item => item.requiresPrescription);
  }
}

// Instância global do carrinho
const cart = new CartManager();
