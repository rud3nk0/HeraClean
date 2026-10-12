(function () {
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var els = [].slice.call(document.querySelectorAll('[data-s],[data-x],[data-r]'));
  var ticking = false;

  // Parallax: data-s = vertical speed, data-x = horizontal speed, data-r = base rotation (deg)
  function parallax() {
    var h = innerHeight;
    els.forEach(function (e) {
      var host = e.parentElement;
      var r = host.getBoundingClientRect();
      if (r.bottom < -300 || r.top > h + 300) return;
      var off = r.top + r.height / 2 - h / 2;
      var y = e.dataset.s ? -off * parseFloat(e.dataset.s) : 0;
      var x = e.dataset.x ? off * parseFloat(e.dataset.x) : 0;
      var rot = e.dataset.r ? ' rotate(' + e.dataset.r + 'deg)' : (e.classList.contains('stripe') ? ' rotate(-6deg)' : '');
      e.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)' + rot;
    });
  }
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function () { parallax(); ticking = false; });
    }
  }
  if (!reduce) {
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    parallax();
  }

  // Reveal on scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (x) {
      if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.rv').forEach(function (e) { io.observe(e); });
})();
