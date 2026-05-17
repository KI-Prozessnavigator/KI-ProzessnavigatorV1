(function() {
  const glowConfig = [
    { id: 'glow-1', speed: 0.04 },
    { id: 'glow-2', speed: -0.03 },
    { id: 'glow-3', speed: 0.05 },
    { id: 'glow-4', speed: 0.02 },
    { id: 'glow-5', speed: -0.025 }
  ];

  const glows = glowConfig
    .map(c => ({ el: document.getElementById(c.id), speed: c.speed }))
    .filter(g => g.el !== null);

  if (glows.length === 0) return;

  let ticking = false;

  function updateGlows() {
    const scrollY = window.scrollY;
    glows.forEach(g => {
      g.el.style.transform = 'translateY(' + (scrollY * g.speed) + 'px)';
    });
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateGlows);
      ticking = true;
    }
  }, { passive: true });
})();
