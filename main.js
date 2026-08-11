(function () {
    var slider = document.querySelector('[data-revamp-slider]');
    var track  = document.querySelector('[data-revamp-track]');
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-revamp-slide]'));
    var dotsWrap = document.querySelector('[data-revamp-dots]');
    var prevBtn = document.querySelector('[data-revamp-prev]');
    var nextBtn = document.querySelector('[data-revamp-next]');

    // تحقق من وجود كل العناصر المطلوبة قبل المتابعة
    if (!slider || !track || !slides.length || !dotsWrap) {
      console.warn('Revamp slider: عنصر مفقود، تحقق من data-revamp-slider / data-revamp-track / data-revamp-slide / data-revamp-dots');
      return;
    }

    var mq = window.matchMedia('(min-width: 860px)');
    var index = 0;
    var timer = null;

    function itemsPerView() { return mq.matches ? 4 : 1; }
    function maxIndex() { return Math.max(0, slides.length - itemsPerView()); }

    function buildDots() {
      dotsWrap.innerHTML = '';
      var count = maxIndex() + 1;
      for (var i = 0; i < count; i++) {
        var dot = document.createElement('button');
        dot.className = 'revamp__dot' + (i === index ? ' is-active' : '');
        dot.setAttribute('aria-label', 'مجموعة ' + (i + 1));
        (function (idx) {
          dot.addEventListener('click', function () { goTo(idx); resetTimer(); });
        })(i);
        dotsWrap.appendChild(dot);
      }
    }

    function applyLayout() {
      var count = slides.length;
      var perView = itemsPerView();
      track.style.width = (count / perView * 100) + '%';
      slides.forEach(function (s) {
        s.style.flex = '0 0 ' + (100 / count) + '%';
        s.style.maxWidth = (100 / count) + '%';
      });
      if (index > maxIndex()) index = maxIndex();
      buildDots();
      render();
    }

    function render() {
      var count = slides.length;
      track.style.transform = 'translateX(-' + (index * 100 / count) + '%)';

      var dots = Array.prototype.slice.call(dotsWrap.children);
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === index); });

      if (prevBtn) prevBtn.disabled = index <= 0;
      if (nextBtn) nextBtn.disabled = index >= maxIndex();
    }

    function goTo(i) {
      index = Math.max(0, Math.min(maxIndex(), i));
      render();
    }

    function next() {
      index = index >= maxIndex() ? 0 : index + 1;
      render();
    }

    function prev() {
      index = index <= 0 ? maxIndex() : index - 1;
      render();
    }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(next, 4500);
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); resetTimer(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); resetTimer(); });

    // دعم المتصفحات القديمة اللي ما عندها addEventListener على matchMedia
    function onMqChange(handler) {
      if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', handler);
      } else if (typeof mq.addListener === 'function') {
        mq.addListener(handler); // fallback للمتصفحات/الـ WebView القديمة
      }
    }
    onMqChange(applyLayout);

    window.addEventListener('resize', function () {
      clearTimeout(window.__revampResizeT);
      window.__revampResizeT = setTimeout(applyLayout, 200);
    });

    // سحب باللمس
    var startX = 0, deltaX = 0, dragging = false;
    slider.addEventListener('touchstart', function (e) {
      dragging = true; startX = e.touches[0].clientX; clearInterval(timer);
    }, { passive: true });
    slider.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      deltaX = e.touches[0].clientX - startX;
    }, { passive: true });
    slider.addEventListener('touchend', function () {
      if (!dragging) return;
      dragging = false;
      if (deltaX > 40) prev();
      else if (deltaX < -40) next();
      deltaX = 0;
      resetTimer();
    });

    applyLayout();
    resetTimer();
  })();