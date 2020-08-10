import { Context, Next } from 'koa';
import { getMatchRoute } from '@client/utils/index';
import routes from '@client/route.tsx';
import { render } from '../utils/render';

export const base = async (ctx: Context, next: Next): Promise<void> => {
    try {
        const currentRoute = getMatchRoute(ctx.path, routes);
        if (currentRoute) {
            await render(ctx, currentRoute);
        }
        await next();
    } catch (error) {
        console.log(error);
        ctx.type = 'html';
        ctx.body = error;
    }
};

export const page404 = (ctx: Context, next: Next) => {
    ctx.render('404');
};

export const page500 = (ctx: Context, next: Next) => {
    ctx.render('500');
};
