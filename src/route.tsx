import React from 'react';
import loadable from '@loadable/component';

import UserLayout from './layouts/UserLayout';
import LeftMenuLayout from './layouts/LeftMenuLayout';
import TopMenuLayout from './layouts/TopMenuLayout';
const Login = loadable(() => import(/* webpackChunkName: "login" */ './pages/login/index'));
const Todo = loadable(() => import(/* webpackChunkName: "todo" */ './pages/todo/index'));
const Table = loadable(() => import(/* webpackChunkName: "table" */ './pages/table/index'));
const NotFound = loadable(() => import(/* webpackChunkName: "404" */ './pages/404/index'));
const NoPermission = loadable(() => import(/* webpackChunkName: "403" */ './pages/403/index'));
import { HomeOutlined, TableOutlined } from '@ant-design/icons';

const routes: RouteProps[] = [
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
    {
        title: '403',
        path: '/403',
        name: '403',
        exact: true,
        component: NoPermission,
    },
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
                redirect: '/todo',
                component: Todo,
                hideInMenu: true,
                icon: <HomeOutlined />,
            },
            {
                title: '待办事项',
                name: 'todo',
                path: '/todo',
                exact: true,
                component: Todo,
                icon: <TableOutlined />,
            },
            {
                title: '列表示例',
                name: 'table',
                path: '/table',
                exact: true,
                component: Table,
                icon: <TableOutlined />,
                roles: ['a'],
            },
        ],
    },
    {
        title: 'not found',
        name: 'not found',
        path: '*',
        component: NotFound,
        hideInMenu: true,
    },
];

export default routes;
