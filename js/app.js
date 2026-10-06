/* Núcleo: carrinho, cabeçalho, rodapé, gaveta do carrinho e utilidades. */
document.documentElement.classList.add("js");
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const brl = n => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const SITE = { whatsapp: "5584999370883", instagram: "https://www.instagram.com/deckhub_tcg/", discord: "#", shipping: 19.9, email: "contato@deckhub.com.br", hours: "" };
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
  const CL = { topo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 614 604" fill="currentColor" aria-hidden="true"><path d="M613 247 L606 249 L603 255 L595 260 L592 269 L590 267 L586 268 L579 278 L570 283 L565 292 L543 308 L533 322 L501 349 L458 393 L457 397 L447 402 L437 413 L435 419 L432 422 L430 421 L415 435 L408 446 L398 453 L374 483 L365 488 L357 502 L352 504 L334 527 L328 531 L322 542 L310 554 L308 560 L304 561 L295 573 L283 594 L278 598 L277 603 L324 564 L339 546 L345 546 L346 542 L362 528 L364 523 L400 491 L402 486 L412 478 L415 471 L419 472 L468 421 L468 418 L482 403 L490 399 L500 385 L511 377 L517 366 L537 347 L539 341 L561 321 L585 288 L591 284 L598 270 L602 269 L613 258ZM613 41 L603 48 L606 56 L601 61 L575 73 L574 80 L548 101 L549 107 L546 111 L526 123 L523 128 L503 139 L500 145 L490 153 L494 158 L484 165 L485 169 L459 188 L441 197 L437 201 L437 209 L417 223 L411 237 L368 276 L363 289 L343 304 L343 312 L325 326 L317 336 L303 343 L296 361 L273 383 L273 390 L252 408 L249 416 L231 436 L230 439 L236 442 L235 446 L212 461 L192 482 L186 498 L169 517 L162 534 L191 515 L191 512 L186 510 L187 507 L213 492 L233 474 L248 464 L247 460 L266 449 L265 444 L270 437 L280 429 L297 421 L300 407 L321 392 L321 386 L326 381 L348 368 L360 353 L381 340 L386 335 L387 329 L401 317 L411 304 L439 288 L440 285 L434 283 L439 273 L460 254 L488 222 L524 191 L530 180 L546 171 L550 146 L570 131 L574 123 L605 94 L606 83 L613 78ZM500 0 L425 0 L417 10 L399 22 L382 44 L345 77 L345 83 L340 88 L320 100 L320 108 L303 123 L301 129 L294 136 L282 144 L282 149 L276 158 L253 179 L241 197 L221 214 L211 228 L193 245 L175 271 L138 312 L128 330 L92 367 L77 390 L59 406 L58 416 L22 453 L23 459 L17 470 L6 481 L0 491 L28 467 L29 462 L38 453 L69 432 L78 418 L95 407 L93 402 L127 376 L130 369 L145 360 L152 353 L151 349 L154 345 L180 326 L186 317 L223 283 L227 276 L239 269 L259 247 L279 232 L284 224 L328 178 L343 166 L356 150 L374 136 L390 120 L401 104 L435 73 L436 69 L457 44 L488 15ZM241 0 L179 0 L163 15 L165 21 L162 27 L129 65 L121 83 L94 112 L95 121 L93 126 L62 168 L56 182 L48 193 L54 199 L52 203 L25 230 L23 234 L25 243 L15 257 L11 267 L12 270 L48 229 L57 215 L78 197 L79 189 L90 180 L91 175 L117 153 L116 148 L129 135 L131 130 L155 108 L175 77 L190 64 L195 55 L214 35 L213 30Z"/></svg>`, base: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 468 718" fill="currentColor" aria-hidden="true"><path d="M467 245 L459 251 L456 260 L424 281 L421 288 L414 295 L394 309 L383 322 L375 326 L370 336 L348 347 L345 351 L346 356 L332 367 L323 379 L309 387 L303 398 L291 410 L269 427 L255 445 L238 457 L229 469 L207 488 L206 492 L145 554 L138 566 L95 605 L80 625 L67 634 L64 638 L64 644 L45 664 L24 680 L23 690 L0 717 L27 697 L41 681 L53 676 L74 662 L81 651 L100 640 L98 636 L133 612 L140 603 L155 596 L165 581 L193 563 L200 553 L209 548 L215 540 L232 530 L243 517 L252 513 L274 492 L297 477 L306 466 L354 423 L364 417 L376 403 L403 384 L433 352 L462 330 L467 324ZM467 0 L452 9 L425 35 L404 51 L388 69 L355 95 L314 138 L279 169 L277 176 L257 192 L242 211 L194 255 L196 263 L174 283 L157 302 L150 316 L121 344 L118 359 L83 400 L76 414 L68 423 L74 429 L72 433 L41 461 L42 471 L32 483 L25 499 L66 459 L76 445 L97 430 L98 423 L117 404 L136 391 L140 386 L140 382 L163 359 L181 346 L183 340 L204 315 L221 302 L224 296 L243 279 L245 269 L275 244 L279 233 L315 200 L317 194 L355 156 L356 151 L371 139 L372 133 L382 124 L384 118 L395 106 L399 96 L435 57 L448 36 L459 27 L461 19 L467 14Z"/></svg>`, esq: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 566 792" fill="currentColor" aria-hidden="true"><path d="M482 501 L459 524 L453 525 L450 531 L442 536 L439 545 L434 544 L426 554 L417 560 L410 570 L393 582 L371 607 L363 611 L357 619 L336 637 L302 675 L294 678 L284 690 L282 696 L276 698 L258 715 L255 722 L244 730 L243 734 L236 739 L222 758 L211 766 L208 773 L195 784 L191 791 L221 791 L235 779 L239 772 L247 768 L250 761 L260 753 L261 748 L268 747 L273 739 L304 709 L329 679 L335 677 L347 661 L358 653 L364 642 L385 622 L387 616 L393 613 L396 607 L407 599 L413 588 L433 563 L439 559 L444 548 L461 533ZM546 245 L522 265 L512 270 L510 275 L494 288 L496 291 L489 297 L487 302 L455 319 L450 324 L453 333 L443 340 L424 348 L420 358 L395 377 L397 382 L390 389 L349 416 L348 421 L338 427 L341 434 L332 441 L326 451 L306 464 L290 471 L285 476 L285 484 L265 498 L258 513 L215 552 L212 563 L190 580 L190 588 L147 624 L147 631 L144 636 L124 654 L120 660 L120 666 L100 683 L94 695 L78 712 L77 715 L81 716 L83 720 L59 737 L39 759 L32 776 L19 791 L39 791 L34 786 L37 782 L43 780 L91 744 L97 733 L113 725 L114 716 L143 697 L147 683 L165 671 L173 657 L194 645 L211 626 L233 611 L234 605 L247 594 L258 580 L275 572 L287 563 L286 560 L281 558 L287 548 L308 529 L338 495 L369 469 L377 456 L394 446 L395 427 L398 422 L420 405 L424 396 L451 371 L454 358 L483 337 L493 318 L496 303 L525 282 L528 268 L541 254ZM278 7 L251 29 L224 58 L211 68 L190 94 L153 128 L127 161 L89 199 L85 210 L66 227 L53 247 L41 258 L28 275 L9 293 L11 300 L0 312 L0 385 L24 351 L39 338 L43 330 L59 314 L60 305 L89 276 L94 263 L109 250 L115 239 L128 227 L129 221 L162 185 L164 178 L176 168 L179 159 L187 151 L191 141 L202 126 L203 120 L217 105 L236 79 L243 64 L258 47 L259 40 L266 31 L264 26ZM565 0 L561 1 L468 83 L442 109 L441 114 L436 119 L428 123 L398 151 L389 156 L384 167 L358 186 L355 193 L340 206 L340 209 L322 223 L316 234 L303 243 L296 253 L273 271 L272 278 L244 300 L232 317 L207 338 L204 344 L192 354 L192 359 L187 364 L167 377 L167 384 L149 401 L149 404 L130 420 L125 432 L94 462 L89 472 L64 494 L22 547 L0 569 L0 622 L25 604 L52 573 L67 563 L70 557 L87 544 L107 522 L126 508 L132 499 L148 485 L177 452 L185 447 L201 428 L222 411 L237 396 L239 390 L282 349 L301 324 L335 291 L348 275 L372 254 L378 237 L392 227 L405 213 L407 204 L438 179 L441 170 L454 157 L462 138 L472 130 L474 125 L499 99 L503 88 L527 65 L528 57 L537 47 L542 33 L560 14Z"/></svg>`, sim: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 382 521" fill="currentColor" fill-rule="evenodd" aria-hidden="true"><path d="M221 0 L221 327 L166 330 L166 416 L220 418 L222 521 L307 521 L381 450 L382 68 L313 0ZM0 0 L0 520 L141 521 L141 0Z"/></svg>` };
  const esc = v => String(v).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
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
    const s = stk(p.stock), tag = p.cardNumber ? `${p.setCode} · ${p.cardNumber}` : p.isBooster ? `Booster ${p.setCode}` : p.setCode;
    return `<article class="pc rv"><a class="pc-link" href="${href(p)}"><div class="im"><span class="id">${esc(tag)}</span><span class="cl" aria-hidden="true">${CL.topo}</span>
      <img src="${p.image}" alt="${esc(p.name)}" loading="lazy" width="330" height="460"><span class="v3">Ver em 3D ↻</span></div><div class="bd">
      <span class="tp">${p.isBooster ? "Booster" : "Carta"} · ${esc(p.tcg)}</span><span class="nm">${esc(p.name)}</span>
      <span class="av ${s.c}"><i></i>${s.t}</span><span class="pr">${brl(p.price)}</span></div></a>
      <button class="pc-add" data-add="${p.id}" aria-label="Adicionar ${esc(p.name)} ao carrinho" ${p.stock > 0 ? "" : "disabled"}>${ICON.plus}</button></article>`;
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
      <a href="index.html" class="logo" aria-label="DeckHub TCG — início"><img src="images/marca/logo-escuro1.webp" alt="DeckHub TCG" width="70" height="39"></a>
      <nav class="nav">${nav.map(n => `<a href="${n[1]}" class="${n[2] === page ? "on" : ""}">${n[0]}</a>`).join("")}</nav><div class="sp"></div>
      <form class="sb" action="produtos" method="get">${ICON.search}<input name="q" placeholder="Buscar produtos..." aria-label="Buscar"></form>
      <button class="ib" id="cbtn" aria-label="Carrinho">${ICON.cart}<span class="cnt" id="cnt">0</span></button></div>
      <div class="mnav" id="mnav"><form class="sb" action="produtos" method="get" style="display:flex;width:100%">${ICON.search}<input name="q" placeholder="Buscar produtos..."></form>
      ${nav.map(n => `<a href="${n[1]}">${n[0]}</a>`).join("")}</div></header>`;
    const inst = [["Sobre a DeckHub", "sobre"], ["Como Comprar", "como-comprar"], ["Envio e Frete", "frete"], ["Trocas e Devoluções", "trocas"], ["Termos & Condições", "termos"], ["Política de Privacidade", "privacidade"]];
    const games = [["Pokémon TCG", 1], ["Magic: The Gathering"], ["One Piece Card Game"], ["Disney Lorcana"], ["Yu-Gi-Oh!"], ["Outros TCGs", 0, 1]];
    const wa = `https://wa.me/${SITE.whatsapp}`;
    $("#site-footer").outerHTML = `<footer class="ft"><span class="cl" aria-hidden="true">${CL.base}</span><div class="wrap"><div class="ftg">
      <div class="fb"><a href="index.html" class="logo" aria-label="DeckHub TCG — início"><img src="images/marca/logo-escuro.webp" alt="DeckHub TCG" width="60" height="39"></a>
        <p>Seu Hub de TCG. A melhor experiência em boosters, cartas avulsas e acessórios.</p>
        <div class="soc"><a href="${SITE.instagram}" aria-label="Instagram">${ICON.ig}</a><a href="${wa}" aria-label="WhatsApp">${ICON.wa}</a><a href="${SITE.discord}" aria-label="Discord">${ICON.dc}</a></div></div>
      <div class="fc"><h4>Institucional<span>+</span></h4><div class="fcb"><ul>${inst.map(i => `<li><a href="institucional/index.html?p=${i[1]}">${i[0]}</a></li>`).join("")}</ul></div></div>
      <div class="fc"><h4>Card Games<span>+</span></h4><div class="fcb"><ul class="gm">${games.map(g => `<li class="${g[1] ? "on" : ""}">${g[1] ? `<a href="produtos">${g[0]}</a>` : g[0]}${!g[1] && !g[2] ? " " : ""}</li>`).join("")}</ul></div></div>
      <div class="fc"><h4>Atendimento<span>+</span></h4><div class="fcb"><div class="wbox"><p>Precisa de ajuda com seu pedido?</p><a class="btn y" style="padding:9px 14px;font-size:14px" href="${wa}" target="_blank" rel="noopener">${ICON.wa} Falar no WhatsApp</a></div>
        <div class="fi"><span>${SITE.hours}</span><span>${SITE.email}</span></div></div></div></div>
      <div class="sub"><p>DeckHub TCG © ${new Date().getFullYear()}.</p>
      <p class="lg">Pokémon é marca registrada da Nintendo / Creatures Inc. / GAME FREAK inc. Magic: The Gathering é marca registrada da Wizards of the Coast LLC. Todas as marcas e imagens são de propriedade de seus respectivos donos.</p></div></div></footer>
      <div class="wa-dock"><img class="wa-dragon" src="images/dragao/ajuda-flutuante.webp" alt="Dragão da DeckHub" width="640" height="430" decoding="async"><a class="wa" href="${wa}" target="_blank" rel="noopener">Precisa de ajuda? Fale com a DeckHub</a></div>
      <div class="drawer-bg" id="drawer-bg"></div>
      <aside class="drawer" id="drawer" aria-label="Carrinho"><div class="dh"><h2>Seu carrinho</h2><button id="dclose" aria-label="Fechar">${ICON.close}</button></div>
      <div class="db" id="drawer-body"></div><div class="df" id="drawer-foot"><div class="ln"><span>Subtotal</span><span id="drawer-sub"></span></div>
      <div class="ln muted"><span>Entrega</span><span>Calculada no checkout</span></div><a class="btn p w" style="margin-top:12px" href="checkout/index.html">Finalizar compra</a>
      <a class="btn s w" style="margin-top:8px" href="carrinho/index.html">Ver carrinho</a></div></aside><div class="toast" id="toast"></div>`;
    $("#mbtn").onclick = () => $("#mnav").classList.toggle("open");
    $("#cbtn").onclick = () => openDrawer(true); $("#dclose").onclick = $("#drawer-bg").onclick = () => openDrawer(false);
    $$(".fc h4").forEach(h => h.onclick = () => h.parentElement.classList.toggle("open"));
    document.addEventListener("click", e => {
      const a = e.target.closest("[data-add]"); if (a) { add(a.dataset.add, 1); toast("Adicionado ao carrinho"); return; }
      const b = e.target.closest("[data-act]"); if (!b) return; const id = b.dataset.id, c = cart.find(l => l.id === id);
      if (b.dataset.act === "inc") setQty(id, c.qty + 1); else if (b.dataset.act === "dec") setQty(id, c.qty - 1); else if (b.dataset.act === "rm") remove(id);
    });
    $$("#helpwa,#wa2").forEach(a => a.href = wa);
    refresh();
  }
  window.DH = { CL, esc, $, $$, brl, SITE, ICON, byId, bySlug, stk, href, add, setQty, remove, clear, lines, subtotal, count, cartRows, card, toast, openDrawer };
  document.addEventListener("DOMContentLoaded", layout);
})();
