import { Context } from 'koa';

export const getList = (ctx: Context, next: () => Promise<any>) => {
    ctx.response.type = 'json';
    ctx.response.body = {
        returnMsg: '',
        returnCode: 200,
        result: ['111', '222', '333'],
    };
    next();
};
