import React, { FC, useMemo } from 'react';
import { Switch } from 'react-router-dom';
import RouteWithSubRoutes from '@/components/RouteWithSubRoutes';

const SubRouteWrapper: FC<RoutePageProps> = (props) => {
    const { routes } = props;

    return useMemo(() => {
        return (
            <Switch>
                {routes?.map((route) => (
                    <RouteWithSubRoutes key={route.name} {...route} />
                ))}
            </Switch>
        );
    }, [routes]);
};

export default SubRouteWrapper;
