/**
 * What the panel tells this page, in `window.__HIDDIFY__` (put first in <head> when the panel serves a custom user
 * page from its `user_page_url` setting). See "Custom user page" in the README.
 *
 * When it is missing (the panel's built-in page, or `vite dev`), everything falls back to the page's own URL:
 * https://<domain>/<proxy_path>/<uuid>/
 */
export type HiddifyContract = {
  version: string;
  proxy_path: string;
  uuid: string;
  /** the user's page: /<proxy_path>/<uuid>/ */
  page_base: string;
  /** the user API: /<proxy_path>/<uuid>/api/v2/user/ */
  api_base: string;
  /** the panel's static files: /<proxy_path>/static/ */
  static_base: string;
  /** the subscription link to import into an app */
  profile_url: string;
  deep_link: string;
  lang: string;
  brand_title: string;
};

declare global {
  interface Window {
    __HIDDIFY__?: Partial<HiddifyContract>;
  }
}

export const hiddify = (): Partial<HiddifyContract> => (typeof window !== 'undefined' && window.__HIDDIFY__) || {};

/** https://<domain>/<proxy_path> */
export const proxyRoot = (): string => {
  const { proxy_path } = hiddify();
  if (proxy_path) return `${window.location.origin}/${proxy_path}`;
  return window.location.href.split('/').slice(0, 4).join('/');
};

/** The user API, ending with "/". */
export const apiBase = (): string => hiddify().api_base || `${proxyRoot()}/api/v2/user/`;
