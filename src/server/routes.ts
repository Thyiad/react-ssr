import Router from '@koa/router';
import * as controller from './controller/index';

const router = new Router();

router.get('/favicon.ico', (ctx) => {
    ctx.status = 200;
    ctx.res.end('');
});
router.get('/health', (ctx) => {
    ctx.status = 200;
    ctx.type = 'text/plain';
    ctx.res.end('ok');
});

router.post('/404', controller.general.page404);
router.get('/500', controller.general.page500);
router.get('/api/getList', controller.api.getList);
router.get('/api/clearCacheHtml', controller.api.clearCacheHtml);
router.get('(.*)', controller.general.base);

export default router;
