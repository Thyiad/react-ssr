import React, { FC } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { Provider } from '@/redux/store';
import routes from '@/route';
import RouteWithSubRoutes from '@/components/RouteWithSubRoutes';
import '@/assets/scss/common.scss';
import '@/app.scss';
import { initThyiadUtil } from '@/utils/index';

initThyiadUtil();

export const AppContainer: FC = () => {
    return (
        <Provider>
            <BrowserRouter>
                <Switch>
                    {routes.map((route) => (
                        <RouteWithSubRoutes key={route.name} {...route} />
                    ))}
                </Switch>
            </BrowserRouter>
        </Provider>
    );
};
