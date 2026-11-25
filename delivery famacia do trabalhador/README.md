# 💊 Delivery Farmácia do Trabalhador - Versão Profissional

Sistema completo de **Cardápio e Delivery Online para Farmácia e Drogaria**, inspirado na agilidade e visual do `pedir.delivery`, permitindo que os clientes escolham seus medicamentos e produtos de saúde, montem a cesta, definam a forma de pagamento (Pix imediato, Link de pagamento ou Pagamento na Entrega com troco/maquininha) e enviem o pedido 100% pronto e formatado diretamente para o **WhatsApp da Farmácia**.

Conta também com um **Painel Administrativo (`admin.html`) Protegido por Senha**, com controle de estoque, indicação de medicamentos ("Para que serve"), edição completa de preços, personalização de logo e cores do tema, além do gerador e impressor de **comandas térmicas (58mm/80mm)** para motoboys e balcão.

---

## 🚀 Principais Funcionalidades

1. **Painel Administrativo Seguro com Login & Senha (`admin.html`)**:
   - **Barreira de Acesso**: Ninguém acessa o painel de gerenciamento sem autenticação.
   - **Credenciais Iniciais Padrão**: Usuário `admin` e Senha `admin123`.
   - **Troca de Senha**: O administrador pode alterar seu usuário e senha a qualquer momento dentro do painel.
   - **Botão de Logout (Sair)**: Encerramento de sessão seguro.

2. **Personalização da Farmácia (Logo e Cores da Página)**:
   - **Logo Personalizada**: Adicione a URL da sua logomarca oficial para ser exibida no cabeçalho do catálogo e no painel.
   - **Paleta de Cores Dinâmica**: Escolha qualquer cor ou selecione paletas prontas (Verde Saúde `#059669`, Azul Farmácia `#0284c7`, Vermelho Cruz Vermelha `#dc2626`, Roxo Bem-Estar `#7c3aed`, etc.). O site inteiro atualiza botões, cabeçalho e destaques instantaneamente.

3. **Gestão Completa de Medicamentos & Controle de Estoque**:
   - **"Para que serve" (Indicação Clínica)**: Campo em destaque em cada medicamento informando ao cliente para quais sintomas ou doenças ele é indicado.
   - **Controle de Quantidade em Estoque**: Defina quantas unidades tem para vender.
   - **Alerta de Estoque Baixo & Esgotado**: O catálogo mostra avisos automáticos e bloqueia a adição de itens com estoque zerado.
   - **Edição Rápida na Tabela**: Altere preços e estoque com 1 clique diretamente na linha do produto.
   - **Modal de Edição Completa**: Botão "Editar" que permite alterar nome, indicação, categoria, apresentação, laboratório, preço normal, preço promocional, estoque, selo, imagem e receita médica de qualquer produto.

4. **Impressão Térmica de Comandas (58mm e 80mm) (`comanda.html`)**:
   - Histórico de pedidos no painel com botão de **1 clique para Imprimir Comanda Térmica**.
   - Diagramação sob medida para bobinas de 58mm ou 80mm com layout de cupom fiscal organizado (dados do cliente, bairro, taxa, troco, ponto de referência e itens).

5. **Design Mobile-First e Responsivo**:
   - Desenvolvido para abrir instantaneamente no celular (4G/5G ou Wi-Fi) sem necessidade de instalar aplicativos de lojas.
   - Cabeçalho dinâmico com identificação da farmácia, tempo estimado de entrega e status aberto/fechado.

6. **Busca e Categorias Farmacêuticas**:
   - Barra de busca instantânea com filtro em tempo real (busca tanto por marca comercial como por princípio ativo, laboratório ou para que serve).
   - Categorias em abas deslizantes: *Medicamentos & Dor*, *Primeiros Socorros*, *Mamãe & Bebê*, *Higiene & Cuidados*, *Vitaminas & Imunidade* e *Dermocosméticos*.

7. **Alerta de Receita Médica (Medicamentos Controlados / Prescrição)**:
   - Produtos com retenção ou exigência de receita recebem uma etiqueta destacada e acionam um alerta automático solicitando o envio da foto da receita no WhatsApp.

8. **Checkout Completo e Inteligente**:
   - **Entrega ou Retirada**: Permite escolher entre receber em casa ou retirar no balcão da farmácia.
   - **Busca de CEP Automática**: Preenchimento automático de logradouro e bairro via API do ViaCEP.
   - **Taxa por Bairro**: Seleção de bairros com taxa de entrega somada automaticamente ao total.
   - **Ponto de Referência Obrigatório**: Campo em destaque essencial para os motoboys localizarem o cliente com agilidade.

9. **Opções de Pagamento Flexíveis**:
   - **Pix Online**: Exibe o QR Code dinâmico gerado na hora e botão de 1 clique para "Copiar Chave Pix", já com o valor total calculado.
   - **Link de Pagamento**: Botão direto para link do Mercado Pago, PagBank ou gateway online.
   - **Dinheiro na Entrega**: Opção de calcular troco automaticamente com campo *"Troco para quanto?"*.
   - **Cartão na Entrega**: Opção de indicar Débito, Crédito ou Convênio para o motoboy levar a maquininha adequada.

10. **Redirecionamento para o WhatsApp**:
    - Monta uma mensagem detalhada e organizada com emojis, itens, valores, dados de entrega, ponto de referência e alerta de receita, abrindo o WhatsApp da farmácia com 1 clique.

---

## 📁 Estrutura de Arquivos

```text
delivery famacia do trabalhador/
├── index.html           # Catálogo do cliente (busca, "para que serve", estoque e checkout)
├── admin.html           # Painel administrativo protegido por senha (produtos, cores, logo, Pix, taxas)
├── comanda.html         # Gerador e impressor de comanda térmica para motoboy
├── README.md            # Documentação e instruções de publicação
├── css/
│   └── styles.css       # Estilos CSS modernos, responsivos e variáveis dinâmicas de tema
└── js/
    ├── data.js          # Base de produtos, estoque, autenticação, tema e persistência LocalStorage
    ├── cart.js          # Gerenciamento de itens na cesta, validação de estoque máximo e subtotais
    ├── checkout.js      # Validações de endereço, cálculo de frete e formas de pagamento
    ├── whatsapp.js      # Formatador profissional de texto e deep-link do WhatsApp
    └── app.js           # Inicialização da interface, tema dinâmico, logo e renderização
```

---

## 🔒 Acesso ao Painel Administrativo

- **Arquivo**: `admin.html`
- **Usuário Inicial**: `admin`
- **Senha Inicial**: `admin123`
- Para alterar o usuário e a senha, acesse o painel e use a seção **"Segurança & Senha do Painel"**.

---

## 🌐 Como Atualizar seu Site Publicado (Netlify / Vercel / Drop)

Para atualizar o site que já está no ar com todas as novas funções:

1. Use o arquivo gerado: **`site-pronto-para-publicar.zip`**
2. Acesse sua conta no **[Netlify Drop](https://app.netlify.com/drop)** (ou o painel do seu site no Netlify)
3. Arraste o arquivo **`site-pronto-para-publicar.zip`** (ou a pasta descompactada) sobre a área de upload do Netlify.
4. Pronto! Em segundos o seu site público estará com:
   - Login e senha no painel
   - Controle de estoque e indicação dos remédios
   - Troca de cores e logo
   - Edição completa de qualquer produto
