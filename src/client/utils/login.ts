// import dmSSO from '@dm/sso';
import { dmBridge, dmCookie, dmEnv, dmTools, dmUrl, MinProgramInterfaceType } from '@dm/utils';
import { resetAccessKey } from '@client/utils/axios';
import { checkLogin } from '@client/models/User';
import { BIZ_ORIGIN, SSO_ENV_MAPPING } from '@client/constants/keyword';
import { DEPLOY_ENV, LOGIN_COOKIE_KEY } from '@client/constants/index';
import DmSSO, { SSOMode, SSOEnv } from '@dm/sso';

let sso: DmSSO = null;

type MinProgramsJumpType = 'navigateTo' | 'redirectTo';

export const getMinProgramsLogin = (
    callback?: () => Promise<void | boolean>,
    link?: string,
    jumpType: MinProgramsJumpType = 'navigateTo',
) => {
    const bizOrigin = dmUrl.parse()[BIZ_ORIGIN] || dmCookie.get(BIZ_ORIGIN);

    const redirectUrl = link || window.location.href;
    if (dmEnv.isWechat()) {
        return dmTools
            .getMinProgramsInterface()
            .then(async (res) => {
                console.log('微信环境', res);
                if (res) {
                    // 小程序环境
                    if (res.minProgramsType === MinProgramInterfaceType.Wechat) {
                        if (dmCookie.get('zaLoginCookieKey') && dmCookie.get('zaMemberOpenid')) {
                            return callback && callback();
                        }
                        res.miniProgram[jumpType]({
                            url: `/pages/main/webview/index?needLogin=1&notLogin=true&bizOrigin=${bizOrigin}&skipUrl=${encodeURIComponent(
                                redirectUrl,
                            )})`,
                        });
                        return;
                    }
                    return callback && callback();
                }

                return callback && callback();
            })
            .catch(() => {
                return callback && callback();
            });
    }

    if (dmCookie.get('zaLoginCookieKey')) return callback && callback();

    if (dmEnv.isToutiaoSeriesMinProgram()) {
        return dmTools
            .getMinProgramsInterface()
            .then((res) => {
                console.log('头条系小程序环境', res);
                if (res) {
                    return res.miniProgram.navigateTo({
                        url: `/pages/main/login/index?bizOrigin=${bizOrigin}&redirectUrl=${encodeURIComponent(
                            redirectUrl,
                        )}`,
                    });
                }
                return callback && callback();
            })
            .catch(() => callback && callback());
    }
    return callback && callback();
};

// let timeout: any;
export const login = async (
    params: {
        link?: string;
        closeGotoUrl?: string;
        showClose?: boolean;
        isMustLogin?: boolean;
        miniAppJumpType?: MinProgramsJumpType;
    },
    callback?: () => void,
) => {
    // isMustLogin 强制走登录逻辑
    const isCheckLogin = params && params.isMustLogin === true;
    if (isCheckLogin !== true) {
        console.log('------------------免登陆------------------');
        callback && callback();
        return true;
    }
    const callbackHandle = () => {
        resetAccessKey();
        callback && callback();
    };
    if (sso === null) {
        sso = new DmSSO({
            type: 1, // 0,默认密码登录，默认OTP登录
            mode: SSOMode.MULTI, // 有无tab,multi,single
            color: '#13c8a1', // 更换主色调，默认众安绿色：#13c8a1
            env: SSO_ENV_MAPPING[DEPLOY_ENV] as SSOEnv,
            showClose: !(params && params.showClose === false),
            // closeCallback() {
            //   timeout = setTimeout(() => {
            //     if (params && params.closeGotoUrl) {
            //       window.location.replace(params.closeGotoUrl);
            //     } else {
            //       onClose && onClose();
            //     }
            //   }, 1000);
            // },
            loginCallback(_, res) {
                if (DEPLOY_ENV === 'dev') {
                    if (res.accessKey) {
                        dmCookie.set(LOGIN_COOKIE_KEY, res.accessKey, 60 * 30);
                    }
                }
                // clearTimeout(timeout);
                callbackHandle();
            },
        });
    }
    const isLogin = await checkLogin();
    if (isLogin === true) {
        callbackHandle();
        return true;
    }
    const link = params ? params.link || window.location.href : window.location.href;
    if (dmEnv.isApp()) {
        dmBridge.login('dm').then(() => {
            dmBridge.getZAToken().then((res) => {
                if (res.status === '1' && res.data.token) {
                    const accesskey = res.data.token || '';
                    dmCookie.set({
                        key: LOGIN_COOKIE_KEY,
                        value: accesskey,
                        domain: '.zhongan.com',
                    });
                    callbackHandle();
                }
            });
        });
    } else {
        dmTools.getMinProgramsInterface().then((res) => {
            if (res) {
                getMinProgramsLogin(callback as any, link, params ? params.miniAppJumpType : undefined);
            } else {
                sso.pop();
            }
        });
    }
};
