/**
 * Fades section headings and cards in as they scroll into view.
 *
 * Nothing is hidden up front: the observer's first report tells us which elements start
 * off screen, and only those are hidden (invisibly, since they are off screen) until they
 * scroll into view. Elements visible at load never fade, so first paint is never delayed.
 * Without JavaScript, or with reduced motion, nothing is hidden at all.
 */
const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !reduced) {
  const seen = new WeakSet<Element>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target;
        const first = !seen.has(el);
        seen.add(el);
        if (entry.isIntersecting) {
          if (el.classList.contains('reveal-pending')) {
            el.classList.add('reveal-in');
            el.classList.remove('reveal-pending');
          }
          observer.unobserve(el);
        } else if (first) {
          el.classList.add('reveal-pending');
        }
      }
    },
    { rootMargin: '0px 0px -5% 0px' },
  );
  targets.forEach((el) => observer.observe(el));

  // Never leave anything hidden when printing.
  addEventListener('beforeprint', () => {
    targets.forEach((el) => el.classList.remove('reveal-pending'));
  });
}
