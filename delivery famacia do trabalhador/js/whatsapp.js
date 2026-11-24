/**
 * Delivery Farmácia do Trabalhador - Gerador de Mensagem para WhatsApp
 */

class WhatsAppOrderSender {
  static formatCurrency(value) {
    return Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  static generateOrderCode() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `FARMA-${code}`;
  }

  static buildMessage(orderData) {
    const storeConfig = StoreDB.getStoreConfig();
    const orderCode = orderData.orderCode || this.generateOrderCode();
    const now = new Date();
    const dateFormatted = orderData.date || now.toLocaleDateString("pt-BR");
    const timeFormatted = orderData.time || now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    let msg = `💊 *NOVO PEDIDO - ${storeConfig.name.toUpperCase()}*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📅 *Data/Hora:* ${dateFormatted} às ${timeFormatted}\n`;
    msg += `🆔 *Identificador:* #${orderCode}\n\n`;

    // Dados do Cliente
    msg += `👤 *DADOS DO CLIENTE*\n`;
    msg += `• *Nome:* ${orderData.customerName}\n`;
    msg += `• *Contato/WhatsApp:* ${orderData.customerPhone}\n\n`;

    // Modalidade e Endereço
    if (orderData.deliveryType === "delivery") {
      msg += `📍 *ENDEREÇO DE ENTREGA (DELIVERY)*\n`;
      msg += `• *Rua/Av:* ${orderData.street}, nº ${orderData.number}\n`;
      if (orderData.complement) {
        msg += `• *Complemento:* ${orderData.complement}\n`;
      }
      msg += `• *Bairro:* ${orderData.neighborhood} - ${orderData.city || storeConfig.city}/${orderData.state || storeConfig.state}\n`;
      if (orderData.cep) {
        msg += `• *CEP:* ${orderData.cep}\n`;
      }
      // Ponto de Referência Destacado
      msg += `• 📌 *PONTO DE REFERÊNCIA:* ${orderData.referencePoint}\n\n`;
    } else {
      msg += `🏪 *MODALIDADE:* Retirada no Balcão da Farmácia\n`;
      msg += `• *Local:* ${storeConfig.address}\n\n`;
    }

    // Itens
    msg += `📦 *ITENS DO PEDIDO*\n`;
    msg += `────────────────────────────\n`;
    orderData.items.forEach(item => {
      const itemSubtotal = item.price * item.qty;
      const prescriptionTag = item.requiresPrescription ? " [Exige Receita]" : "";
      msg += `• ${item.qty}x ${item.name}${prescriptionTag}\n`;
      msg += `  ${item.presentation} | ${this.formatCurrency(itemSubtotal)}\n`;
    });
    msg += `────────────────────────────\n`;

    // Valores
    msg += `• *Subtotal:* ${this.formatCurrency(orderData.subtotal)}\n`;
    if (orderData.deliveryType === "delivery") {
      msg += `• *Taxa de Entrega:* ${this.formatCurrency(orderData.deliveryFee)} (${orderData.neighborhood})\n`;
    } else {
      msg += `• *Taxa de Entrega:* Grátis (Retirada)\n`;
    }
    msg += `• 💰 *VALOR TOTAL: ${this.formatCurrency(orderData.total)}*\n\n`;

    // Pagamento
    msg += `💳 *FORMA DE PAGAMENTO*\n`;
    if (orderData.paymentMethod === "pix") {
      msg += `• *Método:* Pix Online (QR Code / Copia e Cola)\n`;
      msg += `• *Chave Pix:* ${storeConfig.pixKey} (${storeConfig.pixKeyType})\n`;
      msg += `• *Beneficiário:* ${storeConfig.pixBeneficiary}\n`;
      msg += `• *Status:* Aguardando envio do comprovante\n`;
    } else if (orderData.paymentMethod === "link") {
      msg += `• *Método:* Link de Pagamento com Cartão Online\n`;
      msg += `• *Link:* ${storeConfig.paymentLinkUrl}\n`;
    } else if (orderData.paymentMethod === "money") {
      msg += `• *Método:* Dinheiro na Entrega\n`;
      if (orderData.needChange && orderData.changeFor) {
        msg += `• *Troco solicitado para:* ${this.formatCurrency(orderData.changeFor)}\n`;
        const changeAmount = Number(orderData.changeFor) - Number(orderData.total);
        if (changeAmount > 0) {
          msg += `• *Valor do troco a levar:* ${this.formatCurrency(changeAmount)}\n`;
        }
      } else {
        msg += `• *Troco:* Não precisa de troco (valor exato)\n`;
      }
    } else if (orderData.paymentMethod === "card_delivery") {
      msg += `• *Método:* Cartão na Entrega (Levar Maquininha)\n`;
      msg += `• *Bandeira/Tipo:* ${orderData.cardType || "Débito / Crédito"}\n`;
    }
    msg += `\n`;

    // Aviso de Receita Médica
    if (orderData.hasPrescriptionItems) {
      msg += `⚠️ *ATENÇÃO: RECEITA MÉDICA OBRIGATÓRIA*\n`;
      msg += `Este pedido contém medicamentos que exigem retenção de receita médica.\n`;
      msg += `👉 *Por favor, envie a foto da sua receita médica logo abaixo aqui no WhatsApp para validação do farmacêutico.*\n\n`;
    }

    // Observações
    if (orderData.notes && orderData.notes.trim()) {
      msg += `📝 *OBSERVAÇÕES DO CLIENTE:*\n`;
      msg += `"${orderData.notes.trim()}"\n\n`;
    }

    msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `Aguardando a confirmação da farmácia para separação e envio! 🛵💨`;

    return msg;
  }

  static sendOrder(orderData) {
    const storeConfig = StoreDB.getStoreConfig();
    const message = this.buildMessage(orderData);
    const encodedMessage = encodeURIComponent(message);
    
    // Remove qualquer caractere não numérico do WhatsApp
    const cleanPhone = String(storeConfig.whatsapp).replace(/\D/g, "");
    
    // Monta deep link universal
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
    
    // Abre no navegador / app do WhatsApp
    window.open(whatsappUrl, "_blank");
  }
}
