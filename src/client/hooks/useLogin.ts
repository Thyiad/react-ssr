import { login } from '@client/utils/login';
import { useEffect, useCallback } from 'react';
import { useRedux } from './useRedux';
import { checkLogin } from '@client/models/User';
import useAsync from 'react-use/lib/useAsync';

/**
 * 检测是否登录，并且存到全局数据中
 */
export const useLoginFn = () => {
    const { actions } = useRedux();
    const loginStatus = useAsync(() => {
        actions.global.setKeyValue('isSearchLoginStatus', true);
        return checkLogin();
    }, []);

    useEffect(() => {
        if (loginStatus.loading) {
            return;
        }
        if (loginStatus.value) {
            actions.global.setLoginStatus(true);
        } else {
            actions.global.setKeyValue('isSearchLoginStatus', false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loginStatus]);
};
