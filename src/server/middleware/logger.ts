import Koa from 'koa';
import logger from '../utils/logger';

export const loggerMiddle = () => {
    return async (ctx: Koa.Context, next: () => Promise<any>): Promise<void> => {
        if (ctx.URL.pathname.indexOf('.') >= 0) {
            await next();
        } else {
            const start = +new Date();

            await next();

            const ms = +new Date() - start;
            const { method, url, host, headers } = ctx.request;
            const client = {
                method,
                url,
                host: headers['x-host'] || host || '',
                query: ctx.query,
                referer: headers.referer,
                userAgent: ctx.header['user-agent'] || '',
            };
            const msg = `Response time ${ms}ms, request info ${JSON.stringify(client)}`;
            if (ctx.status >= 500) {
                logger.error(msg);
            } else if (ctx.status >= 400) {
                logger.info(msg);
                if (ctx.status === 404) {
                    ctx.redirect('/404');
                }
            } else if (ctx.status >= 100) {
                console.log(msg);
            }
        }
    };
};
