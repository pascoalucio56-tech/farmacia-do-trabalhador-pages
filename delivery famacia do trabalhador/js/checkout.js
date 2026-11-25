/**
 * Delivery Farmácia do Trabalhador - Fluxo de Checkout e Pagamentos
 */

class CheckoutManager {
  constructor() {
    this.deliveryType = "delivery"; // "delivery" ou "takeout"
    this.selectedNeighborhood = null;
    this.deliveryFee = 0;
    this.selectedPayment = "pix"; // "pix", "link", "money", "card_delivery"
    this.needChange = false;
  }

  init() {
    this.populateNeighborhoods();
    this.bindEvents();
    this.updateTotals();
  }

  populateNeighborhoods() {
    const select = document.getElementById("checkout-neighborhood");
    if (!select) return;

    const neighborhoods = StoreDB.getNeighborhoods();
    select.innerHTML = `<option value="">Selecione seu bairro...</option>`;

    neighborhoods.forEach(n => {
      const option = document.createElement("option");
      option.value = n.name;
      option.dataset.fee = n.fee;
      option.dataset.time = n.time;
      option.textContent = `${n.name} (Taxa: R$ ${n.fee.toFixed(2)} - ${n.time})`;
      select.appendChild(option);
    });
  }

  bindEvents() {
    // Alternador de Entrega / Retirada
    const deliveryBtns = document.querySelectorAll(".delivery-type-btn");
    deliveryBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        deliveryBtns.forEach(b => b.classList.remove("active"));
        const target = e.currentTarget;
        target.classList.add("active");
        this.deliveryType = target.dataset.type;

        const addressFields = document.getElementById("address-fields-container");
        if (this.deliveryType === "takeout") {
          addressFields.style.display = "none";
          this.deliveryFee = 0;
        } else {
          addressFields.style.display = "block";
          this.calculateDeliveryFee();
        }
        this.updateTotals();
      });
    });

    // Mudança de Bairro
    const neighborhoodSelect = document.getElementById("checkout-neighborhood");
    if (neighborhoodSelect) {
      neighborhoodSelect.addEventListener("change", () => {
        this.calculateDeliveryFee();
        this.updateTotals();
      });
    }

    // Busca de CEP automático via ViaCEP
    const cepInput = document.getElementById("checkout-cep");
    if (cepInput) {
      cepInput.addEventListener("input", (e) => {
        let v = e.target.value.replace(/\D/g, "");
        if (v.length > 5) {
          v = v.replace(/^(\d{5})(\d)/, "$1-$2");
        }
        e.target.value = v.substring(0, 9);

        const cleanCep = v.replace(/\D/g, "");
        if (cleanCep.length === 8) {
          this.fetchCep(cleanCep);
        }
      });
    }

    // Máscara de Telefone
    const phoneInput = document.getElementById("checkout-phone");
    if (phoneInput) {
      phoneInput.addEventListener("input", (e) => {
        let v = e.target.value.replace(/\D/g, "");
        if (v.length > 10) {
          v = v.replace(/^(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        } else if (v.length > 5) {
          v = v.replace(/^(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
        } else if (v.length > 2) {
          v = v.replace(/^(\d{2})(\d+)/, "($1) $2");
        }
        e.target.value = v.substring(0, 15);
      });
    }

    // Métodos de Pagamento
    const paymentCards = document.querySelectorAll(".payment-card");
    paymentCards.forEach(card => {
      card.addEventListener("click", () => {
        paymentCards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        const radio = card.querySelector("input[type='radio']");
        if (radio) radio.checked = true;

        this.selectedPayment = card.dataset.payment;
        this.renderPaymentDetails();
      });
    });

    // Checkbox de Troco
    const changeCheckbox = document.getElementById("need-change-checkbox");
    if (changeCheckbox) {
      changeCheckbox.addEventListener("change", (e) => {
        this.needChange = e.target.checked;
        const changeInputGroup = document.getElementById("change-input-group");
        if (changeInputGroup) {
          changeInputGroup.style.display = this.needChange ? "block" : "none";
        }
      });
    }

    // Botão de Copiar Chave Pix
    const copyPixBtn = document.getElementById("btn-copy-pix-key");
    if (copyPixBtn) {
      copyPixBtn.addEventListener("click", () => {
        const pixKeyInput = document.getElementById("pix-key-input");
        if (pixKeyInput) {
          pixKeyInput.select();
          navigator.clipboard.writeText(pixKeyInput.value).then(() => {
            showToast("Chave Pix copiada com sucesso!", "success");
          });
        }
      });
    }

    // Submissão do Pedido para o WhatsApp
    const submitBtn = document.getElementById("btn-submit-order-whatsapp");
    if (submitBtn) {
      submitBtn.addEventListener("click", () => this.handleOrderSubmission());
    }
  }

  async fetchCep(cep) {
    try {
      showToast("Buscando endereço pelo CEP...", "info");
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();

      if (!data.erro) {
        const streetInput = document.getElementById("checkout-street");
        const cityInput = document.getElementById("checkout-city");
        const neighborhoodSelect = document.getElementById("checkout-neighborhood");

        if (streetInput) streetInput.value = data.logradouro || "";
        if (cityInput) cityInput.value = `${data.localidade}/${data.uf}`;

        // Tenta selecionar o bairro no select
        if (neighborhoodSelect && data.bairro) {
          let matched = false;
          for (let i = 0; i < neighborhoodSelect.options.length; i++) {
            if (neighborhoodSelect.options[i].value.toLowerCase() === data.bairro.toLowerCase()) {
              neighborhoodSelect.selectedIndex = i;
              matched = true;
              break;
            }
          }
          if (!matched) {
            // Adiciona o bairro novo com taxa padrão
            const storeConfig = StoreDB.getStoreConfig();
            const option = document.createElement("option");
            option.value = data.bairro;
            option.dataset.fee = storeConfig.defaultDeliveryFee;
            option.textContent = `${data.bairro} (Taxa: R$ ${storeConfig.defaultDeliveryFee.toFixed(2)})`;
            neighborhoodSelect.appendChild(option);
            neighborhoodSelect.value = data.bairro;
          }
          this.calculateDeliveryFee();
          this.updateTotals();
        }

        // Move foco para o número
        const numberInput = document.getElementById("checkout-number");
        if (numberInput) numberInput.focus();
        showToast("Endereço localizado!", "success");
      } else {
        showToast("CEP não encontrado. Preencha manualmente.", "error");
      }
    } catch (e) {
      console.error("Erro no ViaCEP:", e);
    }
  }

  calculateDeliveryFee() {
    if (this.deliveryType === "takeout") {
      this.deliveryFee = 0;
      return;
    }

    const select = document.getElementById("checkout-neighborhood");
    if (select && select.selectedIndex > 0) {
      const selectedOption = select.options[select.selectedIndex];
      this.deliveryFee = parseFloat(selectedOption.dataset.fee) || 0;
      this.selectedNeighborhood = selectedOption.value;
    } else {
      const storeConfig = StoreDB.getStoreConfig();
      this.deliveryFee = storeConfig.defaultDeliveryFee || 5.00;
      this.selectedNeighborhood = "";
    }
  }

  updateTotals() {
    const subtotal = cart.getSubtotal();
    const total = subtotal + this.deliveryFee;

    const subtotalEl = document.getElementById("checkout-subtotal-val");
    const feeEl = document.getElementById("checkout-fee-val");
    const totalEl = document.getElementById("checkout-total-val");
    const submitBtnVal = document.getElementById("submit-btn-total-val");

    if (subtotalEl) subtotalEl.textContent = WhatsAppOrderSender.formatCurrency(subtotal);
    if (feeEl) feeEl.textContent = this.deliveryType === "takeout" ? "Grátis" : WhatsAppOrderSender.formatCurrency(this.deliveryFee);
    if (totalEl) totalEl.textContent = WhatsAppOrderSender.formatCurrency(total);
    if (submitBtnVal) submitBtnVal.textContent = WhatsAppOrderSender.formatCurrency(total);

    this.renderPaymentDetails();
  }

  renderPaymentDetails() {
    const pixBox = document.getElementById("pix-details-container");
    const linkBox = document.getElementById("link-details-container");
    const moneyBox = document.getElementById("money-details-container");
    const cardBox = document.getElementById("card-details-container");

    if (pixBox) pixBox.style.display = "none";
    if (linkBox) linkBox.style.display = "none";
    if (moneyBox) moneyBox.style.display = "none";
    if (cardBox) cardBox.style.display = "none";

    const storeConfig = StoreDB.getStoreConfig();
    const total = cart.getSubtotal() + this.deliveryFee;

    if (this.selectedPayment === "pix" && pixBox) {
      pixBox.style.display = "block";
      const pixKeyInput = document.getElementById("pix-key-input");
      const pixBeneficiaryEl = document.getElementById("pix-beneficiary-name");
      const pixTotalEl = document.getElementById("pix-amount-display");
      const qrImg = document.getElementById("pix-qr-img");

      if (pixKeyInput) pixKeyInput.value = storeConfig.pixKey;
      if (pixBeneficiaryEl) pixBeneficiaryEl.textContent = storeConfig.pixBeneficiary;
      if (pixTotalEl) pixTotalEl.textContent = WhatsAppOrderSender.formatCurrency(total);

      // Gera QR Code via API pública do QR Server com a chave da farmácia
      if (qrImg) {
        const qrContent = encodeURIComponent(`PIX: ${storeConfig.pixKey} | VALOR: R$ ${total.toFixed(2)} | FARMACIA DO TRABALHADOR`);
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrContent}`;
      }
    } else if (this.selectedPayment === "link" && linkBox) {
      linkBox.style.display = "block";
      const linkBtn = document.getElementById("btn-open-payment-link");
      if (linkBtn) linkBtn.href = storeConfig.paymentLinkUrl;
    } else if (this.selectedPayment === "money" && moneyBox) {
      moneyBox.style.display = "block";
    } else if (this.selectedPayment === "card_delivery" && cardBox) {
      cardBox.style.display = "block";
    }
  }

  handleOrderSubmission() {
    if (cart.getItems().length === 0) {
      showToast("Sua cesta está vazia!", "error");
      return;
    }

    const storeConfig = StoreDB.getStoreConfig();
    const subtotal = cart.getSubtotal();

    if (subtotal < storeConfig.minOrderValue) {
      showToast(`O valor mínimo para pedido é de ${WhatsAppOrderSender.formatCurrency(storeConfig.minOrderValue)}`, "error");
      return;
    }

    // Validações
    const customerName = document.getElementById("checkout-name")?.value.trim();
    const customerPhone = document.getElementById("checkout-phone")?.value.trim();

    if (!customerName) {
      showToast("Por favor, informe seu Nome Completo.", "error");
      document.getElementById("checkout-name")?.focus();
      return;
    }

    if (!customerPhone || customerPhone.length < 14) {
      showToast("Por favor, informe seu WhatsApp de contato com DDD.", "error");
      document.getElementById("checkout-phone")?.focus();
      return;
    }

    let street = "";
    let number = "";
    let neighborhood = "";
    let complement = "";
    let referencePoint = "";
    let cep = "";

    if (this.deliveryType === "delivery") {
      cep = document.getElementById("checkout-cep")?.value.trim() || "";
      street = document.getElementById("checkout-street")?.value.trim();
      number = document.getElementById("checkout-number")?.value.trim();
      neighborhood = document.getElementById("checkout-neighborhood")?.value.trim();
      complement = document.getElementById("checkout-complement")?.value.trim() || "";
      referencePoint = document.getElementById("checkout-reference")?.value.trim();

      if (!street) {
        showToast("Informe o nome da sua Rua/Avenida.", "error");
        document.getElementById("checkout-street")?.focus();
        return;
      }

      if (!number) {
        showToast("Informe o Número do imóvel.", "error");
        document.getElementById("checkout-number")?.focus();
        return;
      }

      if (!neighborhood) {
        showToast("Selecione o Bairro para entrega.", "error");
        document.getElementById("checkout-neighborhood")?.focus();
        return;
      }

      // Ponto de Referência Obrigatório
      if (!referencePoint) {
        showToast("Por favor, preencha o Ponto de Referência para auxiliar o entregador.", "error");
        document.getElementById("checkout-reference")?.focus();
        return;
      }
    }

    // Pagamento em dinheiro com troco
    let changeFor = null;
    const total = subtotal + this.deliveryFee;

    if (this.selectedPayment === "money" && this.needChange) {
      const changeVal = parseFloat(document.getElementById("checkout-change-for")?.value);
      if (!changeVal || changeVal <= total) {
        showToast(`O valor para troco deve ser maior que o total do pedido (${WhatsAppOrderSender.formatCurrency(total)})`, "error");
        document.getElementById("checkout-change-for")?.focus();
        return;
      }
      changeFor = changeVal;
    }

    // Cartão na entrega
    let cardType = "";
    if (this.selectedPayment === "card_delivery") {
      const cardOption = document.querySelector("input[name='card_flag']:checked");
      cardType = cardOption ? cardOption.value : "Débito / Crédito";
    }

    const notes = document.getElementById("checkout-notes")?.value.trim() || "";

    const orderData = {
      orderCode: WhatsAppOrderSender.generateOrderCode(),
      date: new Date().toLocaleDateString("pt-BR"),
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      customerName,
      customerPhone,
      deliveryType: this.deliveryType,
      cep,
      street,
      number,
      neighborhood,
      complement,
      referencePoint,
      items: cart.getItems(),
      subtotal,
      deliveryFee: this.deliveryFee,
      total,
      paymentMethod: this.selectedPayment,
      needChange: this.needChange,
      changeFor,
      cardType,
      notes,
      hasPrescriptionItems: cart.hasPrescriptionItems()
    };

    // Salva no histórico para geração da comanda térmica
    try {
      localStorage.setItem("farmacia_last_order", JSON.stringify(orderData));
      const history = JSON.parse(localStorage.getItem("farmacia_orders_history") || "[]");
      history.unshift(orderData);
      if (history.length > 50) history.pop(); // Mantém os últimos 50 pedidos
      localStorage.setItem("farmacia_orders_history", JSON.stringify(history));
    } catch (e) {
      console.error("Erro ao salvar histórico do pedido:", e);
    }

    // Envia o pedido pelo WhatsApp
    WhatsAppOrderSender.sendOrder(orderData);

    showToast("Pedido gerado com sucesso! Abrindo WhatsApp...", "success");

    // Limpa a sacola e fecha o modal
    setTimeout(() => {
      cart.clear();
      closeModal("checkout-modal");
      closeModal("cart-modal");
    }, 1500);
  }
}

const checkout = new CheckoutManager();
