import { initImplements, thyCookie, thyEnv } from '@thyiad/util';
import { LOGIN_COOKIE_KEY, REQUEST_HEADER_TOKEN_NAME } from '@/constants/index';
import { LOGIN_PATHNAME } from '@/constants/url';
import rootRoutes from '../route';
import { matchPath } from 'react-router-dom';
import { Modal, Loading, Toast } from 'zarm';
import { UITypes } from '@thyiad/util';
import { ReactNode } from 'react';

/**
 * 顶部加载中提示，不阻塞操作
 * @param msg 提示内容
 */
// @ts-ignore
const msgLoading = (msg: string) => Loading.show();

/**
 * toast消息
 * @param msg 需要toast的消息内容
 * @param type 类型：success, warning, error, info, loading，默认success
 */
const toast = (msg: string, type: UITypes = UITypes.success) => {
    Toast.show(msg);
};

/**
 * 右上角通知消息
 * @param msg 通知标题
 * @param subMsg 通知描述
 * @param type 类型：success, warning, error, info，默认 success
 */
const notify = (msg: string, subMsg = '', type: UITypes = UITypes.success) => {
    Toast.show(msg);
};

/**
 * alert 消息框
 * @param msg alert 的 消息内容
 * @param type 类型：info, success, warning, error，默认 info
 * @param content 弹窗内容
 * @param cb 确认回调
 */
const alert = (msg: string, type: UITypes = UITypes.success, content: string | ReactNode = '', cb?: () => void) => {
    Modal.alert({
        title: msg,
        content: content,
        okText: '确认',
        onOk: () => {
            cb && cb();
        },
    });
};

/**
 * 确认弹窗
 * @param msg 提示消息
 * @param ok 确认回调
 * @param cancel 取消回调
 */
const confirm = (msg: string, ok?: () => void, cancel?: () => void, content?: string) => {
    Modal.confirm({
        title: msg,
        content,
        okText: '确认',
        cancelText: '取消',
        onOk() {
            if (ok) {
                ok();
            }
        },
        onCancel() {
            if (cancel) {
                cancel();
            }
        },
    });
};

export const initThyiadUtil = () => {
    initImplements({
        ui: {
            msgLoading,
            toast,
            alert,
            confirm,
        },
        req: {
            loginCookeyKey: LOGIN_COOKIE_KEY,
            tokenHeaderName: REQUEST_HEADER_TOKEN_NAME,
            ajaxStatus: {
                success: 2000,
                error: 3000,
                expired: 4000,
            },
            ajaxData: {
                code: 'code',
                msg: 'msg',
                data: 'data',
            },
            logout: logout,
        },
    });
};

/**
 * 通过pathname检索对应路由
 * @param pathname
 */
export const getMatchRoute = (pathname?: string, routes?: RouteProps[]): any => {
    if (!pathname) {
        pathname = thyEnv.canUseWindow() ? window.location.pathname : '';
    }
    routes = routes || rootRoutes;
    const findedRoute = routes?.find((route) => matchPath(pathname || '', route));
    if (!findedRoute || !findedRoute.routes) {
        return findedRoute;
    }

    const nextFindedRoute = getMatchRoute(pathname, findedRoute.routes);
    return nextFindedRoute || findedRoute;
};

/**
 * 退出登录
 */
export const logout = (): void => {
    thyCookie.remove(LOGIN_COOKIE_KEY);
    window.location.href = `${LOGIN_PATHNAME}?target=${encodeURIComponent(window.location.href)}`;
};
