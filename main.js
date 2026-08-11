  document.querySelectorAll('[data-row]').forEach(function(row) {
    row.addEventListener('touchstart', function() { row.classList.add('is-paused'); }, { passive: true });
    row.addEventListener('touchend', function() { row.classList.remove('is-paused'); }, { passive: true });
    row.addEventListener('touchcancel', function() { row.classList.remove('is-paused'); }, { passive: true });
  });
  
  
  (function() {
    var viewport = document.querySelector('[data-viewport]');
    var track = document.querySelector('[data-track]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var dotsWrap = document.querySelector('[data-dots]');
    var prevBtn = document.querySelector('[data-prev]');
    var nextBtn = document.querySelector('[data-next]');
    if (!viewport || !cards.length) return;
    
    var activeIndex = 0;
    
    // بناء النقاط
    cards.forEach(function(_, i) {
      var dot = document.createElement('button');
      dot.className = 'quotes__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'اقتباس ' + (i + 1));
      dot.addEventListener('click', function() { goTo(i); });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);
    
    function setActive(i) {
      activeIndex = i;
      dots.forEach(function(d, idx) { d.classList.toggle('is-active', idx === i); });
    }
    
    function goTo(i) {
      i = Math.max(0, Math.min(cards.length - 1, i));
      cards[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
    
    // تتبّع أي بطاقة ظاهرة حالياً في المنتصف
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
          setActive(cards.indexOf(entry.target));
        }
      });
    }, { root: viewport, threshold: [0.6] });
    cards.forEach(function(c) { io.observe(c); });
    
    prevBtn && prevBtn.addEventListener('click', function() { goTo(activeIndex - 1); });
    nextBtn && nextBtn.addEventListener('click', function() { goTo(activeIndex + 1); });
    
    // تشغيل تلقائي بسيط يتوقف عند التفاعل
    var autoplay = setInterval(function() {
      goTo((activeIndex + 1) % cards.length);
    }, 4500);
    
    function stopAutoplay() { clearInterval(autoplay); }
    viewport.addEventListener('pointerdown', stopAutoplay, { once: true });
    viewport.addEventListener('touchstart', stopAutoplay, { once: true, passive: true });
    prevBtn && prevBtn.addEventListener('click', stopAutoplay);
    nextBtn && nextBtn.addEventListener('click', stopAutoplay);
  })();
  
  var yearEl = document.querySelector('.site-footer__year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  
  

  (function () {
    var slider = document.querySelector('[data-revamp-slider]');
    var track  = document.querySelector('[data-revamp-track]');
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-revamp-slide]'));
    var dotsWrap = document.querySelector('[data-revamp-dots]');
    if (!slider || !track || !slides.length) return;

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
      // عرض المسار الكامل نسبة إلى السلايدر
      track.style.width = (count / perView * 100) + '%';
      // كل شريحة تاخذ حصة متساوية من عرض المسار
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
    }

    function goTo(i) {
      index = Math.max(0, Math.min(maxIndex(), i));
      render();
    }

    function next() {
      index = index >= maxIndex() ? 0 : index + 1;
      render();
    }

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(next, 4500);
    }

    mq.addEventListener('change', applyLayout);
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
      if (deltaX > 40) goTo(index - 1);
      else if (deltaX < -40) goTo(index + 1);
      deltaX = 0;
      resetTimer();
    });

    applyLayout();
    resetTimer();
  })();