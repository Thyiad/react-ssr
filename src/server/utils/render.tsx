import { Context } from 'koa';
import { StaticRouter } from 'react-router-dom';
import { AppRoutes } from '@client/components/AppContainer';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { IndexTemplate, RemScript } from '@server/utils/template';
import artTemplate from 'art-template';
import { ChunkExtractor } from '@loadable/server';
import config from '@server/config';
import { BASE_NAME, CTX_SSR_DATA } from '@client/constants';

const statsFile = `${config.baseDir}/dist/client/loadable-stats.json`;
let extractor;

export const renderHtml = async (ctx: Context, router: RouteProps): Promise<string> => {
    if (config.isDev) {
        extractor = new ChunkExtractor({ statsFile });
    }
    if (!extractor) {
        extractor = new ChunkExtractor({ statsFile });
    }

    let ssrData: any = {};
    if (router.getInitialProps) {
        const pageInitData = await router.getInitialProps();
        ssrData = {
            ...pageInitData,
        };
    }
    ctx.state[CTX_SSR_DATA] = ssrData;

    const jsx = router.isSSR
        ? extractor.collectChunks(
              <StaticRouter location={ctx.url} basename={BASE_NAME} context={{}}>
                  <AppRoutes context={ctx} />
              </StaticRouter>,
          )
        : extractor.collectChunks(<StaticRouter location={ctx.url} context={{}} />);

    const html = renderToString(jsx);
    const scriptTags = extractor.getScriptTags(); // or extractor.getScriptElements();
    const linkTags = extractor.getLinkTags(); // or extractor.getLinkElements();
    const styleTags = extractor.getStyleTags(); // or extractor.getStyleElements();
    const renderData = {
        html,
        remScript: config.useRem ? RemScript : '',
        // eslint-disable-next-line prettier/prettier
        ssrData: `<script>window.ssrData=${JSON.stringify(ssrData || {})};window.DEPLOY_ENV=${JSON.stringify(
            config.deployEnv,
        )};</script>`,
        scriptTags,
        linkTags,
        styleTags,
    };
    const templateStr = artTemplate.render(IndexTemplate, renderData);
    return templateStr;
};

export const render = async (ctx: Context, router: RouteProps) => {
    const templateStr = await renderHtml(ctx, router);
    ctx.status = 200;
    ctx.type = 'html';
    ctx.body = templateStr;
};
