/**
 * When the page is opened as a Telegram Mini App (the bot's "My page" button or menu button), fit into Telegram:
 * full height (full screen on a phone, Telegram 8.0+), header and background in the page's colours, and no
 * swipe-to-close while scrolling. In full screen Telegram's own buttons float over the top of the page: the page
 * keeps clear of them (the `tg-fullscreen` class and Telegram's safe-area CSS variables, index.css).
 *
 * Telegram adds `tgWebAppData` to the URL hash; only then is Telegram's script loaded, so the normal page (and
 * networks where telegram.org is blocked) never waits for it.
 */

export type HomeScreenStatus = 'unsupported' | 'unknown' | 'added' | 'missing'

export interface TelegramWebApp {
  initData: string
  version: string
  platform: string
  isFullscreen?: boolean
  ready(): void
  expand(): void
  isVersionAtLeast(version: string): boolean
  setHeaderColor(color: string): void
  setBackgroundColor(color: string): void
  disableVerticalSwipes?(): void
  requestFullscreen?(): void
  addToHomeScreen?(): void
  checkHomeScreenStatus?(callback: (status: HomeScreenStatus) => void): void
  onEvent?(event: string, handler: () => void): void
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

/** Telegram on a phone: full screen there; on a computer it would cover the whole monitor. */
function onPhone(app: TelegramWebApp): boolean {
  return app.platform === 'ios' || app.platform === 'android'
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
  if (app.isVersionAtLeast('8.0') && onPhone(app) && app.requestFullscreen) {
    const mark = () => document.documentElement.classList.toggle('tg-fullscreen', !!app.isFullscreen)
    app.onEvent?.('fullscreenChanged', mark)
    try {
      app.requestFullscreen()
    } catch {
      /* refused (an older client): the page stays as it was */
    }
    mark()
  }
  ready.forEach((fn) => fn(app))
  ready.length = 0
  loaded = app
}

let loaded: TelegramWebApp | null = null
const ready: ((app: TelegramWebApp) => void)[] = []

/** ``fn`` with Telegram's Mini App once it is set up (at once if it already is); never outside Telegram. */
export function withTelegram(fn: (app: TelegramWebApp) => void): void {
  if (!isTelegramMiniApp()) return
  if (loaded) fn(loaded)
  else ready.push(fn)
}

/** Telegram can put this page on the phone's home screen, and it is not there yet. */
export function canAddToHomeScreen(app: TelegramWebApp, answer: (yes: boolean) => void): void {
  if (!app.isVersionAtLeast('8.0') || !app.checkHomeScreenStatus || !app.addToHomeScreen) return answer(false)
  try {
    app.checkHomeScreenStatus((status) => answer(status === 'missing'))
  } catch {
    answer(false)
  }
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
