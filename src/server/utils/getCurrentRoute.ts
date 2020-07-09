import { Context } from 'koa';
import { matchPath } from 'react-router-dom';
import routes from '@client/route';

export const getCurrentRoute = (ctx: Context): RouteProps | null => {
    let findedRoute: any = routes.find((route) => matchPath(ctx.path, route));
    if (findedRoute && findedRoute.routes && findedRoute.routes.length > 0) {
        findedRoute = findedRoute.routes.find((route: RouteProps) => matchPath(ctx.path, route));
    }
    if (findedRoute && findedRoute.name === 'not found') {
        findedRoute = null;
    }
    return findedRoute || null;
};
