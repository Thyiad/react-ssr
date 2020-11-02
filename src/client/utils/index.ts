import rootRoutes from '../route';
import { matchPath } from 'react-router-dom';

// const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');
export const canUseWindow = () => {
    return typeof window !== 'undefined';
};

/**
 * 获取基域名
 * 只识别 xx.xx.xx，否则返回当前 hostname
 * @param hostname 需要解析的域名，默认当前域名
 */
export const getBaseHost = (hostname = ''): string => {
    hostname = hostname || (canUseWindow() && window.location.hostname) || '';
    if (!/^([^.]+\.){2}[^.]+$/.test(hostname)) {
        return hostname;
    }
    const hostArr = hostname.split('.');
    const baseHost = `.${hostArr.slice(hostArr.length - 2).join('.')}`;
    return baseHost;
};

/**
 * 通过pathname检索对应路由
 * @param pathname
 */
export const getMatchRoute = (pathname?: string, routes?: RouteProps[]) => {
    if (!pathname) {
        pathname = canUseWindow() ? window.location.pathname : '';
    }
    routes = routes || rootRoutes;
    const findedRoute = routes?.find((route) => matchPath(pathname, route));
    if (findedRoute) {
        if (findedRoute.routes) {
            const nextFindedRoute = getMatchRoute(pathname, findedRoute.routes);
            if (nextFindedRoute) {
                return nextFindedRoute;
            }
        }
        return findedRoute;
    }
    return null;
};
