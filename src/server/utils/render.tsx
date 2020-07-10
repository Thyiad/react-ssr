import { Context } from 'koa';
import { StaticRouter } from 'react-router-dom';
import AppContainer from '@client/components/AppContainer';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { IndexTemplate } from '@server/utils/template';
import artTemplate from 'art-template';
import fs from 'fs';
import { jsonParse } from '@client/utils/stringify';
import { Helmet } from 'react-helmet';

let manifest: any = null;
const manifestPath = `${process.cwd()}/dist/client/manifest.json`;

export const render = async (ctx: Context, router: RouteProps) => {
    if (manifest == null) {
        const jsonContent: string = await fs.readFileSync(manifestPath, 'utf-8');
        console.log(jsonContent);
        manifest = jsonParse(jsonContent);
    }
    console.log(manifest);
    if (router.isSSR) {
        const jsx = (
            <StaticRouter location={ctx.url} context={{}}>
                <AppContainer />
            </StaticRouter>
        );
        const s1 = Helmet.renderStatic();
        const html = renderToString(jsx);
        const s2 = Helmet.renderStatic();
        const renderData = {
            html,
            bodyScript: `
            <script type="text/javascript" src="${manifest['vendor.js']}">
            </script><script type="text/javascript" src="${manifest['main.js']}"></script>
            `,
            s1,
            s2,
        };
        const templateStr = artTemplate.render(IndexTemplate, renderData);
        ctx.type = 'html';
        ctx.body = templateStr;
    } else {
        ctx.type = 'html';
        ctx.body = '<p>csr</p>' + router.path;
    }
};
