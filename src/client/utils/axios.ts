import { Context } from 'koa';
import { BASE_NAME, DEPLOY_ENV } from '@/constants/index';
import axios, { AxiosPromise } from 'axios';
import joinUrlPath from '@/utils/joinUrlPath';
import { dmBridge, dmEnv, dmCookie, dmTools, dmUrl } from '@dm/utils';
import { Toast, Loading } from 'zarm';
import { login } from '@/utils/login';
import { getPayEnv, getAbtParamsInQuery, getBizOrigin, getUniqueBizAndSet } from '@/utils/common';

import { LOGIN_COOKIE_KEY, REQUEST_HEADER_TOKEN_NAME } from '@/constants/index';
import {
    AXIOS_CONTENT_TYPE,
    AXIOS_FORM_URLENCODED,
    SHARE_CODE,
    TEMPLATE_TYPE,
    ACTIVITY_CODE,
    PAGE_TYPE,
    UNIQUE_BIZ_KEY,
    ISEE_BIZ,
    HEADER_COOKIE_KEYS,
} from '@/constants/keyword';
import { formStringify, formParse } from '../utils/formStringify';
import { simpleStringify, jsonParse } from './stringify';
import { API_HOST } from '@client/constants/api';
import { getBaseHost } from './index';
import { getRequestChannelId } from './channelId';

export interface IResponseData<T = any> {
    /**
     * 状态码
     * @type { number }
     */
    returnCode: number;
    /**
     * 系统时间
     * @type { number }
     */
    systemTime: number;

    /**
     * 数据
     * @type { T }
     */
    result: T;

    /**
     * 消息
     * @type { string }
     */
    returnMsg: string;
}

let accesskey = '';
const axiosInterface = axios.create({
    baseURL: '/',
    timeout: 30000,
    responseType: 'json',
});
const interceptorHandlers = axios.interceptors.response as any;
if (interceptorHandlers.handlers.length === 0) {
    // 响应拦截器即异常处理
    axiosInterface.interceptors.response.use(
        (res) => {
            const response = res.data;
            if (response.errorMsg) {
                response.returnMsg = response.errorMsg;
            }
            if (response.returnCode !== 200) {
                if (response.code === '200' || response.code === 200) {
                    response.returnCode = 200;
                    delete response.code;
                } else if (response.returnCode === '0' || response.returnCode === 0) {
                    response.returnCode = 200;
                } else if (response.success === true) {
                    response.returnCode = 200;
                    delete response.success;
                } else if (response.returnCode === '200') {
                    response.returnCode = 200;
                    delete response.success;
                } else if (response.returnCode === 'success') {
                    response.returnCode = 200;
                    delete response.success;
                }
                if (dmTools.isClient()) {
                    console.warn('*'.repeat(20), '\n接口code错误', res.config.url, '\n', '*'.repeat(20));
                }
            }
            if (response.result == null) {
                /** 二组短信验证 */
                if (response.message) {
                    response.result = response.message;
                    response.returnMsg = response.message;
                    delete response.message;
                }
                if (response.value) {
                    response.result = response.value;
                    delete response.value;
                } else if (response.obj) {
                    // 兼容联系人
                    response.result = response.obj;
                    delete response.obj;
                } else if (response.data || response.data === 0) {
                    response.result = response.data;
                    delete response.data;
                } else if (response.cmsProgram) {
                    // 兼容老cms
                    response.result = response.cmsProgram;
                    delete response.cmsProgram;
                } else if (response.returnMsg) {
                    // 兼容验证短信验证码
                    response.result = response.returnMsg;
                } else if (response.status) {
                    // 兼容查询签约状态接口
                    response.result = {
                        status: response.status,
                        message: response.returnMsg,
                    };
                    delete response.status;
                }
                if (dmTools.isClient()) {
                    console.warn('*'.repeat(20), '\n接口返回值错误', res.config.url, '\n', '*'.repeat(20));
                }
            }
            if (Object.prototype.toString.call(response.result) === '[object Object]' && response.currentTime) {
                response.result.currentTime = response.currentTime;
            }
            return res;
        },
        (error) => {
            return Promise.reject(error.response);
        },
    );
    axiosInterface.interceptors.request.use((req) => {
        console.log(
            `======== server request ======== method: ${req.method} url: ${req.url} headers:${simpleStringify(
                req.headers || {},
            )} params: ${simpleStringify(req.data || req.params || {})}`,
        );
        return req;
    });
}
// const cacheAppGetToken: any[] = [];
// let isAppGetToken = false;
const getToken = (callback: () => void, ctx?: Context) => {
    if (dmTools.isClient()) {
        if (accesskey) {
            callback();
        } else if (dmEnv.isApp()) {
            // if (isAppGetToken === false) {
            // isAppGetToken = true;
            dmBridge.getZAToken().then((res) => {
                if (res.data && res.data.token) {
                    accesskey = res.data.token || '';
                    dmCookie.set({
                        key: LOGIN_COOKIE_KEY,
                        value: accesskey,
                        domain: getBaseHost(),
                    });
                }
                // cacheAppGetToken.forEach(func => func());
                // cacheAppGetToken.length = 0;
                // isAppGetToken = false;
                callback();
            });
            // } else {
            //   cacheAppGetToken.push(callback);
            // }
        } else {
            accesskey = dmCookie.get(LOGIN_COOKIE_KEY);
            callback();
            return false;
        }
    } else if (ctx) {
        accesskey = ctx.cookies.get(LOGIN_COOKIE_KEY) || '';
    } else {
        callback();
    }
};

/** 获取cookie */
const getCookie = (key: string, ctx?: Context) => {
    if (dmTools.isClient()) {
        return dmCookie.get(key);
    }
    if (ctx) {
        return ctx.cookies.get(key);
    }
    return '';
};
const getQuery = (ctx?: Context) => {
    if (ctx) {
        return ctx.query;
    }
    return dmUrl.parse();
};
/** 通过cookie设置header */
export const getCookieToHeader = async (ctx?: Context) => {
    const result: any = {};
    const abt = getAbtParamsInQuery(ctx);
    const bizOrigin = getBizOrigin(ctx);
    const channelId = getRequestChannelId(ctx);
    const uniqueBiz = getUniqueBizAndSet(ctx);
    const query = getQuery();
    HEADER_COOKIE_KEYS.forEach((key) => {
        const val = getCookie(key, ctx);
        if (val) {
            if (key !== ISEE_BIZ) {
                // result[ISEE_BIZ_REQUEST_KEY] = val;
                result[key.replace('__', '')] = val;
            }
        }
    });
    if (dmEnv.isApp()) {
        result.t = dmEnv.isIos() ? 'ios' : 'android';
    }
    if (dmEnv.isWechat()) {
        const { isWxApp } = await getPayEnv();
        if (isWxApp) {
            const appCode = dmCookie.get('appCode') || '';
            const zaMemberOpenid = dmCookie.get('zaMemberOpenid') || '';
            !!appCode && (result.appCode = appCode);
            !!zaMemberOpenid && (result.zaMemberOpenid = zaMemberOpenid);
        }
    }
    !!channelId && (result.channelId = channelId);
    // bizOrigin 和 abt
    !!bizOrigin && (result.bizOrigin = bizOrigin);
    !!uniqueBiz && (result[UNIQUE_BIZ_KEY] = uniqueBiz);
    !!abt && (result.abt = abt);
    ctx && (result['User-Agent'] = ctx.base.userAgent);
    [SHARE_CODE, TEMPLATE_TYPE, ACTIVITY_CODE, PAGE_TYPE].forEach((key) => {
        const value = query[key];
        if (value) {
            result[key] = value;
        }
    });
    return result;
};
/** 区分环境追加host */
const formatUrl = (_url: string): string => {
    let url = joinUrlPath(API_HOST, _url);
    if (/^https?:\/\//.test(_url)) {
        url = _url;
    } else if (_url.startsWith('/api/')) {
        if (DEPLOY_ENV !== 'dev') {
            url = joinUrlPath(BASE_NAME, _url);
        } else {
            url = _url;
        }
    }
    return url;
};

/*eslint-disable*/
const interceptorsResponse = <T>(
    type: 'get' | 'post',
    _url: string,
    config?: { [key: string]: any; noToast?: boolean; timeout?: number; formType?: boolean },
    headers?: { [key: string]: string },
    ctx?: Context,
): Promise<T> => {
    const send = () =>
        new Promise<T>(async (resolve, reject) => {
            let url = replaceUrlInTestEnv(_url, ctx);
            url = formatUrl(url);
            console.log('send getCookieToHeader');
            let headerCookie = await getCookieToHeader(ctx);
            console.log('send getCookieToHeader', headerCookie);
            /** 包含自定义header */
            if (headers && Object.keys(headers).length > 0) {
                headerCookie = Object.assign(headerCookie, headers);
            }
            /** form表单的content-type */
            if (config && config.formType === true) {
                headerCookie = Object.assign(headerCookie, { [AXIOS_CONTENT_TYPE]: AXIOS_FORM_URLENCODED });
            }
            axiosInterface.defaults.headers = headerCookie;
            if (dmTools.isClient()) {
                accesskey = dmCookie.get(LOGIN_COOKIE_KEY);
            } else if (ctx) {
                accesskey = ctx.cookies.get(LOGIN_COOKIE_KEY) || '';
                if (ctx.base) {
                    if (ctx.base.userAgent) {
                        axiosInterface.defaults.headers.userAgent = ctx.base.userAgent;
                    }
                    if (ctx.base.clientIp) {
                        axiosInterface.defaults.headers.clientIp = ctx.base.clientIp;
                    }
                }
            }
            if (accesskey) {
                axiosInterface.defaults.headers.accessKey = accesskey;
            }
            /** 指定接口超时时间 */
            if (config && config.timeout) {
                axiosInterface.defaults.timeout = config.timeout;
            } else {
                axiosInterface.defaults.timeout = 30000;
            }

            let req: AxiosPromise<IResponseData<T>>;
            let sendParams: any = config || {};
            if (config && config.formType === true) {
                sendParams = formStringify(config);
            }
            if (type === 'post') {
                req = axiosInterface.post<IResponseData<T>>(url, sendParams);
            } else {
                req = axiosInterface.get<IResponseData<T>>(url, sendParams);
            }
            req.then((res) => {
                const responseData = res.data;
                const { config } = res;
                let configData: { [key: string]: any } = {};
                /** 读取用户传入的参数 */
                if (
                    config.headers[AXIOS_CONTENT_TYPE] &&
                    config.headers[AXIOS_CONTENT_TYPE] === AXIOS_FORM_URLENCODED
                ) {
                    configData = formParse(config.data);
                } else {
                    configData = config.data ? jsonParse(config.data) : {};
                }
                const paramsData = config.params || {};
                if (responseData.returnCode === 200) {
                    console.log(
                        `======== server response ======== status: ${res.status} url: ${res.config.url} code: ${res.data.returnCode} returnMsg: ${res.data.returnMsg}`,
                    );
                    resolve(responseData.result);
                } else {
                    // 未登录(排除isLogin的url)
                    if (dmTools.isClient()) {
                        if (
                            responseData.returnCode === 401 &&
                            res.config.url &&
                            res.config.url.indexOf('/dm/user/login/check') === -1
                        ) {
                            /** 401情况下不需要直接调用登录 */
                            login({ isMustLogin: true }, () => {
                                accesskey = '';
                                getToken(() => {
                                    if (res.config.method) {
                                        if (!headers) {
                                            headers = {};
                                        }
                                        let method = res.config.method.toLocaleLowerCase();
                                        headers['Content-Type'] = 'application/json;charset=UTF-8';
                                        if (method === 'get') {
                                            fetch
                                                .get(_url, res.config.params, headers, ctx)
                                                .then((res) => resolve(res))
                                                .catch((e) => reject(e));
                                        } else if (method === 'post') {
                                            fetch
                                                .post(_url, res.config.data, headers, ctx)
                                                .then((res) => resolve(res))
                                                .catch((e) => reject(e));
                                        }
                                    } else {
                                        window.location.reload();
                                    }
                                }, ctx);
                            });
                            return;
                        }
                        if (responseData.returnMsg) {
                            if (dmTools.isClient() && configData.noToast !== true && paramsData.noToast !== true) {
                                Toast.show(responseData.returnMsg || '网络异常，请稍候重试');
                            }
                        }
                    }
                    console.error(
                        `======== error server response ======== status: ${res.status} url: ${res.config.url} code: ${responseData.returnCode} returnMsg: ${responseData.returnMsg}`,
                    );
                    reject(responseData);
                }
            }).catch((err) => {
                let noToast = false;
                if (config) {
                    noToast = config.params ? config.params.noToast : config.noToast;
                }
                if (dmTools.isClient() && noToast !== true) {
                    Toast.show('未知错误，请稍候重试');
                    Loading && Loading.hide();
                }
                if (err) {
                    console.error(
                        `======== server response error ======== status: ${err.status} url: ${err.config.url} code: ${err.data.returnCode} returnMsg: ${err.data.returnMsg}`,
                    );
                }
                reject(err);
            });
        });
    return new Promise((resolve, reject) => {
        console.log('getToken start');
        getToken(() => {
            console.log('send start');
            send()
                .then((res) => {
                    resolve(res);
                })
                .catch((e) => {
                    // console.log('send error', e);
                    return reject(e);
                });
        });
    });
};

export const resetAccessKey = () => (accesskey = '');

export const getAccessKey = () => accesskey;

export const replaceUrlInTestEnv = (url: string, ctx?: Context) => {
    let _url = url;
    const regex = /\/dmapi\/(za-assembler-service|za-dm-insure|za-beyond|dm-ad-diversion)/;
    /** 符合保险接口 */
    if (regex.test(_url)) {
        /** 开发和测试添加环境 */
        if (DEPLOY_ENV === 'dev' || DEPLOY_ENV === 'test') {
            let query: { [key: string]: string } = {};
            let curUrl = '';
            /** 调用那个测试环境的接口 */
            let testEnvIndex = '';
            if (dmTools.isClient()) {
                query = dmUrl.parse();
                curUrl = window.location.href;
            } else if (ctx) {
                query = ctx.query;
                curUrl = ctx.base.href;
            }
            /** 支持query参数 */
            if (query.testIndex) {
                testEnvIndex = query.testIndex;
            } else {
                /** url中获取test环境 */
                const getTestEnvRegex = /https?:\/\/(?:a|m|wx)[-.]i?(test\d)\.zhongan\.com/;
                const envResult = getTestEnvRegex.exec(curUrl);
                if (envResult) {
                    testEnvIndex = envResult[1];
                }
            }
            if (testEnvIndex) {
                /** 替换当前网关地址 */
                const replaceEnvRegex = /\/(dmapi|appapi)\/(.*?)\/.*?/;
                _url = _url.replace(replaceEnvRegex, (_, route, appName) => `/${route}/${appName}-${testEnvIndex}/`);
            }
        }
        /** uat和prd替换契约名称 */
        if (DEPLOY_ENV === 'pre' || DEPLOY_ENV === 'prd') {
            /** 替换dmapiv2的正则 */
            _url = _url.replace(regex, (_, $2) => `/dmapiv2/${$2}`);
        }
    }
    return _url;
};

const fetch = {
    get<T = any>(
        url: string,
        config?: { [key: string]: any; noToast?: boolean; timeout?: number; formType?: boolean },
        headers?: { [key: string]: string },
        ctx?: Context,
    ): Promise<T> {
        return interceptorsResponse('get', url, { params: config }, headers, ctx);
    },
    post<T = any>(
        url: string,
        config?: { [key: string]: any; noToast?: boolean; timeout?: number; formType?: boolean },
        headers?: { [key: string]: string },
        ctx?: Context,
    ): Promise<T> {
        return interceptorsResponse('post', url, config, headers, ctx);
    },
};
export default fetch;
