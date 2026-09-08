(() => {
  const checkoutBase = 'https://pay.kiwify.com.br/ebQ9LUB';
  const current = new URLSearchParams(window.location.search);
  const checkout = new URL(checkoutBase);
  const trackingKeys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','src','sck'];
  trackingKeys.forEach((key) => {
    const value = current.get(key);
    if (value) checkout.searchParams.set(key, value);
  });
  const checkoutUrl = checkout.toString();

  document.querySelectorAll('[data-checkout]').forEach((link) => {
    link.href = checkoutUrl;
    link.addEventListener('click', () => {
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'InitiateCheckout', { value: 29.90, currency: 'BRL' });
      }
    });
  });

  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px' });
    items.forEach((item) => observer.observe(item));
  } else {
    items.forEach((item) => item.classList.add('is-visible'));
  }
})();
