/* Catálogo da loja. Para adicionar um produto: coloque a imagem em /images e crie um item aqui.
   "character" agrupa edições da mesma carta (usado em "Outras Edições"). */
const PRODUCTS = [
  { id:"booster-megaevolucao-gardevoir", slug:"booster-megaevolucao-gardevoir", name:"Booster Megaevolução — Gardevoir", setCode:"MEG", price:24.9, stock:30,
    image:"images/boosters/megaevolucao-gardevoir.webp", category:"Boosters", tcg:"Pokémon TCG", isBooster:true, language:"Português", featured:true,
    description:"Booster da coleção Megaevolução (Estampas Ilustradas) com arte Gardevoir. 6 cartas de jogo adicionais por pacote." },
  { id:"booster-megaevolucao-lucario", slug:"booster-megaevolucao-lucario", name:"Booster Megaevolução — Lucario", setCode:"MEG", price:24.9, stock:30,
    image:"images/boosters/megaevolucao-lucario.webp", category:"Boosters", tcg:"Pokémon TCG", isBooster:true, language:"Português", featured:true,
    description:"Booster da coleção Megaevolução (Estampas Ilustradas) com arte Lucario. 6 cartas de jogo adicionais por pacote." },
  { id:"mega-greninja-ex", slug:"mega-greninja-ex", name:"Mega Greninja ex", setCode:"SN54", cardNumber:"022/086", price:39.9, stock:3,
    image:"images/cards/mega-greninja-ex.png", category:"Cartas Individuais", tcg:"Pokémon TCG", character:"Greninja", condition:"Near Mint", language:"Português", featured:true,
    description:"Mega Greninja ex, Estágio 2, 350 PS, tipo Água. Habilidade Estrela Ninja Mortal e ataque Giro Ninja." },
  { id:"eevee-ex", slug:"eevee-ex", name:"Eevee ex", setCode:"PRE", cardNumber:"075/131", price:89.9, stock:1,
    image:"images/cards/eevee-ex.png", category:"Cartas Individuais", tcg:"Pokémon TCG", character:"Eevee", condition:"Near Mint", language:"Português", featured:true,
    description:"Eevee ex Tera, Básico, 200 PS, tipo Normal. Habilidade DNA Arco-íris e ataque Quartzo Cintilante." },
  { id:"alakazam-ex", slug:"alakazam-ex", name:"Alakazam ex", setCode:"MEW", cardNumber:"065/165", price:29.9, stock:14,
    image:"images/cards/alakazam-ex.png", category:"Cartas Individuais", tcg:"Pokémon TCG", character:"Alakazam", condition:"Near Mint", language:"Português",
    description:"Alakazam ex, Estágio 2, 310 PS, tipo Psíquico. Ataques Tomada Mental e Mão Dimensional." },
  { id:"greninja-radiante", slug:"greninja-radiante-swsh10-046", name:"Greninja Radiante", setCode:"SWSH10", cardNumber:"046/189", price:44.9, stock:4,
    image:"images/cards/greninja-radiante.png", category:"Cartas Individuais", tcg:"Pokémon TCG", character:"Greninja", condition:"Near Mint", language:"Português",
    description:"Greninja Radiante, Básico, 130 PS, tipo Água. Habilidade Cartas na Manga e ataque Estrela Ninja do Luar." },
  { id:"greninja-ex-promo", slug:"greninja-ex-svp-054", name:"Greninja ex", setCode:"SVP", cardNumber:"054", price:59.9, stock:2,
    image:"images/cards/greninja-ex-promo.png", category:"Cartas Individuais", tcg:"Pokémon TCG", character:"Greninja", condition:"Near Mint", language:"Português",
    description:"Greninja ex (promo), Estágio 2, 300 PS, tipo Água. Ataques Estrela Ninja Furtiva e Talho Torrencial." },
  { id:"greninja-ex-full-art-en", slug:"greninja-ex-full-art-en", name:"Greninja ex (Full Art, inglês)", setCode:"—", price:19.9, stock:5,
    image:"images/cards/greninja-ex-full-art-en.jpg", category:"Cartas Individuais", tcg:"Pokémon TCG", character:"Greninja", condition:"Near Mint", language:"Inglês",
    description:"Greninja ex, Stage 2, 170 HP, tipo Água, em inglês." }
];
