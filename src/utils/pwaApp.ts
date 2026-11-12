/**
 * The installed app (PWA) behaves as an app, not a web page: no swipe "back" between the page's views.
 * Nothing here runs in a browser tab.
 */

export function isStandalone(): boolean {
  return window.matchMedia?.("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

function isIOS(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

/**
 * Android's back gesture (and back button) belongs to the system; the page can only stay where it is. A guard entry
 * sits on top of the history: "back" takes it off and the page puts it back. Chrome skips history entries made without
 * a user gesture, so the guard goes in on a touch. iOS has no back gesture of its own in an installed app: its edge swipe
 * only goes back through the history, which stays empty there (the address never changes, see Home).
 */
export function holdBackGesture(): void {
  if (!isStandalone() || isIOS()) return;
  let armed = false;
  const arm = () => {
    if (armed) return;
    armed = true;
    history.pushState({ ...(history.state ?? {}), pwaGuard: true }, "");
  };
  window.addEventListener("pointerdown", arm, { capture: true });
  window.addEventListener("popstate", () => {
    if (history.state?.pwaGuard) return;
    armed = false;
    arm();
  });
}

