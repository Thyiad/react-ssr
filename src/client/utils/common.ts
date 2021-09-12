import { BODY_CLASS_NAME } from '@/constants/keyword';
import { thyEnv } from '@thyiad/util';
import { Context } from 'koa';

/** 是否iPhoneX，Xs，Xs max */
export const judgeDeviceIphoneX = () => {
    if (thyEnv.isIos()) {
        if (
            (window.screen.availHeight === 812 && window.screen.availWidth === 375) ||
            (window.screen.availHeight === 896 && window.screen.availWidth === 414)
        ) {
            return true;
        }
        return false;
    }
    return false;
};

/** 添加全局class */
export const addGlobalClassName = () => {
    const oBody = document.body;
    const classnameArr = [oBody.className];

    if (thyEnv.isIos()) {
        classnameArr.push(BODY_CLASS_NAME.ios);
        if (judgeDeviceIphoneX()) {
            classnameArr.push(BODY_CLASS_NAME.iphonex);
        }
    }

    document.body.className = classnameArr.filter((item) => item).join(' ');
};

export const getUserAgent = (ctx?: Context): string => {
    if (ctx) {
        return (ctx.header['user-agent'] || '').toLowerCase();
    } else if (thyEnv.canUseWindow()) {
        return window.navigator.userAgent.toLowerCase();
    } else {
        return '';
    }
};

export const loadScript = (url) => {
    if (!url) {
        return Promise.reject();
    }
    const scriptList = document.getElementsByTagName('script');
    if (scriptList) {
        const isExist = Array.from(scriptList).find((item) => item.src.indexOf(url) > -1);
        if (isExist) {
            return Promise.resolve();
        }
    }
    return new Promise<void>((resolve) => {
        const el = document.createElement('script') as any;
        el.src = url;
        // eslint-disable-next-line func-names
        el.onload =
            el.onerror =
            el.onreadystatechange =
                function () {
                    const rs = this.readyState;
                    if (!rs || rs === 'complete' || rs === 'loaded') {
                        resolve();
                    }
                };
        document.body.appendChild(el);
    });
};
