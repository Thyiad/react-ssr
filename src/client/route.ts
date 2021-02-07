import loadable from '@loadable/component';
import * as Init from '@/models/Init';

const NotFound = loadable(() => import(/* webpackChunkName: "404" */ './pages/404/index'));
const PageError = loadable(() => import(/* webpackChunkName: "500" */ './pages/500/index'));
const Demo = loadable(() => import(/* webpackChunkName: "demo" */ './pages/demo/index'));

/**
 * 系统路由：403、404等等
 */
const sysPages: RouteProps[] = [
    {
        title: '404',
        path: '/404',
        name: '404',
        exact: true,
        component: NotFound,
    },
    {
        title: '500',
        path: '/500',
        name: '500',
        exact: true,
        component: PageError,
    },
    {
        title: '页面找不到了',
        name: '404',
        path: '/404',
        exact: true,
        component: NotFound,
    },
];

const routes: RouteProps[] = [
    ...sysPages,
    {
        title: '首页',
        name: 'home',
        path: '/',
        exact: true,
        redirect: '/demo',
    },
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
        title: '页面发生了错误',
        name: '500',
        path: '/500',
        exact: true,
        component: PageError,
    },
    {
        title: '页面找不到了',
        name: '404',
        path: '*',
        exact: true,
        redirect: '/404',
        component: NotFound,
    },
];

export default routes;
