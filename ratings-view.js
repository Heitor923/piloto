// ratings-view.js
// Exibe apenas a avaliação agregada informada via data-external-* (sem permitir voto do usuário)

document.addEventListener('DOMContentLoaded', () => {
  const widgets = Array.from(document.querySelectorAll('.rating'));

  widgets.forEach(widget => {
    const externalRating = parseFloat(widget.getAttribute('data-external-rating')) || 0;
    const externalCount = parseInt(widget.getAttribute('data-external-count')) || 0;

    const average = externalCount > 0 ? externalRating : 0;
    const totalCount = externalCount;

    const inner = widget.querySelector('.stars-inner');
    if (inner) {
      const percent = average > 0 ? (average / 5) * 100 : 0;
      inner.style.width = `${percent}%`;
    }

    const avgEl = widget.querySelector('.rating-average');
    const countEl = widget.querySelector('.rating-count span');
    if (avgEl) avgEl.textContent = average > 0 ? average.toFixed(1) : '—';
    if (countEl) countEl.textContent = totalCount;

    const starsOuter = widget.querySelector('.stars-outer');
    if (starsOuter) {
      const label = average > 0 ? `Avaliação média ${average.toFixed(1)} de 5` : 'Sem avaliações';
      starsOuter.setAttribute('aria-label', label);
    }
  });
});
