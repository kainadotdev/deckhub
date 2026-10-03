/* Pix. PRODUÇÃO: troque estas duas funções por chamadas ao seu servidor/gateway Pix.
   A confirmação deve vir de um webhook assinado no servidor, nunca do navegador. */
const PIX_KEY = "00000000-0000-0000-0000-000000000000"; // chave Pix da DeckHub (esta é inválida de propósito)
const PIX_TTL = 15 * 60 * 1000;
(function () {
  const f = (id, v) => id + String(v.length).padStart(2, "0") + v;
  function crc(s) { let c = 0xffff; for (let i = 0; i < s.length; i++) { c ^= s.charCodeAt(i) << 8; for (let j = 0; j < 8; j++) c = c & 0x8000 ? ((c << 1) ^ 0x1021) & 0xffff : (c << 1) & 0xffff; } return c.toString(16).toUpperCase().padStart(4, "0"); }
  window.createPixCharge = function (amount) {
    const b = f("00", "01") + f("26", f("00", "br.gov.bcb.pix") + f("01", PIX_KEY)) + f("52", "0000") + f("53", "986") + f("54", amount.toFixed(2)) + f("58", "BR") + f("59", "DECKHUB TCG") + f("60", "SAO PAULO") + f("62", f("05", "***")) + "6304";
    const now = Date.now();
    return { id: "pix_" + now.toString(36), code: b + crc(b), createdAt: now, expiresAt: now + PIX_TTL };
  };
  /* Aprova automaticamente após 5 s (simulação para apresentação). */
  window.checkPixStatus = function (c) { return Promise.resolve(Date.now() - c.createdAt >= 5000 ? "approved" : "pending"); };
})();
