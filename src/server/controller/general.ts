import { Context, Next } from 'koa';
import { getMatchRoute } from '@client/utils/index';
import routes from '@client/route';
import { render } from '../utils/render';
import logger from '@server/utils/logger';

export const base = async (ctx: Context, next: Next): Promise<void> => {
    try {
        const currentRoute = getMatchRoute(ctx.path, routes);
        if (currentRoute) {
            await render(ctx, currentRoute);
        } else {
            ctx.redirect('/404');
        }
        next();
    } catch (error) {
        logger.error(error);
        console.error(error);
        ctx.redirect('/500');
    }
};

export const page404 = async (ctx: Context, next: Next): Promise<void> => {
    ctx.render('404');
};

export const page500 = async (ctx: Context, next: Next): Promise<void> => {
    ctx.render('500');
};
