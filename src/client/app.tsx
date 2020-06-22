import React, { FC } from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Switch } from 'react-router-dom';
import routes from './route';
import RouteWithSubRoutes from './components/RouteWithSubRoutes';
import '@client/assets/scss/common.scss';
import './app.scss';

const App: FC = () => {
    return (
        <BrowserRouter>
            <Switch>
                {routes.map((route) => (
                    <RouteWithSubRoutes key={route.name} {...route} />
                ))}
            </Switch>
        </BrowserRouter>
    );
};

render(<App />, document.getElementById('root'));
