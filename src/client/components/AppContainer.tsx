import React, { FC } from 'react';
import { BrowserRouter, StaticRouter, Switch } from 'react-router-dom';
import { Provider } from '@/redux/store';
import routes from '@/route';
import RouteWithSubRoutes from '@/components/RouteWithSubRoutes';
import '@/assets/scss/common.scss';
import '@/app.scss';
import { initThyiadUtil } from '@/utils/index';
import { initializeIcons } from '@fluentui/react';

initializeIcons();
initThyiadUtil();

export const AppRoutes: FC = () => {
    return (
        <Provider>
            <Switch>
                {routes.map((route) => (
                    <RouteWithSubRoutes key={route.name} {...route} />
                ))}
            </Switch>
        </Provider>
    );
};

export const AppContainer: FC = () => {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
};
