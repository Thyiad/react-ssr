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
import AvatarDropdown from './AvatarDropdown';
import CommonFooter from './CommonFooter';
import { useRole } from '@/hooks/useRole';

const { Header, Content } = Layout;

import './TopMenuLayout.scss';
import logo from '@/assets/img/logo.png';

const TopMenuLayout: FC<RoutePageProps> = (props) => {
    const history = useHistory();
    const { routes } = props;
    const { state, actions } = useRedux();
    const { isFirstRender, checkRole } = useRole(history, state.currentUserinfo?.role);

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

    const initActiveMenu: string = useMemo(() => {
        const findedRoute = getMatchRoute();
        if (findedRoute) {
            return findedRoute.redirect || findedRoute.path;
        }
        return '';
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

        if (isFirstRender.current) {
            checkRole(history, state.currentUserinfo.role);
            isFirstRender.current = false;
        }

        return (
            <Layout className="top-menu-layout">
                <Header className="top-menu-layout-header">
                    <div className="sider-logo">
                        <a href="/">
                            <img src={logo} alt="" />
                            <span>{systemInfo.title}</span>
                        </a>
                    </div>
                    <Menu
                        onClick={onMenuClick}
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={[initActiveMenu]}
                        style={{ lineHeight: '64px', flex: 1, overflow: 'hidden' }}
                    >
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
                    <AvatarDropdown nameColor="#fff" />
                </Header>
                <Content className="top-menu-layout-content">
                    <Switch>
                        {routes?.map((route) => (
                            <RouteWithSubRoutes key={route.name} {...route} />
                        ))}
                    </Switch>
                </Content>
                <CommonFooter />
            </Layout>
        );
    }, [state.currentUserinfo, initActiveMenu, routes, onMenuClick]);
};

export default TopMenuLayout;
