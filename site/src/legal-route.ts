function announceRoute(): void {
  const heading = document.querySelector<HTMLElement>("main h1");
  const announcer = document.getElementById("route-announcer");
  if (!heading || !announcer) return;

  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  announcer.textContent = document.title;
}

// Static documents need the same route handoff as the browser workbench. The
// pageshow listener also covers a legal page restored from the back/forward
// cache, where the browser would otherwise leave focus on BODY.
announceRoute();
window.addEventListener("pageshow", announceRoute);
