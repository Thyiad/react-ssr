import { initImplements, thyCookie, thyEnv } from '@thyiad/util';
import { msgLoading, toast, alert, confirm } from './ui';
import { LOGIN_COOKIE_KEY, REQUEST_HEADER_TOKEN_NAME } from '@client/constants/key';
import { LOGIN_PATHNAME } from '@client/constants/url';
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
export const getMatchRoute = (
    pathname?: string,
    routes?: RouteProps[],
    parentRoute?: RouteProps,
    returnRouteList?: RouteProps[],
): RouteProps => {
    pathname = pathname || (thyEnv.canUseWindow() ? window.location.pathname : '');
    routes = routes || rootRoutes;
    const findedRoute = routes?.find((route) => matchPath(route.path, pathname));
    if (findedRoute && returnRouteList) {
        returnRouteList.push(findedRoute);
    }
    if (!findedRoute || !findedRoute.routes) {
        return findedRoute;
    }

    const nextFindedRoute = getMatchRoute(
        pathname,
        findedRoute.routes.map((r) => {
            return {
                ...r,
                path: [
                    parentRoute?.relativePath || parentRoute?.path,
                    findedRoute.relativePath || findedRoute.path,
                    r.path,
                ]
                    .filter((p) => p)
                    .join('/')
                    .replace(/\/\//g, '/'),
            };
        }),
        findedRoute,
    );
    if (nextFindedRoute && returnRouteList) {
        returnRouteList.push(nextFindedRoute);
    }
    return nextFindedRoute || findedRoute;
};

/**
 * 通过pathname检索路由列表
 * @param pathname
 * @param routes
 * @param returnRouteList
 * @returns
 */
export const getMatchRouteList = (
    pathname?: string,
    routes?: RouteProps[],
    returnRouteList?: RouteProps[],
    parentRoute?: RouteProps,
) => {
    pathname = pathname || (thyEnv.canUseWindow() ? window.location.pathname : '');
    returnRouteList = returnRouteList || [];
    routes = routes || rootRoutes;

    const findedRoute = routes?.find((route) => matchPath(route.path, pathname));
    findedRoute && returnRouteList.push(findedRoute);

    if (!findedRoute || !findedRoute.routes) {
        return returnRouteList;
    }

    getMatchRoute(
        pathname,
        findedRoute.routes.map((r) => {
            return {
                ...r,
                path: [
                    parentRoute?.relativePath || parentRoute?.path,
                    findedRoute.relativePath || findedRoute.path,
                    r.path,
                ]
                    .filter((p) => p)
                    .join('/')
                    .replace(/\/\//g, '/'),
            };
        }),
        findedRoute,
        returnRouteList,
    );

    return returnRouteList;
};

/**
 * 退出登录
 */
export const logout = (): void => {
    thyCookie.remove(LOGIN_COOKIE_KEY);
    window.location.href = `${LOGIN_PATHNAME}?target=${encodeURIComponent(window.location.href)}`;
};
