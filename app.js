document.addEventListener('DOMContentLoaded', () => {
  const botoes = document.querySelectorAll('.filtro-btn');
  const cards = document.querySelectorAll('.card');

  function normalize(texto) {
    if (!texto) return '';
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  function pegarCategorias(card) {
    let texto = card.getAttribute('data-ocasiao') || '';
    texto = normalize(texto);
    return texto.split(/[\s,\/]+/).filter(c => c !== '');
  }

  function aplicarFiltro(filtro) {
    const f = normalize(filtro);

    cards.forEach(card => {
      if (f === 'all' || f === '') {
        card.classList.remove('hidden');
      } else {
        const categorias = pegarCategorias(card);
        const tem = categorias.includes(f);
        if (tem) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      }
    });
  }

  function marcarBotao(btnClicado) {
    botoes.forEach(btn => {
      btn.setAttribute('aria-pressed', 'false');
      btn.classList.remove('bg-primario', 'text-white');
      btn.classList.add('bg-gray-200');
      btn.style.backgroundColor = '';
      btn.style.color = '';
    });

    btnClicado.classList.remove('bg-gray-200');
    btnClicado.classList.add('bg-primario', 'text-white');
    btnClicado.style.backgroundColor = '#0f172a';
    btnClicado.style.color = '#ffffff';
    btnClicado.setAttribute('aria-pressed', 'true');
  }

  botoes.forEach(btn => {
    btn.addEventListener('click', function () {
      const filtro = btn.getAttribute('data-filter') || 'all';
      marcarBotao(btn);
      aplicarFiltro(filtro);
    });
  });

  cards.forEach(card => {
    card.addEventListener('click', function (e) {
      const clicouBotao = e.target.tagName.toLowerCase() === 'button';
      if (!clicouBotao) {
        card.classList.add('scale-95');
        setTimeout(() => card.classList.remove('scale-95'), 160);
      }
    });
  });

  const botaoAll = Array.from(botoes).find(btn => {
    let f = btn.getAttribute('data-filter') || '';
    return f.toLowerCase() === 'all';
  });

  if (botaoAll) {
    marcarBotao(botaoAll);
    aplicarFiltro('all');
  } else {
    aplicarFiltro('all');
  }
});
