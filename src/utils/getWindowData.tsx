/* eslint-disable @typescript-eslint/ban-ts-comment */
import { hiddify } from './hiddify';

type windowDataTypes = {
    appVersion: string;
    deepLink: string;
}

export const getWindowData = (): windowDataTypes => {
    const { version, deep_link } = hiddify()

    //@ts-ignore
    const appVersion: string = version || window.appVersion;

    //@ts-ignore
    const deepLink: string = deep_link || window.deepLink;

    return { deepLink, appVersion }
}
