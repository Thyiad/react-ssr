import * as api from '@client/constants/api';
import { LOGIN_COOKIE_KEY, DEPLOY_ENV } from '@client/constants/index';
import { getBizOrigin } from '@client/utils/common';
import axios from '@client/utils/axios';
import { dmCookie, dmTools, dmUrl } from '@dm/utils';
import { Context } from 'koa';

/** 验证登录状态 */
export const checkLogin = (ctx?: Context) => {
    // let key = 'f9f48f4b84454dc8b0b8d4e1d0862e209743316f8c5a444d5a10af60dad73779' || accessKey;
    let key = '';
    if (dmTools.isClient()) {
        key = dmCookie.get(LOGIN_COOKIE_KEY);
    } else if (ctx) {
        key = ctx.cookies.get(LOGIN_COOKIE_KEY) || '';
    }
    if (key) {
        return axios
            .get(api.isLogin, { noToast: true, timeStamp: +new Date() }, { accessKey: key }, ctx)
            .then(() => {
                return true;
            })
            .catch(() => {
                return false;
            });
    }
    return Promise.resolve(false);
};

/**
 * dm-insure 发送验证码 4位
 * @param mobilePhone 手机号
 * @param isCheckMedia 是否查询媒体
 */
export const sendSmsCode = async (mobilePhone: string, isCheckMedia = true) => {
    return axios.get(api.sendSmsCode, { mobilePhone });
};
/** dm-insure 验证验证码 4位 */
export const validateSmsCode = (
    mobilePhone: string,
    smsCode: string,
    otpOrigin?: string,
    headers?: { [key: string]: string },
) => {
    return axios.get(api.vaildateSmsCode, { mobilePhone, smsCode, otpOrigin }, headers).then((res) => {
        if (res) {
            const data: any = {
                key: LOGIN_COOKIE_KEY,
                value: res,
            };
            if (DEPLOY_ENV !== 'dev') {
                data.domain = '.zhongan.com';
            }
            dmCookie.set(data);
        }
        return res;
    });
};

/** dm-account 通用获取验证码 form提交 6位 */
export const optSendSmsCode = (mobilePhone: string) => {
    return axios.post(api.otpSendSmsCode, { phone: mobilePhone, formType: true });
};
/** dm-account 通用opt登录 form提交 6位 */
export const optValidateSmsCode = (
    mobilePhone: string,
    smsCode: string,
    bizOrigin: string = getBizOrigin(),
    ticket?: string,
): Promise<IOptResponse> => {
    return axios
        .post(api.otpValidateSmsCode, { phone: mobilePhone, smsCode, bizOrigin, ticket, formType: true })
        .then((res) => {
            if (res) {
                const data: any = {
                    key: LOGIN_COOKIE_KEY,
                    value: res.accessKey,
                };
                if (DEPLOY_ENV !== 'dev') {
                    data.domain = '.zhongan.com';
                }
                dmCookie.set(data);
            }
            return res;
        });
};

export interface IOptResponse {
    /** token */
    accessKey: string;
    /** app首登日期 */
    appFirstLogin?: number;
    /** biz */
    bizOrigin?: string;
    /** 头像 */
    headImg?: string;
    /** 名称 */
    nickName?: string;
    /** 手机号 */
    phone: string;
    /** 是否注册 */
    register?: boolean;
}
