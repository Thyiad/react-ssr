import { Context } from 'koa';
import { StaticRouter } from 'react-router-dom/server';
import { AppProvider } from '@client/components/AppContainer';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { IndexTemplate, RemScript } from '@server/utils/template';
import artTemplate from 'art-template';
import { ChunkExtractor } from '@loadable/server';
import config from '@server/config';
import { CTX_SSR_DATA } from '@client/constants/key';

const statsFile = `${process.cwd()}/dist/client/loadable-stats.json`;
let extractor;

let cacheHtmlDic: { [key: string]: string } = {};
const maxCacheCount = 500;

export const clearCacheHtml = () => {
    const len = Object.keys(cacheHtmlDic).length;
    cacheHtmlDic = {};
    return len;
};

export const renderHtml = async (ctx: Context, router: RouteProps): Promise<string> => {
    if (cacheHtmlDic[ctx.URL.pathname]) {
        return cacheHtmlDic[ctx.URL.pathname];
    }

    if (config.isDev) {
        extractor = new ChunkExtractor({ statsFile });
    }
    if (!extractor) {
        extractor = new ChunkExtractor({ statsFile });
    }

    let ssrData = {};
    if (router.getInitialProps) {
        const pageInitData = await router.getInitialProps();
        ssrData = {
            ...pageInitData,
        };
    }
    ctx.state[CTX_SSR_DATA] = ssrData;

    const jsx = router.isSSR
        ? extractor.collectChunks(
              <StaticRouter location={ctx.url}>
                  <AppProvider context={ctx} />
              </StaticRouter>,
          )
        : extractor.collectChunks(<StaticRouter location={ctx.url} />);

    const html = renderToString(jsx);
    const scriptTags = extractor.getScriptTags(); // or extractor.getScriptElements();
    const linkTags = extractor.getLinkTags(); // or extractor.getLinkElements();
    const styleTags = extractor.getStyleTags(); // or extractor.getStyleElements();
    const renderData = {
        html,
        remScript: config.useRem ? RemScript : '',
        ssrData: `<script>window.ssrData=${JSON.stringify(ssrData || null)}</script>`,
        scriptTags,
        linkTags,
        styleTags,
    };
    const templateStr = artTemplate.render(IndexTemplate, renderData);
    cacheHtmlDic[ctx.URL.pathname] = templateStr;
    const cacheKeys = Object.keys(cacheHtmlDic);
    if (cacheKeys.length > maxCacheCount) {
        delete cacheHtmlDic[cacheKeys[0]];
    }
    return templateStr;
};

export const render = async (ctx: Context, router: RouteProps): Promise<void> => {
    const templateStr = await renderHtml(ctx, router);
    ctx.type = 'html';
    ctx.body = templateStr;
};
