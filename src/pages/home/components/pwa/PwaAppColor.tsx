import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Popover from "@mui/material/Popover";
import Grow from "@mui/material/Grow";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import { HEX, PRESETS, isLight } from "./appIcon";
import "./PwaAppColor.css";

/**
 * "App Color": a button that opens a small window to choose the color of the app icon: the same 25 ready colors as
 * the admin panel's, or one's own. The dot on the button is the color chosen now.
 */
const PwaAppColor = ({ color, onChoose, rtl }: { color: string; onChoose: (c: string) => void; rtl: boolean }) => {
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  /** What the controls show: the chosen color, or the one being picked. */
  const [live, setLive] = useState(color);
  const [typed, setTyped] = useState(color);
  const [own, setOwn] = useState(false);
  const timer = useRef(0);
  const made = !PRESETS.includes(live);
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function pick(c: string) {
    window.clearTimeout(timer.current);
    setLive(c);
    setTyped(c);
    onChoose(c);
  }
  // The icon is drawn by the panel: while the picker is dragged, ask for it only when the pointer rests.
  function soon(c: string) {
    setLive(c);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => onChoose(c), 140);
  }
  function fromPicker(value: string) {
    const c = value.replace("#", "").toUpperCase();
    if (!HEX.test(c) || c === live) return;
    setTyped(c);
    soon(c);
  }
  function fromText(value: string) {
    const c = value.replace(/[^0-9a-f]/gi, "").toUpperCase().slice(0, 6);
    setTyped(c);
    if (HEX.test(c) && c !== live) soon(c);
  }

  return (
    <>
      <button type="button" className="app-color__button" aria-haspopup="dialog" aria-expanded={!!anchor} onClick={(e) => setAnchor(anchor ? null : e.currentTarget)}>
        <span className="app-color__dot" style={{ ["--swatch" as string]: `#${live}` }} aria-hidden="true" />
        <span>{t("App Color")}</span>
        <ExpandMoreRoundedIcon className={`app-color__caret${anchor ? " app-color__caret--up" : ""}`} fontSize="inherit" aria-hidden="true" />
      </button>
      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={Grow}
        transitionDuration={{ enter: 500, exit: 240 }}
        slotProps={{ paper: { className: "app-color-pop", dir: rtl ? "rtl" : "ltr" } }}
      >
        <section className="icon-colors">
          <div className="icon-colors__head">
            <span className="icon-colors__label">{t("Icon color")}</span>
            <span className="icon-colors__code" dir="ltr">
              #{live}
            </span>
          </div>
          <div className="icon-colors__grid" role="radiogroup" aria-label={t("Icon color")}>
            {PRESETS.map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={c === live}
                aria-label={`#${c}`}
                className={`icon-colors__swatch${c === live ? " icon-colors__swatch--on" : ""}${isLight(c) ? " icon-colors__swatch--light" : ""}`}
                style={{ ["--swatch" as string]: `#${c}` }}
                onClick={() => pick(c)}
              >
                {c === live && <CheckRoundedIcon fontSize="inherit" />}
              </button>
            ))}
            {/* Your own color: the last tile opens the picker; it takes that color once one is made */}
            <button
              type="button"
              aria-expanded={own}
              aria-label={t("Your own color")}
              className={`icon-colors__swatch icon-colors__swatch--own${made ? " icon-colors__swatch--on icon-colors__swatch--made" : ""}${made && isLight(live) ? " icon-colors__swatch--light" : ""}`}
              style={made ? { ["--swatch" as string]: `#${live}` } : undefined}
              onClick={() => setOwn(!own)}
            >
              {made ? <CheckRoundedIcon fontSize="inherit" /> : <AddRoundedIcon fontSize="inherit" />}
            </button>
          </div>
          <div className={`icon-colors__own${own ? " icon-colors__own--open" : ""}`}>
            <div className="icon-colors__own-in">
              <label className="icon-colors__own-label" htmlFor="pwa-icon-hex">
                {t("Your own color")}
              </label>
              <span className="icon-colors__own-fields" dir="ltr">
                <input type="color" className="icon-colors__picker" value={`#${live.toLowerCase()}`} onChange={(e) => fromPicker(e.target.value)} aria-label={t("Your own color")} tabIndex={own ? 0 : -1} />
                <span className="icon-colors__hex">
                  <span>#</span>
                  <input
                    id="pwa-icon-hex"
                    value={typed}
                    maxLength={6}
                    spellCheck={false}
                    autoComplete="off"
                    autoCapitalize="characters"
                    aria-invalid={typed.length > 0 && !HEX.test(typed)}
                    onChange={(e) => fromText(e.target.value)}
                    onBlur={() => setTyped(live)}
                    tabIndex={own ? 0 : -1}
                  />
                </span>
              </span>
            </div>
          </div>
          {ios && <small className="icon-colors__hint">{t("Choose it before you install: an iPhone keeps the icon it was installed with.")}</small>}
        </section>
      </Popover>
    </>
  );
};

export default PwaAppColor;
