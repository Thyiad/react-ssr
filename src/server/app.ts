import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
// @ts-ignore
import render from 'koa-art-template';
import config from './config';
import path from 'path';
import { loggerMiddle } from './middleware/logger';
import logger from './utils/logger';
import router from './routes';
import 'ignore-styles';

const app = new Koa();

render(app, {
    root: path.join(process.cwd(), 'src/server/view'),
    extname: '.art',
    debug: config.isDev,
});

app.use(serve(path.join(config.baseDir, '/dist/client')));
app.use(loggerMiddle());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.port, () => {
    console.log(`Server is is running: http://localhost:${config.port}`);
});

app.context.onerror = function (err) {
    if (err) {
        if (err.message) {
            logger.error(err.message);
        }
        if (err.stack) {
            logger.error(err.stack);
        }
    }
    this.redirect('/500');
};
