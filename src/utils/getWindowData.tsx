/* eslint-disable @typescript-eslint/ban-ts-comment */

type windowDataTypes = {
    appVersion: string;
    uuid: string;
    deepLink: string;
}

export const getWindowData = (): windowDataTypes => {
    //@ts-ignore
    const appVersion: string = window.appVersion;
    //@ts-ignore
    const uuid: string = window.userUuid;
    //@ts-ignore
    const deepLink: string = window.deepLink;

    return { deepLink, uuid, appVersion }
}