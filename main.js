  document.querySelectorAll('[data-row]').forEach(function (row) {
    row.addEventListener('touchstart', function () { row.classList.add('is-paused'); }, { passive: true });
    row.addEventListener('touchend', function () { row.classList.remove('is-paused'); }, { passive: true });
    row.addEventListener('touchcancel', function () { row.classList.remove('is-paused'); }, { passive: true });
  });