document.addEventListener('DOMContentLoaded', () => {
  const blindMap = {
    'bleu-de-chanel': { score: 9, label: 'Extremamente seguro', desc: '9-10 — Muito provável que agrade a maioria. Bom para comprar sem provar.' },
    'acqua-di-gio': { score: 8, label: 'Seguro', desc: '7-8 — Geralmente uma aposta segura para blind buy.' },
    'invictus': { score: 8, label: 'Seguro', desc: '7-8 — Geralmente uma aposta segura para blind buy.' },
    'dior-homme-intense': { score: 7, label: 'Seguro', desc: '7-8 — Geralmente uma aposta segura para blind buy.' },
    'la-nuit-de-lhomme': { score: 6, label: 'Risco moderado', desc: '5-6 — Pode agradar a muitas pessoas, mas há chance de divergir.' },
    'la-vie-est-belle': { score: 7, label: 'Seguro', desc: '7-8 — Geralmente uma aposta segura para blind buy.' },
    'light-blue': { score: 7, label: 'Seguro', desc: '7-8 — Geralmente uma aposta segura para blind buy.' },
    'black-opium': { score: 6, label: 'Risco moderado', desc: '5-6 — Pode agradar a muitas pessoas, mas há chance de divergir.' },
    'flowerbomb': { score: 6, label: 'Risco moderado', desc: '5-6 — Pode agradar a muitas pessoas, mas há chance de divergir.' },
    'chanel-no5': { score: 5, label: 'Arriscado', desc: '1-5 — Perfil mais polarizador; cuidado ao comprar sem testar.' }
  };

  const agradMap = {
    'bleu-de-chanel': { label: 'Extremamente versátil', desc: 'Funciona em muitas ocasiões, dia ou noite.' },
    'acqua-di-gio': { label: 'Muito versátil', desc: 'Fresco, ótimo pro dia-a-dia e calor.' },
    'invictus': { label: 'Versátil esportivo', desc: 'Tende a agradar no dia e em ocasiões casuais.' },
    'dior-homme-intense': { label: 'Alta agradabilidade', desc: 'Um pouco mais específico (noite/frio).' },
    'la-nuit-de-lhomme': { label: 'Agradável', desc: 'Ótimo pro noturno e encontros.' },
    'la-vie-est-belle': { label: 'Muito agradável', desc: 'Doce floral que agrada bastante.' },
    'light-blue': { label: 'Agradável e leve', desc: 'Ótimo pra calor/dia.' },
    'black-opium': { label: 'Marcante e doce', desc: 'Funciona muito bem à noite.' },
    'flowerbomb': { label: 'Floral doce envolvente', desc: 'Forte, sensual, bom pra ocasiões.' },
    'chanel-no5': { label: 'Clássico tradicional', desc: 'Elegante, mas estilo mais específico.' }
  };

  const tempMap = {
    'bleu-de-chanel': { range: '15–25°C', desc: 'Versátil em clima ameno; ideal entre 15 e 25°C.' },
    'acqua-di-gio': { range: '25–30 / 20–25°C', desc: 'Melhor em clima quente (25–30°C); também funciona em 20–25°C.' },
    'invictus': { range: '20–30°C', desc: 'Boa performance em dias quentes (20–30°C).' },
    'dior-homme-intense': { range: '10–20 / 15–25°C', desc: 'Mais indicado para frio e noites (10–20°C).' },
    'la-nuit-de-lhomme': { range: '10–20 / 15–25°C', desc: 'Melhor à noite e em climas mais frios.' },
    'la-vie-est-belle': { range: '15–25 / 20–30°C', desc: 'Funciona bem em noites amenas a quentes.' },
    'light-blue': { range: '25–30 / 20–25°C', desc: 'Perfeito para calor e dias ensolarados.' },
    'black-opium': { range: '10–20°C', desc: 'Melhor à noite e em clima frio.' },
    'flowerbomb': { range: '15–25°C', desc: 'Versátil entre dia e noite, ideal em clima ameno.' },
    'chanel-no5': { range: '15–25°C', desc: 'Perfume clássico, indicado em clima ameno/especial.' }
  };

  // Evento simples: quando clicar num card, atualiza/injeta as infos no modal
  document.addEventListener('click', (ev) => {
    const card = ev.target.closest('article.card');
    if (!card) return;

    // tenta obter product id a partir do elemento .rating
    const rating = card.querySelector('.rating');
    let productId = rating ? rating.getAttribute('data-product-id') : null;

    // fallback: tenta normalizar data-name para chave (apenas se necessário)
    if (!productId) {
      const name = (card.getAttribute('data-name') || '').toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9\-]/g,'');
      productId = name || null;
    }
    if (!productId) return;

    const modalBody = document.getElementById('modal-body');
    if (!modalBody) return;

    let container = modalBody.querySelector('.perfume-metrics');
    if (!container) {
      container = document.createElement('div');
      container.className = 'perfume-metrics';
      modalBody.insertBefore(container, modalBody.firstChild);
    }

    const blind = blindMap[productId];
    const agrad = agradMap[productId];
    const temp = tempMap[productId];

    // Monta HTML simples (só as seções que existirem)
    let html = '';
    if (blind) {
      html += `<div class="blind-info"><strong>🛡️ Segurança (Blind buy):</strong> <span>${blind.score}/10 — ${blind.label}</span><div class="desc">${blind.desc}</div></div>`;
    }
    if (agrad) {
      html += `<div class="agrad-info"><strong>🌟 Grau de Agradabilidade:</strong> <span>${agrad.label}</span><div class="desc">${agrad.desc}</div></div>`;
    }
    if (temp) {
      html += `<div class="temp-info"><strong>🌡️ Temperatura Ideal:</strong> <span>${temp.range}</span><div class="desc">${temp.desc}</div></div>`;
    }

    container.innerHTML = html;
  });
});