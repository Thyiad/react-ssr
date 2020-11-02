import React from 'react';
import loadable from '@loadable/component';
import * as Init from '@/models/Init';

const NotFound = loadable(() => import(/* webpackChunkName: "404" */ './pages/404/index'));
const Demo = loadable(() => import(/* webpackChunkName: "demo" */ './pages/demo/index'));

const routes: RouteProps[] = [
    {
        title: '示例页面',
        name: 'demo',
        path: '/demo',
        exact: true,
        component: Demo,
        isSSR: true,
        getInitialProps: Init.getDemoInitData,
    },
    {
        title: '404',
        name: '404',
        path: '*',
        exact: true,
        component: NotFound,
    },
];

export default routes;
