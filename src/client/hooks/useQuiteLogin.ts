import { dmEnv, dmCookie, dmTools } from '@dm/utils';
import { useEffect } from 'react';
import { DEPLOY_ENV } from '@client/constants/index';
import { jump } from '@client/utils/common';
import { useRedux } from './useRedux';

/**
 * 微信h5静默登录
 */
export const useQuitLogin = () => {
    const { state } = useRedux();

    useEffect(() => {
        if (!dmTools.isClient()) {
            return;
        }
        if (state.isSearchLoginStatus || state.isLogin) {
            return;
        }
        // 未登录、并且是微信浏览器环境，静默登录
        if (dmEnv.isWechat() && !dmEnv.isInMinProgram()) {
            let env: any = DEPLOY_ENV;
            if (env === 'pre') {
                env = 'uat';
            }
            const curUrl = encodeURIComponent(window.location.href);
            if (
                !dmCookie.get('zaLoginCookieKey') &&
                !dmCookie.get('dmAccountTicket') &&
                !dmCookie.get('dmNoRedirect')
            ) {
                const quiteLoginUrl = `https://gwbk.zhongan.com/appapi/dm-account/wechat/quietauthorize?env=${env}&channel=8&url=${curUrl}`;
                jump(quiteLoginUrl, true);
            } else if (!dmCookie.get('zaLoginCookieKey') && !dmCookie.get('dmAccountTicket')) {
                const quiteLoginUrl = `https://gwbk.zhongan.com/appapi/dm-account/wechat/authorize?env=${env}&channel=8&url=${curUrl}`;
                jump(quiteLoginUrl, true);
            }
        }
    }, [state.isSearchLoginStatus, state.isLogin]);
};
