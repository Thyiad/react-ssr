import { Context } from 'koa';
import { matchPath } from 'react-router-dom';
import routes from '@client/route';

export const getCurrentRoute = (ctx: Context) => {
    const pathname = ctx.path;
    const findedRoute = routes?.find((route) => matchPath(pathname, route));
    if (findedRoute) {
        if (findedRoute.routes) {
            const nextFindedRoute = findedRoute.routes?.find((route) => matchPath(pathname, route));
            if (nextFindedRoute) {
                return nextFindedRoute;
            }
        }
        return findedRoute;
    }
    return null;
};
