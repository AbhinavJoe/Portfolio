// One shared requestAnimationFrame loop, so work that must happen in a fixed
// order within a frame actually does. Two independent rAF loops run in
// registration order, which here meant the scroll-trace marker read
// window.scrollY BEFORE Lenis applied that frame's scroll — so anything
// pinned to a fixed spot in the viewport (the rail dot) trailed the page by a
// frame or more and visibly bounced during fast scrolling. `order` is
// ascending: Lenis ticks at 0, the marker renders at 10.
type FrameFn = (timeMs: number) => void;

const subscribers: { fn: FrameFn; order: number }[] = [];
let rafId: number | null = null;

function tick(timeMs: number) {
  for (const { fn } of [...subscribers]) fn(timeMs);
  rafId = subscribers.length > 0 ? window.requestAnimationFrame(tick) : null;
}

export function subscribeFrame(fn: FrameFn, order = 0): () => void {
  const entry = { fn, order };
  subscribers.push(entry);
  subscribers.sort((a, b) => a.order - b.order);
  if (rafId === null) rafId = window.requestAnimationFrame(tick);

  return () => {
    const index = subscribers.indexOf(entry);
    if (index !== -1) subscribers.splice(index, 1);
    if (subscribers.length === 0 && rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  };
}
