(() => {
  'use strict';

  const CHECKOUT_HOST = 'pay.kiwify.com.br';
  const trackedScrolls = new Set();

  function trackMeta(eventName, params = {}) {
    try {
      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', eventName, params);
      }
    } catch (_) {
      // Rastreamento nunca pode impedir a navegação.
    }
  }

  function withAttribution(url) {
    try {
      const destination = new URL(url);
      const source = new URLSearchParams(window.location.search);
      ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','src','sck'].forEach((key) => {
        const value = source.get(key);
        if (value) destination.searchParams.set(key, value);
      });
      return destination.toString();
    } catch (_) {
      return url;
    }
  }

  // O href já existe no HTML. Este código só acrescenta atribuição e telemetria.
  document.querySelectorAll('a[data-track]').forEach((link) => {
    if (link.hostname === CHECKOUT_HOST || link.href.includes(CHECKOUT_HOST)) {
      link.href = withAttribution(link.href);
    }

    link.addEventListener('click', () => {
      trackMeta(link.dataset.track || 'CTA_Click', {
        value: 29.90,
        currency: 'BRL',
        location: link.dataset.track || 'unknown'
      });
      // Sem preventDefault, sem setTimeout e sem bloquear a saída para o checkout.
    }, { passive: true });
  });

  function onScroll() {
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const pct = Math.round((window.scrollY / max) * 100);
    [25, 50, 75, 90].forEach((mark) => {
      if (pct >= mark && !trackedScrolls.has(mark)) {
        trackedScrolls.add(mark);
        trackMeta(`Scroll_${mark}`, { percent: mark });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();
