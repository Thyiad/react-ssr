import BasicLayout from './layout/BasicLayout';
import Home from './pages/home/index';
import About from './pages/about/index';
import NotFound from './pages/404/index';
import Login from './pages/login/index';

const routes: RouteProps[] = [
    {
        title: '登录',
        name: 'useLogin',
        path: '/user/login',
        exact: true,
        component: Login,
        hideInMenu: true,
    },
    {
        title: '根',
        name: 'root',
        path: '/',
        component: BasicLayout,
        routes: [
            {
                title: '首页',
                name: 'home',
                path: '/',
                exact: true,
                component: Home,
            },
            {
                title: '关于',
                name: 'about',
                path: '/about',
                exact: true,
                component: About,
            },
            {
                title: 'not found',
                name: 'not found',
                path: '*',
                component: NotFound,
                hideInMenu: true,
            },
        ],
    },
];

export default routes;
