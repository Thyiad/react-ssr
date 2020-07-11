import { Context } from 'koa';
import { StaticRouter } from 'react-router-dom';
import AppContainer from '@client/components/AppContainer';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { IndexTemplate } from '@server/utils/template';
import artTemplate from 'art-template';
import fs from 'fs';
import { jsonParse } from '@client/utils/stringify';
import { ChunkExtractor } from '@loadable/server';
import config from '@server/config';

const statsFile = `${process.cwd()}/dist/client/loadable-stats.json`;

export const render = async (ctx: Context, router: RouteProps) => {
    if (router.isSSR) {
        const extractor = new ChunkExtractor({ statsFile });
        const jsx = extractor.collectChunks(
            <StaticRouter location={ctx.url} context={{}}>
                <AppContainer />
            </StaticRouter>,
        );
        const html = renderToString(jsx);
        const scriptTags = extractor.getScriptTags(); // or extractor.getScriptElements();
        const linkTags = extractor.getLinkTags(); // or extractor.getLinkElements();
        const styleTags = extractor.getStyleTags(); // or extractor.getStyleElements();
        const renderData = {
            html,
            scriptTags,
            linkTags,
            styleTags,
        };
        const templateStr = artTemplate.render(IndexTemplate, renderData);
        ctx.type = 'html';
        ctx.body = templateStr;
    } else {
        ctx.type = 'html';
        ctx.body = '<p>csr</p>' + router.path;
    }
};
