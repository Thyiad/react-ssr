import React, { FC } from 'react';
import { render } from 'react-dom';
import { Switch } from 'react-router-dom';
import routes from '../route';
import RouteWithSubRoutes from './RouteWithSubRoutes';
import { Provider } from '../redux/store';

const AppContainer: FC = () => {
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

export default AppContainer;
