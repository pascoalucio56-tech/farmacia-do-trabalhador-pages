/**
 * Delivery Farmácia do Trabalhador - Dados e Configurações Iniciais
 * Sincronizado automaticamente com o LocalStorage para permitir edição via admin.html
 */

const DEFAULT_STORE_CONFIG = {
  name: "Farmácia do Trabalhador",
  slogan: "Sua saúde em primeiro lugar com o menor preço",
  whatsapp: "5581999998888", // Formato internacional sem caracteres especiais (Ex: 55 + DDD + Número)
  phoneDisplay: "(81) 99999-8888",
  address: "Av. Principal, 1500 - Centro",
  city: "Recife",
  state: "PE",
  openingHours: "Segunda a Sábado: 07:00 às 22:00 | Domingo: 08:00 às 18:00",
  isOpen: true,
  minOrderValue: 15.00,
  defaultDeliveryFee: 5.00,
  deliveryTimeEstimate: "30 a 50 min",
  pixKey: "farmaciadotrabalhador@email.com",
  pixKeyType: "E-mail",
  pixBeneficiary: "Farmácia do Trabalhador Ltda",
  paymentLinkUrl: "https://link.mercadopago.com.br/farmaciadotrabalhador",
  // Novas configurações de personalização e segurança
  logoUrl: "", // URL da logo personalizada (ou vazio para o ícone padrão)
  themeColor: "#059669", // Cor principal padrão (Verde Farmácia)
  adminUsername: "admin", // Login do administrador
  adminPassword: "admin123" // Senha do administrador (alterável pelo painel)
};

const DEFAULT_NEIGHBORHOODS = [
  { id: 1, name: "Centro", fee: 4.00, time: "25-35 min" },
  { id: 2, name: "Boa Viagem", fee: 6.00, time: "30-45 min" },
  { id: 3, name: "Madalena", fee: 5.00, time: "30-40 min" },
  { id: 4, name: "Espinheiro", fee: 5.50, time: "30-45 min" },
  { id: 5, name: "Graças", fee: 5.50, time: "30-45 min" },
  { id: 6, name: "Casa Forte", fee: 7.00, time: "35-50 min" },
  { id: 7, name: "Afogados", fee: 5.00, time: "30-40 min" },
  { id: 8, name: "Imbiribeira", fee: 6.00, time: "30-45 min" },
  { id: 9, name: "Cordeiro", fee: 6.50, time: "35-50 min" },
  { id: 10, name: "Várzea", fee: 8.00, time: "40-60 min" }
];

const DEFAULT_CATEGORIES = [
  { id: "all", name: "Todos os Itens", icon: "fas fa-th-large" },
  { id: "medicamentos", name: "Medicamentos & Dor", icon: "fas fa-pills" },
  { id: "primeiros_socorros", name: "Primeiros Socorros", icon: "fas fa-kit-medical" },
  { id: "mamae_bebe", name: "Mamãe & Bebê", icon: "fas fa-baby" },
  { id: "higiene", name: "Higiene & Cuidados", icon: "fas fa-pump-soap" },
  { id: "vitaminas", name: "Vitaminas & Imunidade", icon: "fas fa-apple-whole" },
  { id: "dermocosmeticos", name: "Dermocosméticos", icon: "fas fa-spa" }
];

const DEFAULT_PRODUCTS = [
  // Medicamentos & Dor
  {
    id: 1,
    name: "Dipirona Monoidratada 500mg",
    category: "medicamentos",
    indication: "Alívio rápido de dores de cabeça, dores no corpo e febre.",
    description: "Gotas 20ml ou 10 Comprimidos. Indicado como analgésico e antitérmico para dores e febre.",
    presentation: "Caixa com 10 comprimidos",
    laboratory: "Medley / Prati",
    price: 4.90,
    oldPrice: 7.50,
    stockQuantity: 45,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&auto=format&fit=crop&q=80",
    badge: "Mais Vendido",
    requiresPrescription: false,
    available: true
  },
  {
    id: 2,
    name: "Paracetamol 750mg",
    category: "medicamentos",
    indication: "Dores leves a moderadas, dores musculares, dor de dente e febre.",
    description: "Alívio rápido de dores de cabeça, dores musculares e redução da febre.",
    presentation: "Blister com 10 comprimidos",
    laboratory: "EMS",
    price: 6.80,
    oldPrice: 9.90,
    stockQuantity: 30,
    image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500&auto=format&fit=crop&q=80",
    badge: "Oferta",
    requiresPrescription: false,
    available: true
  },
  {
    id: 3,
    name: "Dorflex Relaxante Muscular",
    category: "medicamentos",
    indication: "Contraturas musculares dolorosas, torcicolos, dor nas costas e tensão.",
    description: "Alívio de dores associadas a contraturas musculares e dores tensionais.",
    presentation: "Cartela com 10 comprimidos",
    laboratory: "Sanofi",
    price: 9.90,
    oldPrice: 13.90,
    stockQuantity: 25,
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500&auto=format&fit=crop&q=80",
    badge: "Popular",
    requiresPrescription: false,
    available: true
  },
  {
    id: 4,
    name: "Ibuprofeno 600mg",
    category: "medicamentos",
    indication: "Inflamações articulares, dor de garganta, dores pós-traumáticas e febre.",
    description: "Anti-inflamatório, analgésico e antitérmico potente para alívio de inflamações.",
    presentation: "Caixa com 10 comprimidos",
    laboratory: "Eurofarma",
    price: 8.50,
    oldPrice: 12.00,
    stockQuantity: 20,
    image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=500&auto=format&fit=crop&q=80",
    badge: "",
    requiresPrescription: false,
    available: true
  },
  {
    id: 5,
    name: "Amoxicilina 500mg (Antibiótico)",
    category: "medicamentos",
    indication: "Infecções bacterianas das vias aéreas, respiratórias, urinárias e pele.",
    description: "Antibiótico de amplo espectro. Exige retenção de receita médica na entrega.",
    presentation: "Caixa com 21 cápsulas",
    laboratory: "EMS Genéricos",
    price: 24.90,
    oldPrice: 32.00,
    stockQuantity: 12,
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500&auto=format&fit=crop&q=80",
    badge: "Exige Receita",
    requiresPrescription: true,
    available: true
  },
  {
    id: 6,
    name: "Loratadina 10mg Antialérgico",
    category: "medicamentos",
    indication: "Rinite alérgica, espirros frequentes, coriza, coceira nos olhos e urticária.",
    description: "Alívio dos sintomas de rinite alérgica, espirros, coriza e coceiras.",
    presentation: "Caixa com 12 comprimidos",
    laboratory: "Neo Química",
    price: 7.90,
    oldPrice: 11.50,
    stockQuantity: 18,
    image: "https://images.unsplash.com/photo-1577401239170-897942555fb3?w=500&auto=format&fit=crop&q=80",
    badge: "",
    requiresPrescription: false,
    available: true
  },

  // Primeiros Socorros
  {
    id: 7,
    name: "Curativos Band-Aid Antisséptico",
    category: "primeiros_socorros",
    indication: "Proteção de pequenos cortes, arranhões e ferimentos com ação antisséptica.",
    description: "Proteção respirável contra sujeira e germes com almofada que não gruda no ferimento.",
    presentation: "Caixa com 16 unidades",
    laboratory: "Johnson & Johnson",
    price: 6.50,
    oldPrice: 8.90,
    stockQuantity: 40,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&auto=format&fit=crop&q=80",
    badge: "Essencial",
    requiresPrescription: false,
    available: true
  },
  {
    id: 8,
    name: "Álcool 70% Antisséptico 1 Litro",
    category: "primeiros_socorros",
    indication: "Desinfecção de mãos, superfícies e eliminação de germes e vírus.",
    description: "Álcool etílico hidratado 70° INPM líquido para higienização e assepsia.",
    presentation: "Frasco 1 Litro",
    laboratory: "Farmax",
    price: 8.90,
    oldPrice: 11.90,
    stockQuantity: 35,
    image: "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=500&auto=format&fit=crop&q=80",
    badge: "",
    requiresPrescription: false,
    available: true
  },
  {
    id: 9,
    name: "Gaze Estéril 7,5cm x 7,5cm",
    category: "primeiros_socorros",
    indication: "Curativos estéreis, limpeza de machucados e absorção de secreções.",
    description: "Compressa de gaze hidrófila esterilizada, 100% algodão para curativos limpos.",
    presentation: "Pacote com 10 unidades",
    laboratory: "Cremer",
    price: 3.50,
    oldPrice: 5.00,
    stockQuantity: 50,
    image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&auto=format&fit=crop&q=80",
    badge: "",
    requiresPrescription: false,
    available: true
  },
  {
    id: 10,
    name: "Termômetro Digital G-Tech",
    category: "primeiros_socorros",
    indication: "Medição de temperatura corporal rápida e segura para crianças e adultos.",
    description: "Medição de temperatura corporal precisa com display digital e alarme sonoro.",
    presentation: "1 Unidade com bateria inclusa",
    laboratory: "G-Tech",
    price: 19.90,
    oldPrice: 28.00,
    stockQuantity: 15,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80",
    badge: "Destaque",
    requiresPrescription: false,
    available: true
  },

  // Mamãe & Bebê
  {
    id: 11,
    name: "Fralda Pampers Confort Sec Tamanho G",
    category: "mamae_bebe",
    indication: "Higiene e proteção noturna prolongada antivazamento para bebês de 9 a 13kg.",
    description: "Canais de ar que deixam a pele sequinha a noite inteira. Com proteção antivazamento.",
    presentation: "Pacote Hiper com 32 tiras",
    laboratory: "Pampers / P&G",
    price: 49.90,
    oldPrice: 62.00,
    stockQuantity: 22,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&auto=format&fit=crop&q=80",
    badge: "Super Preço",
    requiresPrescription: false,
    available: true
  },
  {
    id: 12,
    name: "Lenços Umedecidos Huggies Tripla Proteção",
    category: "mamae_bebe",
    indication: "Limpeza suave e hidratação da pele delicada do bebê a cada troca.",
    description: "Com extratos naturais, sem álcool etílico e hipoalergênicos.",
    presentation: "Embalagem com 48 toalhinhas",
    laboratory: "Huggies",
    price: 9.90,
    oldPrice: 14.50,
    stockQuantity: 28,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80",
    badge: "Oferta",
    requiresPrescription: false,
    available: true
  },
  {
    id: 13,
    name: "Pomada para Assaduras Hipoglós Amêndoas",
    category: "mamae_bebe",
    indication: "Prevenção e tratamento imediato de assaduras e irritações da pele infantil.",
    description: "Barreira protetora reforçada com óleo de amêndoas e vitaminas A e E.",
    presentation: "Bisnaga com 40g",
    laboratory: "Sanofi",
    price: 18.90,
    oldPrice: 24.50,
    stockQuantity: 19,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80",
    badge: "",
    requiresPrescription: false,
    available: true
  },

  // Higiene & Cuidados
  {
    id: 14,
    name: "Desodorante Antitranspirante Rexona Clinical Men",
    category: "higiene",
    indication: "Controle da transpiração excessiva e mau odor por até 96 horas.",
    description: "3x mais proteção contra o suor e odores. Tecnologia de controle absoluto.",
    presentation: "Roll-on 50ml ou Stick 48g",
    laboratory: "Unilever",
    price: 22.90,
    oldPrice: 28.90,
    stockQuantity: 16,
    image: "https://images.unsplash.com/photo-1594913785162-e678a0c23cc9?w=500&auto=format&fit=crop&q=80",
    badge: "",
    requiresPrescription: false,
    available: true
  },
  {
    id: 15,
    name: "Creme Dental Colgate Total 12 Clean Mint",
    category: "higiene",
    indication: "Proteção antibacteriana bucal, prevenção de cáries, gengivite e tártaro.",
    description: "Proteção antibacteriana completa por até 12 horas. Previne cáries e placa bacteriana.",
    presentation: "Tubo Econômico 90g",
    laboratory: "Colgate",
    price: 6.90,
    oldPrice: 9.50,
    stockQuantity: 32,
    image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=500&auto=format&fit=crop&q=80",
    badge: "",
    requiresPrescription: false,
    available: true
  },
  {
    id: 16,
    name: "Sabonete Líquido Darrow Actine 140ml",
    category: "higiene",
    indication: "Higienização facial profunda, combate à acne e desobstrução de poros oleosos.",
    description: "Limpeza profunda e controle de oleosidade para peles com tendência acneica.",
    presentation: "Frasco com 140ml",
    laboratory: "Darrow",
    price: 36.90,
    oldPrice: 45.00,
    stockQuantity: 14,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500&auto=format&fit=crop&q=80",
    badge: "Dermatológico",
    requiresPrescription: false,
    available: true
  },

  // Vitaminas & Imunidade
  {
    id: 17,
    name: "Vitamina C Efervescente Cebion 1g",
    category: "vitaminas",
    indication: "Fortalecimento do sistema imunológico, ação antioxidante e pós-gripes.",
    description: "Suplemento vitamínico de ácido ascórbico para reforço das defesas do organismo.",
    presentation: "Tubo com 10 comprimidos efervescentes sabor Laranja",
    laboratory: "P&G",
    price: 14.90,
    oldPrice: 19.90,
    stockQuantity: 26,
    image: "https://images.unsplash.com/photo-1616671285442-1e9d1bf7a83f?w=500&auto=format&fit=crop&q=80",
    badge: "Imunidade",
    requiresPrescription: false,
    available: true
  },
  {
    id: 18,
    name: "Vitamina D3 2.000 UI Addera D3",
    category: "vitaminas",
    indication: "Absorção de cálcio, saúde dos ossos, dentes e reforço de imunidade.",
    description: "Auxilia na absorção de cálcio e no fortalecimento ósseo e do sistema imune.",
    presentation: "Caixa com 30 comprimidos revestidos",
    laboratory: "Hypera Pharma",
    price: 39.90,
    oldPrice: 52.00,
    stockQuantity: 20,
    image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&auto=format&fit=crop&q=80",
    badge: "Recomendado",
    requiresPrescription: false,
    available: true
  },

  // Dermocosméticos
  {
    id: 19,
    name: "Protetor Solar Facial La Roche-Posay Anthelios FPS 60",
    category: "dermocosmeticos",
    indication: "Alta proteção contra raios solares UVA/UVB com toque seco antioleosidade.",
    description: "Alta proteção UVA/UVB com toque seco e controle de oleosidade ao longo do dia.",
    presentation: "Bisnaga com 40g sem cor",
    laboratory: "La Roche-Posay",
    price: 74.90,
    oldPrice: 94.90,
    stockQuantity: 11,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80",
    badge: "Premium",
    requiresPrescription: false,
    available: true
  },
  {
    id: 20,
    name: "Hidratante Labial Carmed Fini Beijos 10g",
    category: "dermocosmeticos",
    indication: "Hidratação intensa e alívio de lábios ressecados com cheirinho doce.",
    description: "Alto poder de hidratação labial com aroma e gostinho irresistível de Fini Beijos.",
    presentation: "Bisnaga com 10g",
    laboratory: "Cimed",
    price: 19.90,
    oldPrice: 25.00,
    stockQuantity: 35,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&auto=format&fit=crop&q=80",
    badge: "Sucesso!",
    requiresPrescription: false,
    available: true
  }
];

// Helper para obter e gerenciar dados com suporte a cache local
class StoreDB {
  static getStoreConfig() {
    const saved = localStorage.getItem("farmacia_store_config");
    let config = { ...DEFAULT_STORE_CONFIG };
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        config = { ...DEFAULT_STORE_CONFIG, ...parsed };
      } catch (e) {
        console.error("Erro ao carregar store_config:", e);
      }
    }
    return config;
  }

  static saveStoreConfig(config) {
    const current = StoreDB.getStoreConfig();
    const merged = { ...current, ...config };
    localStorage.setItem("farmacia_store_config", JSON.stringify(merged));
  }

  static getNeighborhoods() {
    const saved = localStorage.getItem("farmacia_neighborhoods");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_NEIGHBORHOODS;
  }

  static saveNeighborhoods(neighborhoods) {
    localStorage.setItem("farmacia_neighborhoods", JSON.stringify(neighborhoods));
  }

  static _productsCache = null;
  static _dbPromise = null;

  static _openProductsDB() {
    if (StoreDB._dbPromise) return StoreDB._dbPromise;
    StoreDB._dbPromise = new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error("IndexedDB não suportado"));
        return;
      }
      const req = indexedDB.open("FarmaciaCatalogoDB", 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("catalog")) {
          db.createObjectStore("catalog");
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return StoreDB._dbPromise;
  }

  static _normalizeProduct(p) {
    return {
      ...p,
      stockQuantity: p.stockQuantity !== undefined ? Number(p.stockQuantity) : 20,
      indication: p.indication || p.description || ""
    };
  }

  /**
   * Inicializa o catálogo via IndexedDB (suporta 20.000+ itens sem limite de 5MB do localStorage)
   */
  static async initProducts() {
    if (StoreDB._productsCache !== null) return StoreDB._productsCache;

    try {
      const db = await StoreDB._openProductsDB();
      const stored = await new Promise((resolve, reject) => {
        const tx = db.transaction("catalog", "readonly");
        const store = tx.objectStore("catalog");
        const req = store.get("products");
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });

      if (Array.isArray(stored) && stored.length > 0) {
        StoreDB._productsCache = stored.map(StoreDB._normalizeProduct);
        return StoreDB._productsCache;
      }
    } catch (e) {
      console.warn("Fallback para localStorage ao inicializar produtos:", e);
    }

    // Migração automática do localStorage para o IndexedDB
    const saved = localStorage.getItem("farmacia_products");
    let products = DEFAULT_PRODUCTS;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) products = parsed;
      } catch (e) {
        console.error(e);
      }
    }

    StoreDB._productsCache = products.map(StoreDB._normalizeProduct);
    await StoreDB.saveProducts(StoreDB._productsCache);
    return StoreDB._productsCache;
  }

  static getProducts() {
    if (StoreDB._productsCache !== null) {
      return StoreDB._productsCache;
    }

    const saved = localStorage.getItem("farmacia_products");
    let products = DEFAULT_PRODUCTS;
    if (saved) {
      try { products = JSON.parse(saved); } catch (e) { console.error(e); }
    }
    StoreDB._productsCache = products.map(StoreDB._normalizeProduct);
    return StoreDB._productsCache;
  }

  static async saveProducts(products) {
    const normalized = products.map(StoreDB._normalizeProduct);
    StoreDB._productsCache = normalized;

    try {
      const db = await StoreDB._openProductsDB();
      await new Promise((resolve, reject) => {
        const tx = db.transaction("catalog", "readwrite");
        const store = tx.objectStore("catalog");
        const req = store.put(normalized, "products");
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
      // Remove do localStorage para não estourar a cota de 5MB com catálogos grandes
      localStorage.removeItem("farmacia_products");
    } catch (e) {
      console.warn("Erro ao salvar no IndexedDB, tentando localStorage:", e);
      try {
        localStorage.setItem("farmacia_products", JSON.stringify(normalized));
      } catch (lsErr) {
        console.error("Limite de armazenamento atingido:", lsErr);
      }
    }
  }

  static getCategories() {
    return DEFAULT_CATEGORIES;
  }

  static verifyAdmin(user, pass) {
    const config = StoreDB.getStoreConfig();
    const expectedUser = (config.adminUsername || "admin").trim();
    const expectedPass = (config.adminPassword || "admin123").trim();
    return user.trim() === expectedUser && pass.trim() === expectedPass;
  }

  static updateAdminCredentials(newUsername, newPassword) {
    const config = StoreDB.getStoreConfig();
    if (newUsername && newUsername.trim()) {
      config.adminUsername = newUsername.trim();
    }
    if (newPassword && newPassword.trim()) {
      config.adminPassword = newPassword.trim();
    }
    StoreDB.saveStoreConfig(config);
  }

  /**
   * Aplica a cor primária dinâmica no documento (CSS Variables e meta tag)
   */
  static applyTheme(hexColor) {
    if (!hexColor || !/^#[0-9A-Fa-f]{6}$/.test(hexColor)) {
      hexColor = "#059669";
    }

    // Converte hex para RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);

    // Cor hover ligeiramente mais escura (20% escurecimento)
    const hr = Math.max(0, Math.floor(r * 0.8));
    const hg = Math.max(0, Math.floor(g * 0.8));
    const hb = Math.max(0, Math.floor(b * 0.8));
    const hoverHex = `#${hr.toString(16).padStart(2, '0')}${hg.toString(16).padStart(2, '0')}${hb.toString(16).padStart(2, '0')}`;

    // Cor clara de fundo com opacidade
    const lightBg = `rgba(${r}, ${g}, ${b}, 0.08)`;

    const root = document.documentElement;
    root.style.setProperty("--primary", hexColor);
    root.style.setProperty("--primary-hover", hoverHex);
    root.style.setProperty("--primary-light", lightBg);
    root.style.setProperty("--primary-rgb", `${r}, ${g}, ${b}`);
    root.style.setProperty("--border-focus", hexColor);

    // Atualiza a meta tag de cor para barra de navegação no celular
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", hexColor);
    }
  }

  static async resetToDefaults() {
    localStorage.removeItem("farmacia_store_config");
    localStorage.removeItem("farmacia_neighborhoods");
    localStorage.removeItem("farmacia_products");
    StoreDB._productsCache = null;
    try {
      const db = await StoreDB._openProductsDB();
      await new Promise((resolve) => {
        const tx = db.transaction("catalog", "readwrite");
        tx.objectStore("catalog").delete("products");
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch (e) {
      console.warn("Erro ao limpar IndexedDB:", e);
    }
  }
}
