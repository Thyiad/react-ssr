import { Context, Next } from 'koa';
import { getCurrentRoute } from '../utils/getCurrentRoute';
import { render } from '../utils/render';

export const base = async (ctx: Context, next: Next): Promise<void> => {
    try {
        const currentRoute = getCurrentRoute(ctx);
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