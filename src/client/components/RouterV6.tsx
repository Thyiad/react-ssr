import React, { useMemo } from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';

interface RouteElementProps {
    route: RouteProps;
}

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

export const renderRoute = (route: RouteProps) => {
    return (
        <Route path={route.path} key={route.name} element={<RouteElement route={route} />}>
            {route.routes?.map((childRoute) => renderRoute(childRoute))}
        </Route>
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
