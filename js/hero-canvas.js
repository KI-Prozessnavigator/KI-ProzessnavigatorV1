/* ═══════════════════════════════════════════════════════════
   KI-Prozessnavigator — Hero Canvas Particle Network
   Pure Canvas API, retina-ready, mouse-reactive
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
  var particleCount = isMobile ? 30 : 60;
  var connectionDistance = isMobile ? 120 : 160;
  var mouseRadius = 180;
  var mouseForce = 0.02;
  var speed = 0.25;
  var particles = [];
  var animId = null;
  var isVisible = true;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var frameInterval = isMobile ? 1000 / 30 : 1000 / 60;
  var lastFrameTime = 0;

  var mouse = { x: -1000, y: -1000, active: false };

  function resize() {
    var rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticle() {
    var rect = canvas.parentElement.getBoundingClientRect();
    var size = Math.random();
    return {
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * speed * 2,
      vy: (Math.random() - 0.5) * speed * 2,
      radius: size < 0.6 ? 0.8 + Math.random() * 0.8 : size < 0.9 ? 1.5 + Math.random() * 1 : 2.5 + Math.random() * 1,
      opacity: 0.2 + Math.random() * 0.4,
      pulseSpeed: 0.5 + Math.random() * 1.5,
      pulseOffset: Math.random() * Math.PI * 2
    };
  }

  function init() {
    resize();
    particles = [];
    for (var i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
  }

  function update(time) {
    var rect = canvas.parentElement.getBoundingClientRect();
    var w = rect.width;
    var h = rect.height;

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];

      if (mouse.active) {
        var mdx = p.x - mouse.x;
        var mdy = p.y - mouse.y;
        var mDist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mDist < mouseRadius && mDist > 1) {
          var force = (1 - mDist / mouseRadius) * mouseForce;
          p.vx += (mdx / mDist) * force;
          p.vy += (mdy / mDist) * force;
        }
      }

      var maxSpeed = speed * 3;
      var currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (currentSpeed > maxSpeed) {
        p.vx = (p.vx / currentSpeed) * maxSpeed;
        p.vy = (p.vy / currentSpeed) * maxSpeed;
      }

      p.vx *= 0.998;
      p.vy *= 0.998;

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      p.x = Math.max(0, Math.min(w, p.x));
      p.y = Math.max(0, Math.min(h, p.y));
    }
  }

  function draw(time) {
    var rect = canvas.parentElement.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          var alpha = (1 - dist / connectionDistance) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(0, 212, 255, ' + alpha + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    if (mouse.active) {
      for (var m = 0; m < particles.length; m++) {
        var mp = particles[m];
        var mdx = mp.x - mouse.x;
        var mdy = mp.y - mouse.y;
        var mDist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mDist < mouseRadius) {
          var mAlpha = (1 - mDist / mouseRadius) * 0.08;
          ctx.beginPath();
          ctx.moveTo(mp.x, mp.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = 'rgba(0, 119, 255, ' + mAlpha + ')';
          ctx.lineWidth = 0.3;
          ctx.stroke();
        }
      }
    }

    var t = time * 0.001;
    for (var k = 0; k < particles.length; k++) {
      var p = particles[k];
      var pulse = 0.7 + 0.3 * Math.sin(t * p.pulseSpeed + p.pulseOffset);
      var r = p.radius * pulse;
      var a = p.opacity * pulse;

      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 119, 255, ' + (a * 0.6) + ')';
      ctx.fill();

      if (p.radius > 2) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, r + 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 212, 255, ' + (a * 0.1) + ')';
        ctx.fill();
      }
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

    update(timestamp);
    draw(timestamp);
    animId = requestAnimationFrame(loop);
  }

  canvas.parentElement.addEventListener('mousemove', function (e) {
    var rect = canvas.parentElement.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  }, { passive: true });

  canvas.parentElement.addEventListener('mouseleave', function () {
    mouse.active = false;
  }, { passive: true });

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
      particleCount = isMobile ? 30 : 60;
      connectionDistance = isMobile ? 120 : 160;
      frameInterval = isMobile ? 1000 / 30 : 1000 / 60;
      init();
    }, 200);
  }, { passive: true });

  init();
  animId = requestAnimationFrame(loop);
})();
