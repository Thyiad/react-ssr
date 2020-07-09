import { Context } from 'koa';

export const render = async (ctx: Context, router: RouteProps) => {
    const htmlStr = '';
    if (router.isSSR) {
        ctx.type = 'html';
        ctx.body = '<p>ssr</p>' + router.path;
    } else {
        ctx.type = 'html';
        ctx.body = '<p>csr</p>' + router.path;
    }
};
