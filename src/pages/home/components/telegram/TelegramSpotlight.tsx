import { useTranslation } from "react-i18next";
import Dialog from "@mui/material/Dialog";
import "./TelegramSpotlight.css";

/**
 * "Connect to Telegram" spotlight, the first thing a user sees while their account is not linked to the panel's
 * bot: a looping animation of the bot — it sends the account (traffic, days left) and opens the user panel —
 * then "Connect to Telegram" (opens the bot) or "Later".
 */
type Props = { open: boolean; botUrl: string; onClose: () => void };

const TelegramSpotlight = ({ open, botUrl, onClose }: Props) => {
  const { t, i18n } = useTranslation();

  function connect() {
    window.open(botUrl, "_blank", "noopener");
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ className: "tg-spot-paper" }} dir={i18n.language === "fa" ? "rtl" : "ltr"}>
      <div className="tg-spot">
        <div className="tg-spot__hero">
          <span className="tg-spot__logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="26" height="26"><path fill="currentColor" d="M9.04 15.6 8.9 19.5c.4 0 .58-.17.8-.38l1.9-1.82 3.94 2.88c.72.4 1.24.19 1.43-.67l2.6-12.2c.25-1.1-.4-1.53-1.1-1.27L3.2 11.9c-1.05.41-1.04 1-.18 1.27l3.9 1.22 9.05-5.7c.43-.28.82-.13.5.15"/></svg>
          </span>
          <h2>{t("Connect to the Hiddify Telegram bot")}</h2>
          <p>{t("Get your account details in Telegram, and open your user panel from there in one tap.")}</p>
        </div>

        {/* The drawing is the same in every language: a Telegram chat with the bot */}
        <div className="tg-stage" dir="ltr" aria-hidden="true">
          <div className="tg-phone">
            <div className="tg-head"><span className="tg-head__avatar" /><span className="tg-head__name">Hiddify bot</span></div>
            <div className="tg-chat">
              <div className="tg-msg tg-msg--me tg-start">/start</div>
              <div className="tg-msg tg-msg--bot tg-card">
                <b>👋 Hi!</b>
                <span className="tg-card__row">📊 15 GB / 50 GB<span className="tg-bar"><i /></span></span>
                <span className="tg-card__row">⏳ 30 days</span>
                <span className="tg-card__btn tg-open">🌐 User panel</span>
              </div>
            </div>
            <div className="tg-panel">
              <span className="tg-panel__logo" />
              <span className="tg-panel__bar" />
              <span className="tg-panel__ring" />
            </div>
          </div>
          <span className="tg-finger">●</span>
        </div>

        <ol className="tg-steps">
          <li style={{ ["--i" as string]: 0 }}><span>1</span>{t("Tap “Connect to Telegram” and press Start in the bot")}</li>
          <li style={{ ["--i" as string]: 1 }}><span>2</span>{t("The bot shows your account: traffic and days left")}</li>
          <li style={{ ["--i" as string]: 2 }}><span>3</span>{t("Open your user panel from the bot at any time")}</li>
        </ol>

        <button type="button" className="tg-spot__connect" onClick={connect} autoFocus>
          {t("Connect To Telegram")}
        </button>
        <button type="button" className="tg-spot__later" onClick={onClose}>
          {t("Later")}
        </button>
      </div>
    </Dialog>
  );
};

export default TelegramSpotlight;
