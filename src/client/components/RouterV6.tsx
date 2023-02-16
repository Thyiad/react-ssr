import React, { useMemo } from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';

interface RouteElementProps {
    route: RouteProps;
}

/**
 * 渲染路由的包装组件
 * 包含redirect和路由页面
 * @param props
 * @returns
 */
export const RouteElement: React.FC<RouteElementProps> = (props: RouteElementProps) => {
    const { route } = props;

    if (route.redirect) {
        return <Navigate to={route.redirect} replace />;
    }

    return (
        <>
            <Helmet>
                <title>{route.title}</title>
            </Helmet>
            {route.component && <route.component routes={route.routes} />}
        </>
    );
};

/**
 * 空白的子路由包裹器
 * @returns
 */
export const SubRouteWrapper: React.FC = () => {
    return useMemo(() => {
        return <Outlet />;
    }, []);
};
