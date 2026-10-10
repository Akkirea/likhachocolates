(() => {
  const soldTargets = document.querySelectorAll('[data-bars-sold]');
  const impactTargets = document.querySelectorAll('[data-farmer-impact]');
  if (!soldTargets.length && !impactTargets.length) return;

  const storageKey = 'likha-demo-bars-sold';
  const stored = Number(window.localStorage.getItem(storageKey));
  const barsSold = Number.isFinite(stored) && stored > 0
    ? stored
    : Math.floor(Math.random() * 4201) + 1800;
  window.localStorage.setItem(storageKey, String(barsSold));
  const farmerImpact = barsSold * 10;
  const formatNumber = (value) => new Intl.NumberFormat('en-PH').format(Math.round(value));
  const animateValue = (element, end, prefix = '') => {
    const duration = 900;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${prefix}${formatNumber(end * eased)}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  soldTargets.forEach((element) => animateValue(element, barsSold));
  impactTargets.forEach((element) => animateValue(element, farmerImpact, '₱'));
})();
