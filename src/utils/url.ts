import qs from 'query-string';
import Cookies from '@/utils/cookie';
import { LOGIN_COOKIE_KEY, LOGIN_PATHNAME } from '@/constant/index';
import rootRoutes from '@/route';
import { matchPath } from 'react-router-dom';

/**
 * 获取基域名
 * 只识别 xx.xx.xx，否则返回当前 hostname
 * @param hostname 需要解析的域名，默认当前域名
 */
export const getBaseHost = (hostname = ''): string => {
    hostname = hostname || window.location.hostname;
    if (!/^([^.]+\.){2}[^.]+$/.test(hostname)) {
        return hostname;
    }
    const hostArr = hostname.split('.');
    const baseHost = `.${hostArr.slice(hostArr.length - 2).join('.')}`;
    return baseHost;
};

/**
 * 通过url解析参数
 * @param urlPath
 */
export const getQuery = (urlPath?: string) => {
    urlPath = urlPath || window.location.search;
    return qs.parseUrl(urlPath).query;
};

/**
 * 通过pathname解析对应路由
 * 暂只支持解析到第二级
 * @param pathname
 */
export const getMatchRoute = (pathname?: string, routes?: RouteProps[] = rootRoutes) => {
    pathname = pathname || window.location.pathname;
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
    Cookies.remove(LOGIN_COOKIE_KEY);
    window.location.href = `${LOGIN_PATHNAME}?target=${encodeURIComponent(window.location.href)}`;
};

export default {
    getBaseHost,
    getQuery,
};
