import { Context } from 'koa';
import { clearCacheHtml as _clearCacheHtml } from '../utils/render';

export const getList = (ctx: Context, next: () => Promise<any>) => {
    ctx.response.type = 'json';
    ctx.response.body = {
        returnMsg: '',
        returnCode: 200,
        result: ['111', '222', '333'],
    };
    return;
};

export const clearCacheHtml = (ctx: Context, next: () => Promise<any>) => {
    const len = _clearCacheHtml();
    ctx.response.type = 'json';
    ctx.response.body = {
        returnMsg: '',
        returnCode: 200,
        result: `清理缓存成功，共清理${len}条`,
    };
    return;
};
