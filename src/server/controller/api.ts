import { Context } from 'koa';
import { clearCacheHtml as _clearCacheHtml } from '../utils/render';

export const getList = (ctx: Context, next: () => Promise<any>) => {
    ctx.response.type = 'json';
    ctx.response.body = {
        returnMsg: '',
        returnCode: 200,
        result: ['111', '222', '333'],
    };
};

export const clearCacheHtml = (ctx: Context, next: () => Promise<any>) => {
    if (ctx.query.key === 'dm-hj-ui') {
        const len = _clearCacheHtml();
        ctx.response.type = 'json';
        ctx.response.body = {
            returnMsg: '',
            returnCode: 200,
            result: `清理缓存成功，共清理${len}条`,
        };
    } else {
        ctx.response.type = 'json';
        ctx.response.body = {
            returnMsg: '',
            returnCode: 200,
            result: `秘钥错误，不执行清理缓存`,
        };
    }
};
