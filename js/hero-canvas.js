/* ═══════════════════════════════════════════════════════════
   KI-Prozessnavigator — Hero Canvas Particle Network
   Pure Canvas API, retina-ready, performance-optimized
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  var ctx = canvas.getContext('2d');
  var isMobile = window.innerWidth < 768;
  var particleCount = isMobile ? 25 : 50;
  var connectionDistance = isMobile ? 120 : 150;
  var speed = 0.3;
  var particles = [];
  var animId = null;
  var isVisible = true;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var frameInterval = isMobile ? 1000 / 30 : 1000 / 60;
  var lastFrameTime = 0;

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(dpr, dpr);
  }

  function createParticle() {
    var rect = canvas.parentElement.getBoundingClientRect();
    return {
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * speed * 2,
      vy: (Math.random() - 0.5) * speed * 2,
      radius: Math.random() * 2 + 1
    };
  }

  function init() {
    resize();
    particles = [];
    for (var i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
  }

  function update() {
    var rect = canvas.parentElement.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      p.x = Math.max(0, Math.min(w, p.x));
      p.y = Math.max(0, Math.min(h, p.y));
    }
  }

  function draw() {
    var rect = canvas.parentElement.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          var alpha = (1 - dist / connectionDistance) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(0, 212, 255, ' + alpha + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    for (var k = 0; k < particles.length; k++) {
      var p = particles[k];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 119, 255, 0.4)';
      ctx.fill();
    }
  }

  function loop(timestamp) {
    if (!isVisible) {
      animId = requestAnimationFrame(loop);
      return;
    }

    if (timestamp - lastFrameTime < frameInterval) {
      animId = requestAnimationFrame(loop);
      return;
    }
    lastFrameTime = timestamp;

    update();
    draw();
    animId = requestAnimationFrame(loop);
  }

  var observer = new IntersectionObserver(function (entries) {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0.1 });

  observer.observe(canvas);

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      isMobile = window.innerWidth < 768;
      particleCount = isMobile ? 25 : 50;
      connectionDistance = isMobile ? 120 : 150;
      frameInterval = isMobile ? 1000 / 30 : 1000 / 60;
      init();
    }, 200);
  }, { passive: true });

  init();
  animId = requestAnimationFrame(loop);
})();
