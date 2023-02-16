import React, { FC, useMemo } from 'react';
import { Link, Outlet, Route, Routes } from 'react-router-dom';
import CommonFooter from './CommonFooter';
import systemInfo from '@client/constants/systemInfo';
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
                    <Outlet />
                </div>
                <CommonFooter />
            </div>
        );
    }, []);
};

export default UserLayout;
