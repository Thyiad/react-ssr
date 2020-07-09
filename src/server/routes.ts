import Router from '@koa/router';
import * as controller from './controller/index';

const router = new Router();

router.get('/favicon.ico', (ctx) => {
    ctx.status = 200;
    ctx.res.end('');
});

// @ts-ignore
router.get('/api/getList', controller.api.getList);
// @ts-ignore
router.get('/404', controller.general.page404);
// @ts-ignore
router.get('/500', controller.general.page500);
// @ts-ignore
router.get('(.*)', controller.general.base);

export default router;
