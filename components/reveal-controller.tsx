const revealScript = `(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elements = [...document.querySelectorAll('[data-reveal]')];
  if (reduced || !('IntersectionObserver' in window)) { elements.forEach(el => el.classList.add('is-visible')); return; }
  document.documentElement.classList.add('reveal-ready');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { rootMargin: '0px 0px -7%', threshold: 0.12 });
  elements.forEach(el => observer.observe(el));
})();`;

export function RevealController() { return <script id="reveal-controller" dangerouslySetInnerHTML={{ __html: revealScript }} />; }
