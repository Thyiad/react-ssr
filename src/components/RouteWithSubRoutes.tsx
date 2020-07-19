import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';

/**
 * 可以无限嵌套的路由
 * 有子页面的路由需要自行使用<Switch>包裹子路由
 * @param route
 */
const RouteWithSubRoutes: React.FC<RouteProps> = (route: RouteProps) => {
    return (
        <Route
            path={route.path}
            exact={route.exact}
            render={(props) => {
                if (route.redirect) {
                    return <Redirect to={{ pathname: route.redirect }} />;
                }
                return (
                    <>
                        <Helmet>
                            <title>{route.title}</title>
                        </Helmet>
                        {route.component && <route.component {...props} routes={route.routes} />}
                    </>
                );
            }}
        />
    );
};

export default RouteWithSubRoutes;
