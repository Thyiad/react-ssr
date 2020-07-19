import React, { FC, useMemo } from 'react';
import { Link, Switch } from 'react-router-dom';
import CommonFooter from './CommonFooter';
import systemInfo from '@/constant/systemInfo';
import RouteWithSubRoutes from '@/components/RouteWithSubRoutes';
import './UserLayout.scss';
import logo from '@/assets/img/logo.png';

const { login } = systemInfo;

/**
 * 用户登录/注册的layout
 * @param props
 */
const UserLayout: FC<RoutePageProps> = (props) => {
    const { routes } = props;

    return useMemo(() => {
        return (
            <div className="user-layout">
                <div className="user-layout-content">
                    <div className="top">
                        <div className="header">
                            <Link to="/">
                                <img alt="logo" className="logo" src={logo} />
                                <span className="title">{login.title}</span>
                            </Link>
                        </div>
                        <div className="desc">{login.desc}</div>
                    </div>
                    <Switch>
                        {routes?.map((route) => (
                            <RouteWithSubRoutes key={route.name} {...route} />
                        ))}
                    </Switch>
                </div>
                <CommonFooter />
            </div>
        );
    }, [routes]);
};

export default UserLayout;
