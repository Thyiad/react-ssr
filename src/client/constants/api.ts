import { DEPLOY_ENV } from './index';

const gwHostDic: HostDicType = {
    dev: 'https://mgw-daily.zhongan.com',
    test: 'https://mgw-daily.zhongan.com',
    pre: 'https://gwbk-uat.zhongan.com',
    prd: 'https://gwbk.zhongan.com',
};
const dmHostDic: HostDicType = {
    dev: 'https://dm-test.zhongan.com',
    test: 'https://dm-test.zhongan.com',
    pre: 'https://dm-uat.zhongan.com',
    prd: 'https://dm.zhongan.com',
};
const hjHostDic: HostDicType = {
    dev: 'https://hj-test.zhongan.com',
    test: 'https://hj-test.zhongan.com',
    pre: 'https://hj-uat.zhongan.com',
    prd: 'https://hj.zhongan.com',
};
const evtHostDic: HostDicType = {
    dev: 'https://evt-test3.zhongan.com',
    test: 'https://evt-test3.zhongan.com',
    pre: 'https://evt-uat.zhongan.com',
    prd: 'https://evt.zhongan.com',
};
export const HOST_GW = gwHostDic[DEPLOY_ENV];
export const HOST_DM = dmHostDic[DEPLOY_ENV];
export const HOST_HJ = hjHostDic[DEPLOY_ENV];
export const HOST_EVT = evtHostDic[DEPLOY_ENV];

/** 是否登录 */
export const isLogin = '/dmapi/za-dm-insure/dm/user/login/check';
/** dm-insure 发送验证码 4位 */
export const sendSmsCode = '/dmapi/za-dm-insure/dm/user/sendSMGCode';
/** dm-insure 效验验证码 4位 */
export const vaildateSmsCode = '/dmapi/za-dm-insure/dm/user/validateOtpAccount';
/** dm-account 通用获取验证码 6位 */
export const otpSendSmsCode = '/appapi/dm-account/otp/sendSmsCode';
/** dm-account 通用opt登录，6位 */
export const otpValidateSmsCode = '/appapi/dm-account/otp/registerAndLogin';
/**  获取cms资源 */
export const getCmsSource = '/appapi/za-mars-api/cms-getResourceContentByResourceCode';
