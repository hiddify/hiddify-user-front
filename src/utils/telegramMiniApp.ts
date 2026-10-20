/**
 * When the page is opened as a Telegram Mini App (the bot's "My page" button or menu button), fit into Telegram:
 * full height, header and background in the page's colours, and no swipe-to-close while scrolling.
 *
 * Telegram adds `tgWebAppData` to the URL hash; only then is Telegram's script loaded, so the normal page (and
 * networks where telegram.org is blocked) never waits for it.
 */

interface TelegramWebApp {
  initData: string
  version: string
  ready(): void
  expand(): void
  isVersionAtLeast(version: string): boolean
  setHeaderColor(color: string): void
  setBackgroundColor(color: string): void
  disableVerticalSwipes?(): void
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp }
  }
}

const SCRIPT_URL = 'https://telegram.org/js/telegram-web-app.js'

export function isTelegramMiniApp(): boolean {
  return /tgWebAppData=|tgWebAppPlatform=/.test(window.location.hash)
}

function pageColor(): string {
  const color = getComputedStyle(document.body).backgroundColor
  const rgb = color.match(/\d+/g)
  if (!rgb || color === 'transparent' || (rgb.length === 4 && rgb[3] === '0')) return '#ffffff'
  return '#' + rgb.slice(0, 3).map((v) => Number(v).toString(16).padStart(2, '0')).join('')
}

function fit(app: TelegramWebApp): void {
  app.ready()
  app.expand()
  if (app.isVersionAtLeast('6.1')) {
    const color = pageColor()
    app.setHeaderColor(color)
    app.setBackgroundColor(color)
  }
  if (app.isVersionAtLeast('7.7')) app.disableVerticalSwipes?.()
  document.documentElement.classList.add('tg-mini-app')
}

export function setupTelegramMiniApp(): void {
  if (!isTelegramMiniApp()) return
  if (window.Telegram?.WebApp) return fit(window.Telegram.WebApp)
  const script = document.createElement('script')
  script.src = SCRIPT_URL
  script.async = true
  script.onload = () => window.Telegram?.WebApp && fit(window.Telegram.WebApp)
  document.head.appendChild(script)
}
