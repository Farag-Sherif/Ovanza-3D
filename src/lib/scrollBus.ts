/** Shared scroll progress bus (0 → 1 across the whole page).
 *  Read inside useFrame without triggering React re-renders. */
export const scrollBus = { progress: 0, velocity: 0 };

let lastY = 0;

export function initScrollBus() {
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const y = window.scrollY;
    scrollBus.velocity = Math.abs(y - lastY);
    lastY = y;
    scrollBus.progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}
