document.addEventListener('DOMContentLoaded', () => {
  const botoes = document.querySelectorAll('.filtro-btn');
  const cards = Array.from(document.querySelectorAll('.card'));
  const modal = document.getElementById('perfume-modal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.querySelector('.modal-close');
  const searchInput = document.getElementById('top-search');
  const searchBtn = document.getElementById('search-btn-top');
  const clearSearch = document.getElementById('clear-search');

  function normalize(texto) {
    if (!texto) return '';
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  function pegarCategorias(card) {
    let texto = card.getAttribute('data-ocasiao') || '';
    texto = normalize(texto);
    return texto.split(/[\s,\/]+/).filter(c => c !== '');
  }

  function filtroAtivo() {
    const ativo = Array.from(botoes).find(b => b.getAttribute('aria-pressed') === 'true');
    return ativo ? (ativo.getAttribute('data-filter') || 'all') : 'all';
  }

  function aplicarFiltros() {
    const f = normalize(filtroAtivo());
    const q = normalize(searchInput ? searchInput.value : '');

    cards.forEach(card => {
      const categorias = pegarCategorias(card);
      const nome = normalize(card.getAttribute('data-name') || '');
      const notas = normalize((card.getAttribute('data-top') || '') + ' ' + (card.getAttribute('data-heart') || '') + ' ' + (card.getAttribute('data-base') || ''));
      const desc = normalize(card.getAttribute('data-sensation') || '');
      const passaFiltro = (f === 'all' || f === '') ? true : categorias.includes(f);
      const passaBusca = q === '' ? true : ((nome + ' ' + notas + ' ' + desc).includes(q));
      if (passaFiltro && passaBusca) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  function marcarBotao(btnClicado) {
    botoes.forEach(btn => {
      btn.setAttribute('aria-pressed', 'false');
      btn.classList.remove('active-filter');
    });

    btnClicado.classList.add('active-filter');
    btnClicado.setAttribute('aria-pressed', 'true');
  }

  botoes.forEach(btn => {
    btn.addEventListener('click', function () {
      marcarBotao(btn);
      aplicarFiltros();
    });
  });

  const botaoAll = Array.from(botoes).find(btn => {
    let f = btn.getAttribute('data-filter') || '';
    return f.toLowerCase() === 'all';
  });
  if (botaoAll) marcarBotao(botaoAll);

  function openModalFromCard(card) {
    const name = card.getAttribute('data-name') || '';
    const year = card.getAttribute('data-year') || '';
    const perfumers = card.getAttribute('data-perfumers') || '';
    const sensation = card.getAttribute('data-sensation') || '';
    const top = card.getAttribute('data-top') || '';
    const heart = card.getAttribute('data-heart') || '';
    const base = card.getAttribute('data-base') || '';
    const img = card.getAttribute('data-img') || '';

    // criar link de compra (pesquisa)
    const query = encodeURIComponent(`${name} comprar`);
    const buyLink = `https://www.google.com/search?q=${query}`;

    modalBody.innerHTML = `
      <div style="display:flex;gap:1rem;flex-wrap:wrap;color:var(--text-light);">
        <div style="flex:1 1 40%;min-width:220px;">
          <img src="${img}" alt="${name}" style="width:100%;height:auto;border-radius:8px;object-fit:cover;border:1px solid rgba(255,255,255,0.04);">
        </div>
        <div style="flex:1 1 55%;min-width:220px;">
          <h2 style="margin:0 0 .5rem 0;color:var(--text-light);font-size:1.4rem;">${name}${year ? ' — ' + year : ''}</h2>
          <p style="margin:0 0 .5rem 0;color:var(--muted)"><strong>Criador(es):</strong> ${perfumers}</p>
          <p style="margin:.4rem 0 .6rem 0;"><strong>Cheiro / Sensação:</strong><br>${sensation}</p>
          <div style="margin:.6rem 0;">
            <strong>Notas</strong>
            <ul style="margin:.4rem 0 0 1rem;line-height:1.5;">
              <li><strong>Topo:</strong> ${top}</li>
              <li><strong>Coração:</strong> ${heart}</li>
              <li><strong>Fundo:</strong> ${base}</li>
            </ul>
          </div>
          <div style="margin-top:1rem;display:flex;gap:.6rem;flex-wrap:wrap;">
            <a class="btn-action" href="${buyLink}" target="_blank" rel="noopener noreferrer">Comprar / Onde encontrar</a>
            <button class="btn-outline" id="close-modal-inline">Fechar</button>
          </div>
        </div>
      </div>
    `;

    // tornar modal visível e escuro (texto claro)
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');

    // fechar botão interno
    const closeInline = document.getElementById('close-modal-inline');
    if (closeInline) closeInline.addEventListener('click', closeModal);
  }

  function closeModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    modalBody.innerHTML = '';
  }

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      const clicouBotao = e.target.tagName.toLowerCase() === 'button' || e.target.tagName.toLowerCase() === 'a';
      if (!clicouBotao) openModalFromCard(card);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  function doSearch() { aplicarFiltros(); }
  if (searchBtn) searchBtn.addEventListener('click', doSearch);
  if (searchInput) searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doSearch(); });
  if (clearSearch) clearSearch.addEventListener('click', () => { if (searchInput) searchInput.value = ''; aplicarFiltros(); });

  aplicarFiltros();
});