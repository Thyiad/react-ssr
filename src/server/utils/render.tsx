import { Context } from 'koa';
import { StaticRouter } from 'react-router-dom';
import { AppContainer } from '@client/components/AppContainer';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { IndexTemplate, RemScript } from '@server/utils/template';
import artTemplate from 'art-template';
import { ChunkExtractor } from '@loadable/server';
import config from '@server/config';

const statsFile = `${process.cwd()}/dist/client/loadable-stats.json`;
let extractor;

export const renderHtml = async (ctx: Context, router: RouteProps): Promise<string> => {
    if (config.isDev) {
        extractor = new ChunkExtractor({ statsFile });
    }
    if (!extractor) {
        extractor = new ChunkExtractor({ statsFile });
    }

    const jsx = router.isSSR
        ? extractor.collectChunks(
              <StaticRouter location={ctx.url} context={{}}>
                  <AppContainer />
              </StaticRouter>,
          )
        : extractor.collectChunks(<StaticRouter location={ctx.url} context={{}} />);
    const html = renderToString(jsx);
    const scriptTags = extractor.getScriptTags(); // or extractor.getScriptElements();
    const linkTags = extractor.getLinkTags(); // or extractor.getLinkElements();
    const styleTags = extractor.getStyleTags(); // or extractor.getStyleElements();
    // todo: 如果需要提前获取数据，需要 await 获取数据
    const ssrData = {};
    const renderData = {
        html,
        remScript: config.useRem ? RemScript : '',
        ssrData: `window.ssrData=${JSON.stringify(ssrData || null)}`,
        scriptTags,
        linkTags,
        styleTags,
    };
    const templateStr = artTemplate.render(IndexTemplate, renderData);
    return templateStr;
};

export const render = async (ctx: Context, router: RouteProps) => {
    const templateStr = await renderHtml(ctx, router);
    ctx.type = 'html';
    ctx.body = templateStr;
};
