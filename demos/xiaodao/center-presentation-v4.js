(() => {
  const phone = document.querySelector('body > .phone');
  const panels = [...document.querySelectorAll('body > aside, body > .phone, body > .journey-details')];
  let pending;
  function centerPresentation() {
    panels.forEach(panel => { panel.style.left = '0px'; });
    if (!phone || window.innerWidth <= 850) return;
    const bounds = phone.getBoundingClientRect();
    const shift = document.documentElement.clientWidth / 2 - (bounds.left + bounds.width / 2);
    panels.forEach(panel => {
      const zoom = Number.parseFloat(getComputedStyle(panel).zoom) || 1;
      panel.style.left = `${shift / zoom}px`;
    });
  }
  function scheduleCenter() {
    cancelAnimationFrame(pending);
    pending = requestAnimationFrame(centerPresentation);
  }
  window.addEventListener('load', scheduleCenter);
  window.addEventListener('resize', scheduleCenter);
  document.fonts.ready.then(scheduleCenter);
  scheduleCenter();
})();
