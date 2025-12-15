

document.addEventListener('DOMContentLoaded', () => {
  const mapa = {
    'bleu-de-chanel': { media: 4.8, contagem: 415, texto: '⭐⭐⭐⭐⭐ (4,8/5)' },
    'acqua-di-gio': { media: 4.7, contagem: 182, texto: '⭐⭐⭐⭐⭐ (4,7/5)' },
    'invictus': { media: 4.6, contagem: 156, texto: '⭐⭐⭐⭐½ (4,6/5)' },
    'dior-homme-intense': { media: 4.6, contagem: 234, texto: '⭐⭐⭐⭐½ (4,6/5)' },
    'la-nuit-de-lhomme': { media: 4.5, contagem: 198, texto: '⭐⭐⭐⭐ (4,5/5)' },
    'la-vie-est-belle': { media: 4.5, contagem: 328, texto: '⭐⭐⭐⭐ (4,5/5)' },
    'light-blue': { media: 4.4, contagem: 210, texto: '⭐⭐⭐⭐ (4,4/5)' },
    'black-opium': { media: 4.4, contagem: 298, texto: '⭐⭐⭐⭐ (4,4/5)' },
    'flowerbomb': { media: 4.4, contagem: 256, texto: '⭐⭐⭐⭐ (4,4/5)' },
    'chanel-no5': { media: 4.3, contagem: 512, texto: '⭐⭐⭐⭐ (4,3/5)' }
  };

  function normalizarChave(s = '') {
    return s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\-]/gi, '')
      .toLowerCase()
      .trim();
  }

  function obterIdProduto(widget) {
    const pid = widget.getAttribute('data-product-id');
    if (pid) return pid;
    const card = widget.closest('article.card');
    if (card) {
      const nome = card.getAttribute('data-name') || '';
      if (nome) return normalizarChave(nome.replace(/\s+/g, '-'));
    }
    return null;
  }

  function formatarMediaPT(valor) {
    if (!Number.isFinite(valor) || valor <= 0) return '—';
    return valor.toFixed(1).replace('.', ',');
  }

  function criarEstruturaEstrelas(widget, media) {

    const existentes = widget.querySelectorAll('.stars-outer, .rating-readonly, .rating-old');
    existentes.forEach(n => n.remove());


    const outer = document.createElement('div');
    outer.className = 'stars-outer';
    outer.setAttribute('aria-hidden', 'true');
    outer.style.position = 'relative';
    outer.style.display = 'inline-block';
    outer.style.lineHeight = '1';
    outer.style.fontSize = outer.style.fontSize || '1rem';
    const starsText = document.createElement('span');
    starsText.className = 'stars-text';
    starsText.textContent = '★★★★★';
    starsText.style.visibility = 'visible';
    starsText.style.color = 'rgba(255,255,255,0.25)';

  
    const inner = document.createElement('div');
    inner.className = 'stars-inner';
    inner.textContent = '★★★★★';
    inner.style.position = 'absolute';
    inner.style.top = '0';
    inner.style.left = '0';
    inner.style.overflow = 'hidden';
    inner.style.whiteSpace = 'nowrap';
    inner.style.color = '#ffd166'; 
    inner.style.pointerEvents = 'none';
    inner.style.transition = 'width .25s ease';


    let percent = 0;
    if (Number.isFinite(media) && media > 0) {
      percent = Math.max(0, Math.min(100, (media / 5) * 100));
    }
    inner.style.width = `${percent}%`;

    outer.appendChild(starsText);
    outer.appendChild(inner);

    return { outer, inner };
  }


  const widgets = Array.from(document.querySelectorAll('.rating'));

  widgets.forEach(widget => {

    if (widget.dataset.ratingsReadonlyInit === 'true') return;
    widget.dataset.ratingsReadonlyInit = 'true';

    const id = obterIdProduto(widget);
    if (!id) return;

  
    const infoMapa = mapa[id];
    let media = 0;
    let contagem = 0;
    if (infoMapa) {
      media = Number(infoMapa.media) || 0;
      contagem = Number(infoMapa.contagem) || 0;
    } else {
      media = parseFloat(widget.getAttribute('data-external-rating')) || 0;
      contagem = parseInt(widget.getAttribute('data-external-count')) || 0;
    }

   
    const { outer } = criarEstruturaEstrelas(widget, media);

  
    const textoAvg = document.createElement('span');
    textoAvg.className = 'rating-readonly-avg';
    textoAvg.textContent = media > 0 ? `${formatarMediaPT(media)}/5` : '—';
    textoAvg.style.marginLeft = '0.5rem';
    textoAvg.style.fontWeight = '600';
    textoAvg.style.color = 'var(--text-light)';

  
    widget.innerHTML = '';
   
    const wrapper = document.createElement('div');
    wrapper.className = 'rating-readonly';
    wrapper.style.display = 'inline-flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '0.5rem';

    wrapper.appendChild(outer);
    wrapper.appendChild(textoAvg);

    widget.appendChild(wrapper);

   
    widget.style.pointerEvents = 'none';
   
    const label = media > 0 ? `Avaliação média ${formatarMediaPT(media)} de 5` : 'Sem avaliações';
    outer.setAttribute('aria-label', label);
    outer.setAttribute('title', label);
  });
});