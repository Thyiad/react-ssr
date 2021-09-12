import { Context } from 'koa';
import { StaticRouter } from 'react-router-dom';
import { AppProvider } from '@client/components/AppContainer';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { IndexTemplate, RemScript, VconsoleScript } from '@server/utils/template';
import artTemplate from 'art-template';
import { ChunkExtractor } from '@loadable/server';
import config from '@server/config';
import { BASE_NAME, CTX_SSR_DATA } from '@client/constants';

const statsFile = `${config.baseDir}/dist/client/loadable-stats.json`;
let extractor;

const htmlCache = new Map<string, string>();

export const clearCacheHtml = () => {
    const len = Object.keys(htmlCache).length;
    htmlCache.clear();
    return len;
};

export const renderHtml = async (ctx: Context, router: RouteProps): Promise<string> => {
    if (config.cacheHtml && htmlCache.has(ctx.href)) {
        return htmlCache.get(ctx.href);
    }

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
                  <AppProvider context={ctx} />
              </StaticRouter>,
          )
        : extractor.collectChunks(<StaticRouter location={ctx.url} context={{}} />);

    const html = renderToString(jsx);
    const scriptTags =
        extractor.getScriptTags() + // or extractor.getScriptElements();
        (config.deployEnv === 'prd' ? '' : VconsoleScript);
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
    if (config.cacheHtml) {
        htmlCache.set(ctx.href, templateStr);
        const gtLength = htmlCache.size - config.maxCacheCount;
        if (gtLength > 0) {
            const delKeys = Array.from(htmlCache.keys()).slice(0, gtLength);
            delKeys.forEach((delKey) => {
                htmlCache.delete(delKey);
            });
        }
    }
    return templateStr;
};

export const render = async (ctx: Context, router: RouteProps) => {
    const templateStr = await renderHtml(ctx, router);
    ctx.status = 200;
    ctx.type = 'html';
    ctx.body = templateStr;
};
