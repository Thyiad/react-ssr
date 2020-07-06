import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';

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
                        <route.component {...props} routes={route.routes} />
                    </>
                );
            }}
        />
    );
};

export default RouteWithSubRoutes;
