import { hiddify, proxyRoot } from './hiddify';

/** https://<domain>/<proxy_path>/<uuid> (or, with uid = false, https://<domain>/<proxy_path>) */
export const getCurrentUrl = (uid: boolean = true) => {
    const { page_base } = hiddify()
    if (page_base) return uid ? window.location.origin + page_base.replace(/\/$/, '') : proxyRoot()
    const currentUrl = window.location.href.split('/')
    const mainUrl = currentUrl.slice(0, uid ? 5 : 4).join('/')
    return mainUrl;
}
