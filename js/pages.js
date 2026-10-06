/* Lógica de cada página (escolhida por <body data-page="...">). */
document.addEventListener("DOMContentLoaded", () => {
  const { $, $$, brl, SITE, ICON, bySlug, stk, href, add, clear, lines, subtotal, cartRows, card, toast, openDrawer } = DH;
  const page = document.body.dataset.page, qs = new URLSearchParams(location.search);
  const P = {};

  P.home = () => { $("#featured").innerHTML = PRODUCTS.filter(p => p.featured).slice(0, 4).map(card).join(""); };

  P.produtos = () => {
    let tipo = qs.get("tipo") || "todos", sort = "rel"; const q = $("#q"); q.value = qs.get("q") || "";
    const draw = () => {
      const t = q.value.toLowerCase();
      const l = PRODUCTS.filter(p => (tipo === "todos" || (tipo === "booster") === !!p.isBooster) && `${p.name} ${p.setCode} ${p.tcg} ${p.character || ""}`.toLowerCase().includes(t));
      if (sort === "asc") l.sort((a, b) => a.price - b.price); if (sort === "desc") l.sort((a, b) => b.price - a.price); if (sort === "new") l.reverse();
      $("#count").textContent = l.length + (l.length === 1 ? " produto" : " produtos"); $("#pcl").innerHTML = DH.CL.topo;
      $("#grid").innerHTML = l.length ? l.map(card).join("") : '<p class="muted" style="grid-column:1/-1">Nenhum produto encontrado. Tente outra busca ou veja todos os produtos.</p>';
      $$(".chip").forEach(c => c.classList.toggle("on", c.dataset.t === tipo));
    };
    q.oninput = draw; $("#sort").onchange = e => { sort = e.target.value; draw(); };
    $$(".chip").forEach(c => c.onclick = () => { tipo = c.dataset.t; draw(); }); draw();
  };

  P.produto = () => {
    const p = bySlug(qs.get("slug") || "");
    if (!p) { $("#app").innerHTML = '<div class="wrap ctr"><h1>Produto não encontrado</h1><a class="btn p" href="produtos">Ver produtos</a></div>'; return; }
    const s = stk(p.stock);
    document.title = `${p.name} | DeckHub TCG`;
    $('meta[name="description"]').content = p.description;
    const specs = p.isBooster ? [["Condição", "Lacrado"], ["Idioma", p.language], ["Coleção", p.setCode]]
      : [["Condição", p.condition], ["Idioma", p.language], ["Coleção", p.setCode], ...(p.cardNumber ? [["Número", p.cardNumber]] : [])];
    const ld = document.createElement("script"); ld.type = "application/ld+json";
    ld.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description, image: new URL(p.image, document.baseURI).href, sku: p.id,
      brand: { "@type": "Brand", name: p.tcg }, offers: { "@type": "Offer", priceCurrency: "BRL", price: p.price.toFixed(2), availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: location.href } });
    document.head.appendChild(ld);
    // Outras edições: apenas produtos já cadastrados em PRODUCTS
    const same = p.character ? PRODUCTS.filter(x => x.id !== p.id && x.category === "Cartas Individuais" && x.character === p.character) : [];
    const items = same.length ? same : PRODUCTS.filter(x => x.id !== p.id && x.category === p.category).slice(0, 5);
    const eds = items.length ? `<section class="eds"><div class="wrap"><div class="sh"><div><h2>${same.length ? "Outras Edições de " + p.character : "Outros Produtos Relacionados"}</h2>
      <p>${same.length ? "Versões e variações desta mesma carta disponíveis em nosso catálogo." : "Confira outros itens disponíveis em nossa loja."}</p></div>
      <div class="ar"><button id="eprev" aria-label="Anterior">${ICON.left}</button><button id="enext" aria-label="Próximo">${ICON.right}</button></div></div>
      <div class="ect" id="ect">${items.map(card).join("")}</div></div></section>` : "";
    $("#app").innerHTML = `<div class="wrap"><nav class="crumb"><a href="index.html">Início</a> / <a href="produtos">Produtos</a> / ${p.name}</nav>
      <div class="pd"><div class="stage" id="stage" tabindex="0" role="group" aria-label="Visualizador 3D de ${p.name}. Arraste para girar."></div><div>
      <span class="tp">${p.isBooster ? "Booster" : p.category} · ${p.tcg}</span><h1>${p.name}</h1><div class="big">${brl(p.price)}</div>
      <div class="av ${s.c}" style="margin-top:8px;font-size:14px"><i></i>${s.t}${p.stock > 0 ? " · Envio imediato" : ""}</div>
      <p class="muted" style="margin-top:16px">${p.description}</p>
      <dl class="specs">${specs.map(x => `<div><dt>${x[0]}</dt><dd>${x[1]}</dd></div>`).join("")}</dl>
      ${p.stock > 0 ? `<div class="buy"><div class="qty"><button id="qm" aria-label="Diminuir">${ICON.minus}</button><span id="qv">1</span><button id="qp" aria-label="Aumentar">${ICON.plus}</button></div>
      <button class="btn p" id="addbtn">Adicionar ao carrinho</button></div>` : '<div class="buy"><button class="btn s" disabled>Indisponível</button></div>'}
      </div></div></div>${p.stock > 0 ? `<div class="buybar"><b>${brl(p.price)}</b><button class="btn y" id="addbar">Adicionar</button></div>` : ""}${eds}`;
    DH.viewer($("#stage"), p);
    if (p.stock > 0) {
      let q = 1; const v = $("#qv");
      $("#qm").onclick = () => v.textContent = q = Math.max(1, q - 1); $("#qp").onclick = () => v.textContent = q = Math.min(p.stock, q + 1);
      const go = () => { add(p.id, q); toast("Adicionado ao carrinho"); openDrawer(true); }; $("#addbtn").onclick = go; $("#addbar").onclick = go;
    }
    const t = $("#ect"); if (t) { $("#eprev").onclick = () => t.scrollBy({ left: -t.clientWidth * .8 }); $("#enext").onclick = () => t.scrollBy({ left: t.clientWidth * .8 }); }
  };

  P.carrinho = () => {
    const draw = () => {
      const l = lines();
      $("#cart").innerHTML = l.length ? `<div class="lay"><div>${cartRows()}</div><div class="box" style="align-self:start">
        <div class="ln"><span>Subtotal</span><span>${brl(subtotal())}</span></div><div class="ln muted"><span>Entrega</span><span>Calculada no checkout</span></div>
        <div class="ln tt"><span>Total</span><span>${brl(subtotal())}</span></div><a class="btn p w" style="margin-top:14px" href="checkout/index.html">Continuar para checkout</a></div></div>`
        : '<div class="ctr"><h2 style="font-size:32px">Seu carrinho está vazio</h2><p><a class="btn p" style="margin-top:16px" href="produtos">Explorar produtos</a></p></div>';
    };
    draw(); document.addEventListener("dh:cart", draw);
  };

  P.checkout = () => {
    if (!lines().length) { location.replace("carrinho/index.html"); return; }
    const total = subtotal() + SITE.shipping; let charge, timer, step = 1;
    $("#sum").innerHTML = lines().map(({ p, qty }) => `<div class="ln" style="gap:12px"><span>${p.name} <span class="muted">× ${qty}</span></span><span>${brl(p.price * qty)}</span></div>`).join("")
      + `<div class="ln"><span>Subtotal</span><span>${brl(subtotal())}</span></div><div class="ln"><span>Entrega</span><span>${brl(SITE.shipping)}</span></div><div class="ln tt"><span>Total</span><span>${brl(total)}</span></div>`;
    $("#ship").textContent = brl(SITE.shipping);
    const go = n => { step = n; $("#s1").hidden = n !== 1; $("#s2").hidden = n !== 2; $$(".steps i").forEach((i, k) => i.classList.toggle("on", k < n)); window.scrollTo(0, 0); };
    $("#form").onsubmit = e => { e.preventDefault(); go(2); startPix(); };
    $("#back").onclick = () => { clearInterval(timer); go(1); };
    function startPix() {
      clearInterval(timer); charge = createPixCharge(total);
      const qr = qrcode(0, "M"); qr.addData(charge.code); qr.make();
      $("#pix").innerHTML = `<p class="muted" style="margin:0">Valor a pagar</p><p class="big" style="font:700 32px 'Space Grotesk';margin:0">${brl(total)}</p>
        <div class="qr">${qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true })}</div>
        <p style="margin:0 0 12px">Abra o app do seu banco, escolha <b>Pix</b> e escaneie o QR Code.</p><div class="code">${charge.code}</div>
        <button class="btn p" id="copy" style="margin-top:12px">${ICON.copy} Copiar Código Pix (Copia e Cola)</button>
        <p class="muted" style="margin:18px 0 0">O código expira em <b style="color:var(--ink)" id="left">15:00</b></p>
        <p class="muted" style="margin:8px 0 0"><span class="spin"></span>Aguardando confirmação do pagamento…</p>`;
      $("#copy").onclick = async () => {
        try { await navigator.clipboard.writeText(charge.code); } catch (e) { const t = document.createElement("textarea"); t.value = charge.code; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); }
        $("#copy").innerHTML = `${ICON.check} Código copiado!`; setTimeout(() => $("#copy") && ($("#copy").innerHTML = `${ICON.copy} Copiar Código Pix (Copia e Cola)`), 2000);
      };
      timer = setInterval(async () => {
        const rest = Math.max(0, Math.round((charge.expiresAt - Date.now()) / 1000));
        const l = $("#left"); if (l) l.textContent = String(Math.floor(rest / 60)).padStart(2, "0") + ":" + String(rest % 60).padStart(2, "0");
        if (rest === 0) { clearInterval(timer); $("#pix").innerHTML = '<h3 style="font-size:22px">Código Pix expirado</h3><button class="btn p" id="renew" style="margin-top:16px">Gerar novo código</button>'; $("#renew").onclick = startPix; return; }
        if (await checkPixStatus(charge) === "approved") {
          clearInterval(timer);
          $("#pix").innerHTML = `<div class="ok" style="padding:24px 0">${ICON.ok}<h3 style="font-size:26px;margin-top:12px;color:var(--ink)">Pagamento Aprovado!</h3><p class="muted">Redirecionando para o seu pedido…</p></div>`;
          const id = "DH-" + Math.floor(100000 + Math.random() * 900000);
          try { localStorage.setItem("dh-last-order", JSON.stringify({ id, total, items: lines().map(l => ({ name: l.p.name, qty: l.qty })) })); } catch (e) {}
          setTimeout(() => { clear(); location.href = "pedido/confirmado/index.html"; }, 1500);
        }
      }, 1000);
    }
  };

  P.confirmado = () => {
    let o = null; try { o = JSON.parse(localStorage.getItem("dh-last-order") || "null"); } catch (e) {}
    $("#order").innerHTML = o ? `<div class="box" style="max-width:420px;margin:24px auto 0;text-align:left">
      ${[["Pedido", o.id], ["Valor", brl(o.total)], ["Pagamento", "Pix"], ["Entrega", "Transportadora"]].map(r => `<div class="ln"><span class="muted">${r[0]}</span><b>${r[1]}</b></div>`).join("")}
      <div style="border-top:1px solid var(--line);margin-top:8px;padding-top:8px">${o.items.map(i => `<div class="ln"><span>${i.name}</span><span class="muted">× ${i.qty}</span></div>`).join("")}</div></div>`
      : '<p class="muted">Não encontramos os dados deste pedido neste dispositivo.</p>';
  };

  P.institucional = () => {
    const T = {
      sobre: ["Sobre a DeckHub", "A DeckHub TCG é uma loja especializada em Trading Card Games. Seu Hub de TCG: boosters, cartas avulsas e acessórios, com compra direta pelo site."],
      "como-comprar": ["Como Comprar", "Escolha o produto, adicione ao carrinho, informe seus dados e o endereço de entrega e pague via Pix. Seu pedido é confirmado assim que o pagamento for aprovado."],
      frete: ["Envio e Frete", "As entregas são feitas por transportadora. O valor do frete é mostrado no checkout antes do pagamento."],
      trocas: ["Trocas e Devoluções", "Esta página será publicada em breve. Em caso de dúvidas, fale com a DeckHub pelo WhatsApp."],
      termos: ["Termos & Condições", "Esta página será publicada em breve. Em caso de dúvidas, fale com a DeckHub pelo WhatsApp."],
      privacidade: ["Política de Privacidade", "Esta página será publicada em breve. Em caso de dúvidas, fale com a DeckHub pelo WhatsApp."]
    };
    const t = T[qs.get("p")] || T.sobre; document.title = t[0] + " | DeckHub TCG";
    $("#txt").innerHTML = `<h1>${t[0]}</h1><p>${t[1]}</p><a class="btn p" style="margin-top:12px" href="produtos">Ver produtos</a>`;
  };

  if (P[page]) P[page]();
});
