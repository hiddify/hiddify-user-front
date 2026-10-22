import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import "./PwaGuide.css";

/**
 * "Install as an app" spotlight on the home page: a looping animation of the browser's own controls — Safari on
 * iPhone / iPad, Chrome on Android, Chrome on a computer — then "Got it" and "Do not show this again".
 * Shown once: until "Got it" (or closing it), and only when `enabled` — the user has linked Telegram, or the panel
 * has no bot (MainBody: the Telegram spotlight comes first). Never when the panel already runs as the installed app.
 * The same guide as admin_v2's PwaInstallDialog / PwaInstallGuide.
 */
type Platform = "ios" | "android" | "desktop";

const DISMISS_KEY = "hiddify.user.pwaGuide.dismissed";

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
function dismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

const PLATFORMS: Platform[] = ["ios", "android", "desktop"];

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
          <div className="ios-add__app"><span className="app-icon" /><span className="page__bar" /></div>
        </div>
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
          <div className="and-dialog__app"><span className="app-icon" /><span className="page__bar" /></div>
          <div className="and-dialog__btns"><span>Cancel</span><span className="and-dialog__ok hit-3">Install</span></div>
        </div>
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
        <div className="win-pop__app"><span className="app-icon" /><span className="page__bar" /></div>
        <div className="win-pop__btns"><span className="win-pop__ok hit-2">Install</span><span>Cancel</span></div>
      </div>
      <div className="win-app">
        <div className="win-app__title"><span className="app-icon app-icon--tiny" /><span className="page__bar" /></div>
        <div className="page"><span className="page__bar page__bar--wide" /><span className="page__card" /></div>
      </div>
      <span className="cursor">➚</span>
    </div>
  );
};

const PwaGuide = ({ enabled }: { enabled: boolean }) => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [detected] = useState<Platform>(detectPlatform);
  const [platform, setPlatform] = useState<Platform>(detected);

  useEffect(() => {
    if (!enabled || dismissed() || isStandalone()) return;
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
  const tab = (p: Platform) => (p === "ios" ? "iPhone · Safari" : p === "android" ? "Android · Chrome" : `${detected === "desktop" ? desktopOsName() : t("Computer")} · Chrome`);

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
    <Dialog open={open} onClose={gotIt} PaperProps={{ className: "pwa-guide-paper" }} dir={i18n.language === "fa" ? "rtl" : "ltr"}>
      <div className="pwa-guide">
        <div className="pwa-guide__hero">
          <h2>{t("Install the panel as an app")}</h2>
          <p>{t("Keep the panel one tap away, like any app on your phone or computer.")}</p>
        </div>
        <div className="guide">
          <div className="guide__tabs" role="tablist" aria-label={t("Your device")}>
            {PLATFORMS.map((p) => (
              <button key={p} type="button" role="tab" aria-selected={platform === p} className={`guide__tab${platform === p ? " guide__tab--on" : ""}`} onClick={() => setPlatform(p)}>
                {tab(p)}
              </button>
            ))}
          </div>
          {/* The drawing is the same in every language (left to right); remounted per platform to restart it */}
          <div key={platform} className={`stage stage--${platform}`} dir="ltr" aria-hidden="true">
            <Scene platform={platform} />
          </div>
          <ol key={`s-${platform}`} className={`guide__steps guide__steps--${steps.length}`}>
            {steps.map((s, i) => (
              <li key={i} className="guide__step" style={{ ["--i" as string]: i }}>
                <span className="guide__n">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
        <button type="button" className="pwa-guide__got" onClick={gotIt} autoFocus>
          ✓ {t("Got it")}
        </button>
      </div>
    </Dialog>
  );
};

export default PwaGuide;
