import { initImplements, thyCookie } from '@thyiad/util';
import { msgLoading, toast, alert, confirm } from './ui';
import { LOGIN_COOKIE_KEY, LOGIN_PATHNAME, TOKEN_HEADER_NAME } from '@/constant/index';
import rootRoutes from '../route';
import { matchPath } from 'react-router-dom';

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
            tokenHeaderName: TOKEN_HEADER_NAME,
            logout: logout,
        },
    });
};

/**
 * 通过pathname解析对应路由
 * 暂只支持解析到第二级
 * @param pathname
 */
export const getMatchRoute = (pathname?: string, routes?: RouteProps[]) => {
    pathname = pathname || window.location.pathname;
    routes = routes || rootRoutes;
    const findedRoute = routes?.find((route) => matchPath(window.location.pathname, route));
    if (findedRoute) {
        if (findedRoute.routes) {
            const nextFindedRoute = findedRoute.routes?.find((route) => matchPath(window.location.pathname, route));
            if (nextFindedRoute) {
                return nextFindedRoute;
            }
        }
        return findedRoute;
    }
    return null;
};

/**
 * 退出登录
 */
export const logout = (): void => {
    thyCookie.remove(LOGIN_COOKIE_KEY);
    window.location.href = `${LOGIN_PATHNAME}?target=${encodeURIComponent(window.location.href)}`;
};
