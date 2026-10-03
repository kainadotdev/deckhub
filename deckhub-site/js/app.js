/* Núcleo: carrinho, cabeçalho, rodapé, gaveta do carrinho e utilidades. */
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const brl = n => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const SITE = { whatsapp: "5584999370883", instagram: "https://www.instagram.com/deckhub_tcg/", discord: "#", shipping: 19.9, email: "contato@deckhub.com.br", hours: "Seg a Sex, 9h às 18h" };
  const I = (d, s = 20) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const ICON = {
    cart: I('<path d="M3 4h2l2.5 12h10L20 8H6"/><circle cx="9" cy="20" r="1.2"/><circle cx="17" cy="20" r="1.2"/>', 22),
    search: I('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>', 16),
    menu: I('<path d="M4 7h16M4 12h16M4 17h16"/>', 24), close: I('<path d="M6 6l12 12M18 6L6 18"/>', 22),
    ig: I('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".8" fill="currentColor"/>', 18),
    wa: I('<path d="M3 21l1.6-4.6A8.5 8.5 0 1 1 8 19.6L3 21z"/><path d="M9 9.5c.5 2 2.5 4 5 5l1.2-1.2-1.8-1-.8.8c-.8-.4-1.6-1.2-2-2l.8-.8-1-1.8z"/>', 18),
    dc: I('<path d="M8 7c-1.5.3-2.7.8-3.7 1.5C2.5 11.5 2 14.7 2.3 17.8c1.3 1 2.7 1.6 4.2 2l1-1.8M16 7c1.5.3 2.7.8 3.7 1.5 1.8 3 2.3 6.2 2 9.3-1.3 1-2.7 1.6-4.2 2l-1-1.8M8 17c2.6.9 5.4.9 8 0"/><circle cx="9" cy="12.5" r="1"/><circle cx="15" cy="12.5" r="1"/>', 18),
    left: I('<path d="M15 5l-7 7 7 7"/>', 16), right: I('<path d="M9 5l7 7-7 7"/>', 16),
    copy: I('<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>'), check: I('<path d="M5 12l5 5 9-10"/>'),
    minus: I('<path d="M6 12h12"/>', 16), plus: I('<path d="M12 6v12M6 12h12"/>', 16),
    ok: I('<circle cx="12" cy="12" r="10"/><path d="M7 12.5l3.5 3.5L17 9"/>', 64)
  };
  const byId = id => PRODUCTS.find(p => p.id === id), bySlug = s => PRODUCTS.find(p => p.slug === s);
  const stk = s => s <= 0 ? { t: "Esgotado", c: "out" } : s <= 2 ? { t: "Poucas unidades", c: "low" } : { t: "Em Estoque", c: "ok" };
  const href = p => "produto/?slug=" + p.slug;

  /* ---- carrinho ---- */
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem("dh-cart") || "[]").filter(l => byId(l.id)); } catch (e) {}
  const lines = () => cart.map(l => ({ ...l, p: byId(l.id) }));
  const subtotal = () => lines().reduce((a, l) => a + l.qty * l.p.price, 0);
  const count = () => cart.reduce((a, l) => a + l.qty, 0);
  function save() { try { localStorage.setItem("dh-cart", JSON.stringify(cart)); } catch (e) {} refresh(); }
  function add(id, q = 1) { const p = byId(id), c = cart.find(l => l.id === id); if (c) c.qty = Math.min(c.qty + q, p.stock); else cart.push({ id, qty: Math.min(q, p.stock) }); save(); }
  function setQty(id, q) { const c = cart.find(l => l.id === id); if (c) { c.qty = Math.max(1, Math.min(q, byId(id).stock)); save(); } }
  function remove(id) { cart = cart.filter(l => l.id !== id); save(); }
  function clear() { cart = []; save(); }

  function cartRows() {
    const l = lines();
    if (!l.length) return '<p class="muted" style="text-align:center;padding:40px 0">Seu carrinho está vazio.</p>';
    return l.map(({ p, qty }) => `<div class="row"><div class="t"><img src="${p.image}" alt=""></div>
      <div><div class="nm">${p.name}</div><div class="sm">${brl(p.price)}</div>
      <div class="qty"><button data-act="dec" data-id="${p.id}" aria-label="Diminuir">${ICON.minus}</button><span>${qty}</span><button data-act="inc" data-id="${p.id}" aria-label="Aumentar">${ICON.plus}</button></div></div>
      <div style="text-align:right"><b>${brl(p.price * qty)}</b><br><button class="lk" data-act="rm" data-id="${p.id}">Remover</button></div></div>`).join("");
  }
  function card(p) {
    const s = stk(p.stock);
    return `<a class="card" href="${href(p)}"><div class="im"><img src="${p.image}" alt="${p.name}" loading="lazy"></div><div class="bd">
      <span class="tp">${p.isBooster ? "Booster" : "Carta"} · ${p.tcg}</span><span class="nm">${p.name}</span>${p.cardNumber ? `<span class="sm">${p.setCode} · ${p.cardNumber}</span>` : ""}
      <span class="av ${s.c}"><i></i>${s.t}</span><span class="pr">${brl(p.price)}</span><span class="vb">Ver produto</span></div></a>`;
  }
  function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("on"); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("on"), 2000); }
  function openDrawer(o = true) { $("#drawer").classList.toggle("open", o); $("#drawer-bg").classList.toggle("open", o); }
  function refresh() {
    const c = $("#cnt"); if (c) { c.textContent = count(); c.style.display = count() ? "grid" : "none"; }
    const db = $("#drawer-body"); if (db) db.innerHTML = cartRows();
    const df = $("#drawer-foot"); if (df) df.style.display = cart.length ? "block" : "none";
    const ds = $("#drawer-sub"); if (ds) ds.textContent = brl(subtotal());
    document.dispatchEvent(new CustomEvent("dh:cart"));
  }

  /* ---- layout comum ---- */
  function layout() {
    const page = document.body.dataset.page;
    const nav = [["Início", "index.html", "home"], ["Produtos", "produtos", "produtos"], ["Categorias", "produtos?tipo=carta", ""]];
    $("#site-header").outerHTML = `<header class="top"><div class="wrap hd">
      <button class="ib mbtn" id="mbtn" aria-label="Menu">${ICON.menu}</button>
      <a href="index.html" class="logo"><img src="images/logo-icon.png" alt=""><span>DeckHub <b>TCG</b></span></a>
      <nav class="nav">${nav.map(n => `<a href="${n[1]}" class="${n[2] === page ? "on" : ""}">${n[0]}</a>`).join("")}</nav><div class="sp"></div>
      <form class="sb" action="produtos" method="get">${ICON.search}<input name="q" placeholder="Buscar produtos..." aria-label="Buscar"></form>
      <button class="ib" id="cbtn" aria-label="Carrinho">${ICON.cart}<span class="cnt" id="cnt">0</span></button></div>
      <div class="mnav" id="mnav"><form class="sb" action="produtos" method="get" style="display:flex;width:100%">${ICON.search}<input name="q" placeholder="Buscar produtos..."></form>
      ${nav.map(n => `<a href="${n[1]}">${n[0]}</a>`).join("")}</div></header>`;
    const inst = [["Sobre a DeckHub", "sobre"], ["Como Comprar", "como-comprar"], ["Envio e Frete", "frete"], ["Trocas e Devoluções", "trocas"], ["Termos & Condições", "termos"], ["Política de Privacidade", "privacidade"]];
    const games = [["Pokémon TCG", 1], ["Magic: The Gathering"], ["One Piece Card Game"], ["Disney Lorcana"], ["Yu-Gi-Oh!"], ["Outros TCGs", 0, 1]];
    const wa = `https://wa.me/${SITE.whatsapp}`;
    $("#site-footer").outerHTML = `<footer class="ft"><div class="wrap"><div class="ftg">
      <div class="fb"><a href="index.html" class="logo"><img src="images/logo-icon.png" alt=""><span>DeckHub <b>TCG</b></span></a>
        <p>Seu Hub de TCG. A melhor experiência em boosters, cartas avulsas e acessórios.</p>
        <div class="soc"><a href="${SITE.instagram}" aria-label="Instagram">${ICON.ig}</a><a href="${wa}" aria-label="WhatsApp">${ICON.wa}</a><a href="${SITE.discord}" aria-label="Discord">${ICON.dc}</a></div></div>
      <div class="fc"><h4>Institucional<span>+</span></h4><div class="fcb"><ul>${inst.map(i => `<li><a href="institucional/index.html?p=${i[1]}">${i[0]}</a></li>`).join("")}</ul></div></div>
      <div class="fc"><h4>Card Games<span>+</span></h4><div class="fcb"><ul class="gm">${games.map(g => `<li class="${g[1] ? "on" : ""}">${g[1] ? `<a href="produtos">${g[0]}</a>` : g[0]}${!g[1] && !g[2] ? " " : ""}</li>`).join("")}</ul></div></div>
      <div class="fc"><h4>Atendimento<span>+</span></h4><div class="fcb"><div class="wbox"><p>Precisa de ajuda com seu pedido?</p><a class="btn y" style="padding:9px 14px;font-size:14px" href="${wa}" target="_blank" rel="noopener">${ICON.wa} Falar no WhatsApp</a></div>
        <div class="fi"><span>${SITE.hours}</span><span>${SITE.email}</span></div></div></div></div>
      <div class="sub"><p>DeckHub TCG © ${new Date().getFullYear()}.</p>
      <p class="lg">Pokémon é marca registrada da Nintendo / Creatures Inc. / GAME FREAK inc. Magic: The Gathering é marca registrada da Wizards of the Coast LLC. Todas as marcas e imagens são de propriedade de seus respectivos donos.</p></div></div></footer>
      <a class="wa" href="${wa}" target="_blank" rel="noopener">Precisa de ajuda? Fale com a DeckHub</a>
      <div class="drawer-bg" id="drawer-bg"></div>
      <aside class="drawer" id="drawer" aria-label="Carrinho"><div class="dh"><h2>Seu carrinho</h2><button id="dclose" aria-label="Fechar">${ICON.close}</button></div>
      <div class="db" id="drawer-body"></div><div class="df" id="drawer-foot"><div class="ln"><span>Subtotal</span><span id="drawer-sub"></span></div>
      <div class="ln muted"><span>Entrega</span><span>Calculada no checkout</span></div><a class="btn p w" style="margin-top:12px" href="checkout/index.html">Finalizar compra</a>
      <a class="btn s w" style="margin-top:8px" href="carrinho/index.html">Ver carrinho</a></div></aside><div class="toast" id="toast"></div>`;
    $("#mbtn").onclick = () => $("#mnav").classList.toggle("open");
    $("#cbtn").onclick = () => openDrawer(true); $("#dclose").onclick = $("#drawer-bg").onclick = () => openDrawer(false);
    $$(".fc h4").forEach(h => h.onclick = () => h.parentElement.classList.toggle("open"));
    document.addEventListener("click", e => {
      const b = e.target.closest("[data-act]"); if (!b) return; const id = b.dataset.id, c = cart.find(l => l.id === id);
      if (b.dataset.act === "inc") setQty(id, c.qty + 1); else if (b.dataset.act === "dec") setQty(id, c.qty - 1); else if (b.dataset.act === "rm") remove(id);
    });
    $$("#helpwa,#wa2").forEach(a => a.href = wa);
    refresh();
  }
  window.DH = { $, $$, brl, SITE, ICON, byId, bySlug, stk, href, add, setQty, remove, clear, lines, subtotal, count, cartRows, card, toast, openDrawer };
  document.addEventListener("DOMContentLoaded", layout);
})();
