const gaId = process.env.NEXT_PUBLIC_GA_ID ?? "";

const controller = `(() => {
  const key = 'sunshine-consent-v1';
  const gaId = ${JSON.stringify(gaId)};
  const read = () => { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } };
  const hide = () => { document.documentElement.dataset.sunshineConsent = 'saved'; };
  const show = () => { document.documentElement.dataset.sunshineConsent = 'pending'; };
  const removeAnalytics = () => {
    if (gaId) window['ga-disable-' + gaId] = true;
    Object.keys(localStorage).filter(name => name.startsWith('_ga')).forEach(name => localStorage.removeItem(name));
    document.cookie.split(';').forEach(value => { const name = value.split('=')[0].trim(); if (name.startsWith('_ga')) document.cookie = name + '=; Max-Age=0; path=/; SameSite=Lax'; });
    document.querySelectorAll('[data-sunshine-ga]').forEach(node => node.remove());
  };
  const loadAnalytics = () => {
    if (!gaId || document.querySelector('[data-sunshine-ga]')) return;
    window['ga-disable-' + gaId] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    window.gtag('js', new Date()); window.gtag('config', gaId, { anonymize_ip: true });
    const script = document.createElement('script'); script.async = true; script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId); script.dataset.sunshineGa = 'true'; document.head.appendChild(script);
  };
  const save = analytics => { localStorage.setItem(key, JSON.stringify({ analytics, savedAt: new Date().toISOString() })); analytics ? loadAnalytics() : removeAnalytics(); hide(); };
  document.querySelectorAll('[data-cookie-accept]').forEach(button => button.addEventListener('click', () => save(true)));
  document.querySelectorAll('[data-cookie-reject]').forEach(button => button.addEventListener('click', () => save(false)));
  document.addEventListener('click', event => { if (event.target.closest('[data-cookie-open]')) show(); });
  const saved = read(); if (saved) { hide(); saved.analytics ? loadAnalytics() : removeAnalytics(); }
})();`;

export function CookieConsent() {
  return <><aside className="cookie-banner" data-cookie-banner aria-labelledby="cookie-title"><div><h2 id="cookie-title">Your privacy, your choice</h2><p>We use necessary storage for your preference. Optional analytics only loads if you accept it.</p></div><div className="cookie-actions"><button type="button" className="button button-outline" data-cookie-reject>Reject analytics</button><button type="button" className="button" data-cookie-accept>Accept analytics</button></div></aside><script id="cookie-controller" dangerouslySetInnerHTML={{ __html: controller }} /></>;
}

export function CookieSettingsButton() { return <button className="text-button" type="button" data-cookie-open>Change cookie preferences</button>; }
