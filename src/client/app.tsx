import React, { FC } from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Switch } from 'react-router-dom';
import { Provider } from './redux/store';
import routes from './route';
import RouteWithSubRoutes from '@/components/RouteWithSubRoutes';
import 'antd/dist/antd.css';
import '@/assets/scss/common.scss';
import './app.scss';
import { initThyiadUtil } from '@/utils/index';

initThyiadUtil();

const App: FC = () => {
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

render(<App />, document.getElementById('root'));
