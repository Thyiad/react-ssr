import React, { FC, useState, useEffect, useMemo, useCallback } from 'react';
import { useHistory, Switch, useParams, useLocation, matchPath } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { useRedux } from '@/hooks/useRedux';
import PageLoading from '@/components/PageLoading';
import RouteWithSubRoutes from '@/components/RouteWithSubRoutes';
import Cookies from '@/utils/cookie';
import { getMatchRoute } from '@/utils/url';
import { LOGIN_COOKIE_KEY, LOGIN_PATHNAME } from '@/constant/index';
import systemInfo from '@/constant/systemInfo';
import { fetchCurrentUserinfo } from '@/models/User';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import AvatarDropdown from './AvatarDropdown';
import CommonFooter from './CommonFooter';
import { useRole } from '@/hooks/useRole';

const { Header, Sider, Content } = Layout;

import './LeftMenuLayout.scss';
import logo from '@/assets/img/logo.png';

/**
 * 左侧菜单layout
 * @param props
 */
const LeftMenuLayout: FC<RoutePageProps> = (props) => {
    const history = useHistory();
    const { routes } = props;
    const { state, actions } = useRedux();
    useRole(history, state.currentUserinfo?.role);

    const [collapsed, setCollapsed] = useState(false);

    const initActiveMenu: string = useMemo(() => {
        const findedRoute = routes?.find((route) => matchPath(window.location.pathname, route));
        if (findedRoute) {
            if (findedRoute.routes) {
                const nextFindedRoute = routes?.find((route) => matchPath(window.location.pathname, route));
                if (nextFindedRoute) {
                    return nextFindedRoute.redirect || nextFindedRoute.path;
                }
            }
            return findedRoute.redirect || findedRoute.path;
        }
        return '';
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const accessKey = Cookies.get(LOGIN_COOKIE_KEY);
        if (!accessKey) {
            window.location.href = `${LOGIN_PATHNAME}?target=${encodeURIComponent(window.location.href)}`;
            return;
        }
        fetchCurrentUserinfo().then((res) => {
            actions.user.setCurrentUserinfo(res);
        });
    }, [actions.user]);

    const onMenuClick = useCallback(
        (event: any) => {
            const { key } = event;

            history.push(key);
        },
        [history],
    );

    return useMemo(() => {
        // 如果用户信息为空，显示loading
        if (!state.currentUserinfo) {
            return <PageLoading />;
        }

        return (
            <Layout className="left-menu-layout">
                <Sider trigger={null} collapsible collapsed={collapsed}>
                    <div className="sider-logo">
                        <a href="/">
                            <img src={logo} alt="" />
                            <span>{systemInfo.title}</span>
                        </a>
                    </div>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={[initActiveMenu]} onClick={onMenuClick}>
                        {routes
                            ?.filter(
                                (item) =>
                                    !item.hideInMenu &&
                                    // @ts-ignore
                                    (!item.roles || item.roles.includes(state.currentUserinfo?.role)),
                            )
                            .map((item) => (
                                <Menu.Item key={item.path} icon={item.icon}>
                                    {item.title}
                                </Menu.Item>
                            ))}
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-header">
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: () => {
                                setCollapsed(!collapsed);
                            },
                        })}
                        <div className="content">
                            <span className="title">{systemInfo.titleDesc}</span>
                        </div>
                        <AvatarDropdown />
                    </Header>
                    <Content className="site-layout-content">
                        <Switch>
                            {routes?.map((route) => (
                                <RouteWithSubRoutes key={route.name} {...route} />
                            ))}
                        </Switch>
                    </Content>
                    <CommonFooter />
                </Layout>
            </Layout>
        );
    }, [state.currentUserinfo, collapsed, initActiveMenu, routes, onMenuClick]);
};

export default LeftMenuLayout;
