import {
    ABT_QUERY_KEY,
    BIZ_ORIGIN,
    BIZ_ORIGIN_MAPPING,
    UNIQUE_BIZ_KEY,
    BODY_CLASS_NAME,
} from '@client/constants/keyword';
import { dmTools, dmUrl, dmCookie, dmStorage, dmEnv, dmBridge } from '@dm/utils';
import { Context } from 'koa';
import { ChannelIdEnum } from '@/types/enum';
import { DEPLOY_ENV } from '@client/constants';
import { getRequestChannelId } from './channelId';

/** 获取支付环境 */
export const getPayEnv = async () => {
    let minProgramInstance;
    // 获取支付环境
    try {
        minProgramInstance = (await dmTools.getMinProgramsInterface()) || {};
    } catch (e) {
        minProgramInstance = {
            minProgramsType: undefined,
        };
    }
    // 微信小程序
    const isWxApp = minProgramInstance.minProgramsType === 1;
    // 百度小程序
    const isBaiduApp = minProgramInstance.minProgramsType === 2;
    // 非小程序
    const isNotMiniProgram = !isWxApp && !isBaiduApp;
    return {
        minProgramInstance,
        isWxApp,
        isBaiduApp,
        isNotMiniProgram,
    };
};

/** 在url中获取abt参数 */
export const getAbtParamsInQuery = (ctx?: Context) => {
    if (dmTools.isClient()) {
        const parse = dmUrl.parse();
        return parse[ABT_QUERY_KEY] || dmCookie.get(ABT_QUERY_KEY) || '';
    }
    if (ctx) {
        return ctx.query[ABT_QUERY_KEY] || '';
    }
    return '';
};

/** 获取bizOrigin */
export const getBizOrigin = (serverContext?: Context) => {
    const ctx = serverContext;
    const key = BIZ_ORIGIN;
    if (ctx) {
        const { query } = ctx;
        const biz = query[key] || ctx.cookies.get(BIZ_ORIGIN);
        if (biz) {
            return biz;
        }
    } else {
        const parse = dmUrl.parse();
        const biz = parse[key] || dmCookie.get(BIZ_ORIGIN);
        if (biz) {
            return biz;
        }
    }

    return BIZ_ORIGIN_MAPPING[getRequestChannelId(ctx)];
};

export const getUniqueBizAndSet = (serverContext?: Context) => {
    const ctx = serverContext;
    const key = UNIQUE_BIZ_KEY;
    const query = ctx ? ctx.query : dmUrl.parse();
    const bizValue = query[key];
    if (bizValue) {
        dmStorage.session.set(key, bizValue);
    }
    return bizValue || dmStorage.session.get(key) || '';
};

/** 是否iPhoneX，Xs，Xs max */
export const judgeDeviceIphoneX = () => {
    if (dmEnv.isIos()) {
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

    if (dmEnv.isIos()) {
        classnameArr.push(BODY_CLASS_NAME.ios);
        if (judgeDeviceIphoneX()) {
            classnameArr.push(BODY_CLASS_NAME.iphonex);
        }
    }

    document.body.className = classnameArr.filter((item) => item).join(' ');
};

/** 日期格式化 */
export const dateFormat = (dateFrom: number | string, format = 'yyyy-MM-dd hh:mm:ss') => {
    if (dateFrom === 0 || dateFrom === '') {
        return '';
    }
    if (Object.prototype.toString.call(dateFrom) === '[object String]') {
        dateFrom = dateFrom.toString().replace(/-/g, '/');
    }
    const date = new Date(dateFrom);
    const o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds(), // 毫秒
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length));
    }
    Object.keys(o).forEach((k) => {
        if (new RegExp(`(${k})`).test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length));
        }
    });
    return format;
};

export const getUserAgent = (ctx?: Context): string => {
    if (ctx) {
        return (ctx.header['user-agent'] || '').toLowerCase();
    } else if (dmTools.isClient()) {
        return window.navigator.userAgent.toLowerCase();
    } else {
        return '';
    }
};

export const pageBack = () => {
    const curHref = window.location.href;
    window.history.back();
    if (dmEnv.isApp()) {
        setTimeout(() => {
            const needCloseWebView = window.location.href === curHref;
            if (needCloseWebView) {
                dmBridge.closeWebView();
            }
        }, 300);
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
    return new Promise((resolve) => {
        const el = document.createElement('script') as any;
        el.src = url;
        // eslint-disable-next-line func-names
        el.onload = el.onerror = el.onreadystatechange = function () {
            const rs = this.readyState;
            if (!rs || rs === 'complete' || rs === 'loaded') {
                resolve();
            }
        };
        document.body.appendChild(el);
    });
};

export const jump = (_url, isReplace = false) => {
    if (_url == null || _url == '') {
        return;
    }

    const url = _url;

    if ((url.startsWith('/') || url.startsWith('http:') || url.startsWith('https:')) && dmEnv.isApp()) {
        dmBridge.buildPromiseFunc('resetNavigationBar', {
            resetArray: ['titleText', 'titleColor', 'rightButton', 'rightMenu'],
        });
        dmBridge.buildPromiseFunc('setStatusBarStyle', {
            statusBgColor: '#000000',
            statusTextStyle: 'light',
        });
    }

    if (isReplace) {
        window.location.replace(url);
    } else {
        window.location.href = url;
    }
};
