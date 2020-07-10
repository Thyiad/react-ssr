import React, { FC } from 'react';
import { render, hydrate } from 'react-dom';
import { BrowserRouter, Switch } from 'react-router-dom';
import routes from './route';
import AppContainer from './components/AppContainer';
import '@client/assets/scss/common.scss';
import './app.scss';

const App: FC = () => {
    console.log('in app.tsx render..........');
    return (
        <BrowserRouter>
            <AppContainer />
        </BrowserRouter>
    );
};

hydrate(<App />, document.getElementById('root'));
