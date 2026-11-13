import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import NorthEastRoundedIcon from "@mui/icons-material/NorthEastRounded";
import PwaAppColor from "./PwaAppColor";
import { appIconInfo, chooseColor, iconUrl } from "./appIcon";
import "./PwaGuide.css";

/**
 * "Install as an app" spotlight on the home page: a looping animation of the browser's own controls — Safari on
 * iPhone / iPad, Chrome on Android, Chrome on a computer — then "Got it" and "Do not show this again".
 * Shown once, on the 3rd visit that is `enabled` — the user has linked Telegram, or the panel has no bot (MainBody:
 * the Telegram spotlight comes first) — and never again after "Got it" (or closing it). Visits before that, or while
 * not linked, do not count. Never when the panel already runs as the installed app.
 * The same guide as admin_v2's PwaInstallDialog / PwaInstallGuide.
 */
type Platform = "ios" | "android" | "desktop";

const DISMISS_KEY = "hiddify.user.pwaGuide.dismissed";
const VISITS_KEY = "hiddify.user.pwaGuide.visits";
const SHOW_ON_VISIT = 3;
/** One visit per page load, however often the home page mounts in it. */
let visitThisLoad = 0;

function isStandalone(): boolean {
  return window.matchMedia?.("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}
function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) return "ios";
  if (/android/i.test(ua)) return "android";
  return "desktop";
}
function desktopOsName(): string {
  const ua = navigator.userAgent;
  if (/windows/i.test(ua)) return "Windows";
  if (/mac os|macintosh/i.test(ua)) return "macOS";
  if (/linux|x11|cros/i.test(ua)) return "Linux";
  return "Windows · macOS · Linux";
}
/** This load counted as a visit (once); the visits so far, this one included. */
function countVisit(): number {
  if (visitThisLoad) return visitThisLoad;
  try {
    visitThisLoad = (Number(localStorage.getItem(VISITS_KEY)) || 0) + 1;
    localStorage.setItem(VISITS_KEY, String(visitThisLoad));
  } catch {
    visitThisLoad = 1; // private mode: no history, so it never reaches the 3rd visit
  }
  return visitThisLoad;
}
function dismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

const PLATFORMS: Platform[] = ["ios", "android", "desktop"];

/** The user page's own app icon, cut to its shape (the page's 256 px tab icon): shown at the top and in the scenes. */
function appIcon(): string | undefined {
  return document.head.querySelector<HTMLLinkElement>('link[rel="icon"][sizes="256x256"]')?.href || undefined;
}

/** This page's address: the install prompts show it under the app's name. */
const HOST = typeof window === "undefined" ? "" : window.location.host;

/** The app as an install prompt shows it: its name and, under it, its address. */
const AppName = () => (
  <span className="app-name">
    <b>Hiddify</b>
    <small>{HOST}</small>
  </span>
);

/** A phone's home screen with the app among the others (the end of the phone scenes). */
const Home = () => (
  <div className="home">
    {[0, 1, 2, 3, 4].map((n) => (
      <span key={n} className="home__app" />
    ))}
    <span className="home__app home__app--new">
      <span className="app-icon" />
      <b>Hiddify</b>
    </span>
    <span className="home__app" />
    <span className="home__app" />
  </div>
);

const Scene = ({ platform }: { platform: Platform }) => {
  if (platform === "ios")
    return (
      <div className="phone">
        <div className="phone__notch" />
        <div className="page"><span className="page__bar page__bar--wide" /><span className="page__bar" /><span className="page__card" /><span className="page__bar" /></div>
        <div className="ios-bar"><span>‹</span><span className="ios-bar__url">panel</span><span className="ios-bar__more tap-1">•••</span></div>
        <div className="sheet ios-menu">
          <div className="sheet__row"><i>▢</i><span /></div>
          <div className="sheet__row sheet__row--hit hit-2"><i>⇪</i><b>Share</b></div>
          <div className="sheet__row"><i>⧉</i><span /></div>
        </div>
        <div className="sheet ios-share">
          <div className="sheet__apps"><span /><span /><span /><span /></div>
          <div className="sheet__row"><i>⧉</i><span /></div>
          <div className="sheet__row sheet__row--hit hit-3"><i>⊕</i><b>Add to Home Screen</b></div>
        </div>
        <div className="sheet ios-add">
          <div className="ios-add__head"><span>Cancel</span><b>Add to Home Screen</b><span className="ios-add__btn hit-4">Add</span></div>
          <div className="ios-add__app"><span className="app-icon" /><AppName /></div>
          <div className="ios-add__opt"><span>Open as Web App</span><i className="ios-add__switch" /></div>
        </div>
        {/* After the last tap: the home screen, with the app on it */}
        <Home />
        <span className="finger finger--ios">●</span>
      </div>
    );
  if (platform === "android")
    return (
      <div className="phone">
        <div className="and-bar"><span>⌂</span><span className="and-bar__url">panel</span><span className="and-bar__more tap-1">⋮</span></div>
        <div className="page"><span className="page__bar page__bar--wide" /><span className="page__bar" /><span className="page__card" /><span className="page__bar" /></div>
        <div className="and-menu">
          <div className="and-menu__row"><span /></div>
          <div className="and-menu__row"><span /></div>
          <div className="and-menu__row and-menu__row--hit hit-2"><i>▯</i><b>Add to home screen</b></div>
          <div className="and-menu__row"><span /></div>
        </div>
        <div className="and-dialog">
          <b>Install app</b>
          <div className="and-dialog__app"><span className="app-icon" /><AppName /></div>
          <div className="and-dialog__btns"><span>Cancel</span><span className="and-dialog__ok hit-3">Install</span></div>
        </div>
        {/* After the last tap: the home screen, with the app on it */}
        <Home />
        <span className="finger finger--android">●</span>
      </div>
    );
  return (
    <div className="window">
      <div className="window__tabs"><span className="window__dot" /><span className="window__dot" /><span className="window__dot" /><span className="window__tab" /></div>
      <div className="window__bar">
        <i>↻</i>
        <span className="window__url">panel<span className="window__install tap-1"><i>⤓</i></span></span>
        <i>⋮</i>
      </div>
      <div className="page page--wide"><span className="page__bar page__bar--wide" /><span className="page__card" /><span className="page__bar" /></div>
      <div className="win-pop">
        <b>Install app?</b>
        <div className="win-pop__app"><span className="app-icon" /><AppName /></div>
        <div className="win-pop__btns"><span className="win-pop__ok hit-2">Install</span><span>Cancel</span></div>
      </div>
      <div className="win-app">
        <div className="win-app__title"><span className="app-icon app-icon--tiny" /><b>Hiddify</b></div>
        <div className="page"><span className="page__bar page__bar--wide" /><span className="page__card" /></div>
      </div>
      <span className="cursor"><NorthEastRoundedIcon fontSize="inherit" /></span>
    </div>
  );
};

/** A system's logo as a vector drawing, in its own colors (Apple's follows the text color). */
const OsLogo = ({ platform }: { platform: Platform }) =>
  platform === "ios" ? (
    <svg className="guide__os" viewBox="4.5 3 15 18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16.52,12.46a3.31,3.31,0,0,1,1.78-3,3.85,3.85,0,0,0-3-1.6c-1.27-.1-2.65.74-3.16.74s-1.77-.7-2.73-.7c-2,0-4.11,1.59-4.11,4.76a9,9,0,0,0,.51,2.9C6.25,16.84,7.9,20.05,9.62,20c.9,0,1.54-.64,2.71-.64s1.72.64,2.73.64c1.73,0,3.23-2.95,3.66-4.26a3.54,3.54,0,0,1-2.2-3.28Zm-2-5.87A3.37,3.37,0,0,0,15.35,4a3.79,3.79,0,0,0-2.42,1.25A3.41,3.41,0,0,0,12,7.81,3,3,0,0,0,14.5,6.59Z"
      />
    </svg>
  ) : platform === "android" ? (
    <svg className="guide__os" viewBox="4 3 16 18" aria-hidden="true">
      <g fill="#3ddc84">
        <path d="M18.06,9.33a.94.94,0,0,0-.94.94v4.26a.94.94,0,0,0,1.88,0V10.27A.94.94,0,0,0,18.06,9.33Z" />
        <path d="M5.94,9.33a.94.94,0,0,0-.94.94v4.26a.94.94,0,0,0,1.88,0V10.27A.94.94,0,0,0,5.94,9.33Z" />
        <path d="M7.56,9.33v6.4A1.07,1.07,0,0,0,8.63,16.8h.68v2.27a.94.94,0,0,0,1.88,0h0V16.8h1.62v2.27a.94.94,0,0,0,1.88,0h0V16.8h.68a1.07,1.07,0,0,0,1.07-1.07V9.33Z" />
        <path d="M16.32,8a4.13,4.13,0,0,0-1.83-2.36l-.15-.09-.16-.08.18-.31.53-1A.14.14,0,0,0,14.84,4h0l-.07,0a.17.17,0,0,0-.13.07L14.1,5l-.17.31-.16-.07-.17-.06a4.88,4.88,0,0,0-3.2,0l-.16.06-.17.07L9.9,5l-.54-1a.14.14,0,0,0-.25.14l.53,1,.18.31-.16.08-.15.09A4.07,4.07,0,0,0,7.69,8a3.11,3.11,0,0,0-.13.8h8.88A3.6,3.6,0,0,0,16.32,8ZM10,7.47a.4.4,0,1,1,.4-.4A.4.4,0,0,1,10,7.47Zm4,0a.4.4,0,1,1,.4-.4A.4.4,0,0,1,14,7.47Z" />
      </g>
    </svg>
  ) : (
    <svg className="guide__os" viewBox="0 0 18 18" aria-hidden="true">
      <rect x="0" y="0" width="8.5" height="8.5" fill="#f25022" />
      <rect x="9.5" y="0" width="8.5" height="8.5" fill="#7fba00" />
      <rect x="0" y="9.5" width="8.5" height="8.5" fill="#00a4ef" />
      <rect x="9.5" y="9.5" width="8.5" height="8.5" fill="#ffb900" />
    </svg>
  );

const PwaGuide = ({ enabled }: { enabled: boolean }) => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  // App Color: the icon in the color this browser chose (drawn by the panel), else the page's own tab icon
  const [iconInfo] = useState(appIconInfo);
  const [color, setColor] = useState(() => (iconInfo ? iconInfo.color.toUpperCase() : ""));
  const [stockIcon] = useState(appIcon);
  const icon = iconInfo ? iconUrl(iconInfo, "tile-256", color) : stockIcon;
  const [detected] = useState<Platform>(detectPlatform);
  const [platform, setPlatform] = useState<Platform>(detected);

  useEffect(() => {
    if (!enabled || dismissed() || isStandalone()) return;
    if (countVisit() < SHOW_ON_VISIT) return;
    const timer = window.setTimeout(() => setOpen(true), 1200); // after the page has drawn
    return () => window.clearTimeout(timer);
  }, [enabled]);

  const steps =
    platform === "ios"
      ? [t("In Safari, tap the ••• button in the bar at the bottom"), t("Tap Share"), t("Choose “Add to Home Screen”"), t("Tap Add: the panel is on your home screen")]
      : platform === "android"
        ? [t("In Chrome, tap the ⋮ menu at the top"), t("Choose “Add to home screen” (or “Install app”)"), t("Tap Install: the panel opens like an app")]
        : [t("In Chrome, click the install icon at the end of the address bar"), t("Click Install"), t("The panel opens in its own window, like an app")];
  // On a phone the computer's system is unknown (an iPhone even says "Mac OS X"): just "Computer"
  const device = (p: Platform) => (p === "ios" ? "iPhone" : p === "android" ? "Android" : detected === "desktop" ? desktopOsName() : t("Computer"));
  const browser = (p: Platform) => (p === "ios" ? "Safari" : "Chrome");
  const rtl = i18n.language === "fa";

  function choose(c: string) {
    if (!iconInfo) return;
    setColor(c);
    chooseColor(iconInfo, c);
  }

  /** Seen once is enough: "Got it" (or closing it) and it does not come back in this browser. */
  function gotIt() {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* private mode: for this visit only */
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onClose={gotIt} PaperProps={{ className: "pwa-guide-paper" }} dir={rtl ? "rtl" : "ltr"}>
      <div className={`pwa-guide${icon ? " pwa-guide--own-icon" : ""}`} style={icon ? { ["--app-icon-img" as string]: `url("${icon}")` } : undefined}>
        {/* Only this part scrolls: on a short screen the icon stays at the top and "Got it" below stays in view */}
        <div className="pwa-guide__body">
          <div className="pwa-guide__hero" style={color ? { ["--pwa-accent" as string]: `#${color}` } : undefined}>
            {/* The app as it will look on the home screen */}
            {icon && <img className="pwa-guide__icon" src={icon} alt="" />}
            {iconInfo && <PwaAppColor color={color} onChoose={choose} rtl={rtl} />}
            <h2>{t("Install the Panel as an App")}</h2>
          </div>
          <div className="guide">
            <div className="guide__tabs" role="tablist" aria-label={t("Your device")}>
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  role="tab"
                  aria-selected={platform === p}
                  aria-label={`${device(p)} · ${browser(p)}`}
                  title={`${device(p)} · ${browser(p)}`}
                  className={`guide__tab guide__tab--${p}${platform === p ? " guide__tab--on" : ""}`}
                  onClick={() => setPlatform(p)}
                >
                  {/* Only the system's logo, in its own colors (the label is read out, and shows as a tooltip) */}
                  <OsLogo platform={p} />
                </button>
              ))}
            </div>
            {/* The drawing is the same in every language (left to right); remounted per platform to restart it */}
            <div key={platform} className={`stage stage--${platform}`} dir="ltr" aria-hidden="true">
              <Scene platform={platform} />
            </div>
            {/* The steps, one at a time: only the step the scene is showing now, so the guide stays short */}
            <ol key={`s-${platform}`} className={`guide__steps guide__steps--${steps.length}`}>
              {steps.map((s, i) => (
                <li key={i} className="guide__step" style={{ ["--i" as string]: i }}>
                  <span className="guide__n">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            {/* Which step of how many */}
            <div key={`t-${platform}`} className={`guide__ticks guide__ticks--${steps.length}`} aria-hidden="true">
              {steps.map((_, i) => (
                <span key={i} className="guide__tick" style={{ ["--i" as string]: i }} />
              ))}
            </div>
          </div>
        </div>
        <button type="button" className="pwa-guide__got" onClick={gotIt} autoFocus>
          <CheckRoundedIcon fontSize="inherit" /> {t("Got it")}
        </button>
      </div>
    </Dialog>
  );
};

export default PwaGuide;
