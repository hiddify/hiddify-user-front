
export const getCurrentUrl = (uid: boolean = true) => {
    const currentUrl = window.location.href.split('/')
    const mainUrl = currentUrl.slice(0, uid ? 5 : 4).join('/')
    return mainUrl;
}