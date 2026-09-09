(() => {
  const checkoutBase = 'https://pay.kiwify.com.br/ebQ9LUB';
  const current = new URLSearchParams(window.location.search);
  const checkout = new URL(checkoutBase);

  const trackingKeys = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'fbclid',
    'src',
    'sck'
  ];

  trackingKeys.forEach((key) => {
    const value = current.get(key);
    if (value) checkout.searchParams.set(key, value);
  });

  const checkoutUrl = checkout.toString();

  const sendMetaCustomEvent = (eventName, params = {}) => {
    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', eventName, params);
    }
  };

  const sendClarityEvent = (eventName) => {
    if (typeof window.clarity === 'function') {
      window.clarity('event', eventName);
    }
  };

  document.querySelectorAll('[data-checkout]').forEach((link, index) => {
    link.href = checkoutUrl;

    link.addEventListener('click', () => {
      const ctaName =
        link.dataset.cta ||
        link.id ||
        `cta_${index + 1}`;

      sendMetaCustomEvent('CTA_Click', {
        cta: ctaName,
        value: 29.90,
        currency: 'BRL'
      });

      sendClarityEvent(`CTA_${ctaName}`);
    });
  });

  const scrollMarks = [25, 50, 75, 90];
  const triggeredScrolls = new Set();

  const checkScrollDepth = () => {
    const doc = document.documentElement;

    const scrollTop =
      window.scrollY ||
      doc.scrollTop;

    const scrollableHeight =
      doc.scrollHeight - window.innerHeight;

    if (scrollableHeight <= 0) return;

    const scrollPercent =
      Math.round((scrollTop / scrollableHeight) * 100);

    scrollMarks.forEach((mark) => {
      if (
        scrollPercent >= mark &&
        !triggeredScrolls.has(mark)
      ) {
        triggeredScrolls.add(mark);

        sendMetaCustomEvent(`Scroll_${mark}`, {
          percent: mark
        });

        sendClarityEvent(`Scroll_${mark}`);
      }
    });
  };

  window.addEventListener('scroll', checkScrollDepth, {
    passive: true
  });

  const items = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -35px'
      }
    );

    items.forEach((item) => observer.observe(item));
  } else {
    items.forEach((item) =>
      item.classList.add('is-visible')
    );
  }
})();
