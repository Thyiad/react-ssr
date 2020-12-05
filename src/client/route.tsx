import React from 'react';
import loadable from '@loadable/component';
import { MenuUnfoldOutlined, MenuFoldOutlined, TableOutlined } from '@ant-design/icons';

import UserLayout from './layouts/UserLayout';
import LeftMenuLayout from './layouts/LeftMenuLayout';
import TopMenuLayout from './layouts/TopMenuLayout';
import SubRouteWrapper from './components/SubRouteWrapper';
import * as Init from '@/utils/getInitialProps';

const Login = loadable(() => import(/* webpackChunkName: "login" */ './pages/login/index'));
const Table = loadable(() => import(/* webpackChunkName: "table" */ './pages/table/index'));
const NotFound = loadable(() => import(/* webpackChunkName: "404" */ './pages/404/index'));
const NoPermission = loadable(() => import(/* webpackChunkName: "403" */ './pages/403/index'));
const PageError = loadable(() => import(/* webpackChunkName: "500" */ './pages/500/index'));
const EmptyPage = loadable(() => import(/* webpackChunkName: "empty" */ './pages/empty/index'));
const DemoPage = loadable(() => import(/* webpackChunkName: "demo" */ './pages/demo/index'));

/**
 * 系统路由：403、404等等
 */
const sysPages: RouteProps[] = [
    {
        title: '403',
        path: '/403',
        name: '403',
        exact: true,
        component: NoPermission,
    },
    {
        title: '404',
        path: '/404',
        name: '404',
        component: NotFound,
    },
    {
        title: '500',
        path: '/500',
        name: '500',
        component: PageError,
    },
];

/**
 * 用户登录、注册等页面
 */
const userPages: RouteProps[] = [
    {
        title: '',
        path: '/user',
        name: 'userLayout',
        exact: false,
        component: UserLayout,
        routes: [
            {
                title: '',
                path: '/user',
                name: 'userRedirect',
                exact: true,
                redirect: '/user/login',
                component: Login,
            },
            {
                title: '登录',
                path: '/user/login',
                name: 'login',
                exact: true,
                component: Login,
            },
        ],
    },
];

const routes: RouteProps[] = [
    ...sysPages,
    ...userPages,
    {
        title: '',
        path: '/',
        name: 'homeLayout',
        exact: false,
        component: LeftMenuLayout,
        routes: [
            {
                title: '首页',
                name: 'home',
                path: '/',
                exact: true,
                redirect: '/table',
                hideInMenu: true,
            },
            {
                title: '列表示例',
                name: 'table',
                path: '/table',
                exact: true,
                component: Table,
                icon: <TableOutlined />,
                isSSR: true,
                getInitialProps: Init.getTableInitData,
            },
            {
                title: '无限嵌套',
                name: 'subs',
                path: '/subs',
                exact: false,
                component: SubRouteWrapper,
                icon: <TableOutlined />,
                routes: [
                    {
                        title: '',
                        name: 'sub_',
                        path: '/subs',
                        exact: true,
                        redirect: '/subs/child1',
                        hideInMenu: true,
                    },
                    {
                        title: '嵌套子页面1',
                        name: 'child1',
                        path: '/subs/child1',
                        exact: true,
                        component: EmptyPage,
                        icon: <TableOutlined />,
                    },
                    {
                        title: '嵌套子页面2',
                        name: 'child2',
                        path: '/subs/child2',
                        exact: true,
                        component: EmptyPage,
                        icon: <TableOutlined />,
                    },
                ],
            },
            {
                title: 'demo',
                name: 'demo',
                path: '/demo',
                exact: true,
                component: DemoPage,
                icon: <TableOutlined />,
            },
            {
                title: '',
                name: 'homeNotFound',
                path: '*',
                exact: true,
                redirect: '/404',
                component: NotFound,
                hideInMenu: true,
            },
        ],
    },
];

export default routes;
