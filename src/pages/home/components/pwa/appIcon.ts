/**
 * The user page's app icon comes in any color (App Color). The panel draws it; the color this browser chose is kept
 * in a cookie, so the page's app icon and manifest links are already right when the page loads next time. The browser
 * tab's icon stays the stock one. The same contract as admin_v2's useAppIcon.
 */
export type AppIconName = "apple-180" | "tile-256";
export interface AppIconInfo {
  /** The panel can draw the icon in other colors */
  enabled: boolean;
  /** This browser's color (RRGGBB) */
  color: string;
  /** The stock icon's color (RRGGBB): that one is a plain file */
  default: string;
  cookie: string;
  cookie_path: string;
  /** The drawn icon's URL, with {color} and {name} to fill in */
  url: string;
  /** The stock icon's files and manifest */
  stock: Record<AppIconName | "manifest", string>;
}

declare global {
  interface Window {
    __APP_ICON__?: AppIconInfo | null;
  }
}

export const HEX = /^[0-9A-F]{6}$/;

// prettier-ignore
/** The ready colors: the same 25 as the admin panel's. */
export const PRESETS = [
  // blue (the stock icon), then around the color wheel
  "0A84FF", "00B0FC", "3CD3FE", "00C3D0", "00C8B3", "34C759", "80CD00", "FFCC00", "FF8D28",
  "FF6B2C", "FF383C", "FE007C", "EF00AC", "CB30E0", "9C39FF", "6155F5", "4A6AFF", "004896",
  // dark tones and neutrals: forest, plum, burgundy, brown, chocolate, graphite, black
  "007B3C", "720087", "9A0021", "AC7F5E", "784016", "8E8E93", "15181E",
];

/** What the page says about its icon, when the panel can draw it in other colors. */
export function appIconInfo(): AppIconInfo | null {
  const info = typeof window === "undefined" ? null : (window.__APP_ICON__ ?? null);
  return info && info.enabled && HEX.test((info.color || "").toUpperCase()) ? info : null;
}

/** The URL of the icon `name` in color `c` (the stock file for the stock color). */
export function iconUrl(info: AppIconInfo, name: AppIconName, c: string): string {
  return c && c !== info.default ? info.url.replace("{color}", c).replace("{name}", name) : info.stock[name];
}

function setLink(selector: string, href: string, replace = false): void {
  const link = document.head.querySelector<HTMLLinkElement>(selector);
  if (!link || !href) return;
  if (!replace) {
    link.href = href;
    return;
  }
  // A new element: browsers read a manifest link again only when it is added.
  const next = link.cloneNode() as HTMLLinkElement;
  next.href = href;
  link.replaceWith(next);
}

/** Choose color `c` (RRGGBB): remembered for this browser, and the page's app icon and manifest links follow at once. */
export function chooseColor(info: AppIconInfo, c: string): void {
  const stock = c === info.default;
  const secure = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${info.cookie}=${stock ? "" : c}; path=${info.cookie_path}; max-age=${stock ? 0 : 31536000}; samesite=lax${secure}`;
  setLink('link[rel="apple-touch-icon"]', iconUrl(info, "apple-180", c));
  const manifest = info.stock.manifest;
  setLink('link[rel="manifest"]', stock ? manifest : `${manifest}${manifest.includes("?") ? "&" : "?"}icon=${c}`, true);
}

/** A light color: the mark on it is dark. */
export function isLight(c: string): boolean {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.45;
}
