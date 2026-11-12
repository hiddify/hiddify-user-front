/**
 * The installed app (PWA) behaves as an app, not a web page: no swipe "back" between the page's views.
 * Nothing here runs in a browser tab.
 */

/** Sent on window when the system's back is used in the installed app on Android (MenuDropdown opens or closes). */
export const PWA_BACK = "hiddify:pwa-back";

export function isStandalone(): boolean {
  return window.matchMedia?.("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

function isIOS(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

/**
 * Android's back gesture (and back button) belongs to the system; the page can only stay where it is. Guard entries
 * sit on top of the history: "back" takes one off, the page puts it back and opens (or closes) the menu (PWA_BACK).
 * Three of them, so quick backs in a row cannot run past them before they are put back. Chrome skips entries made
 * without a user gesture, so they also go in again on a touch. iOS has no back gesture of its own in an installed app:
 * its edge swipe only goes back through the history, which stays empty there (the address never changes, see Home).
 */
const GUARDS = 3;

export function holdBackGesture(): void {
  if (!isStandalone() || isIOS()) return;
  const depth = () => (history.state?.pwaGuard as number | undefined) ?? 0;
  const fill = () => {
    for (let n = depth() + 1; n <= GUARDS; n++) history.pushState({ ...(history.state ?? {}), pwaGuard: n }, "");
  };
  fill();
  // the first touch: a fresh set made with a user gesture (the ones above may be skipped by Chrome)
  window.addEventListener("pointerdown", () => {
    for (let n = 1; n <= GUARDS; n++) history.pushState({ ...(history.state ?? {}), pwaGuard: GUARDS }, "");
  }, { capture: true, once: true });
  window.addEventListener("popstate", () => {
    window.dispatchEvent(new Event(PWA_BACK));
    fill();
  });
}


