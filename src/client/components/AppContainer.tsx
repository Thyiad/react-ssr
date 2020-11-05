import React, { FC, useEffect } from 'react';
import { BrowserRouter, StaticRouter, Switch } from 'react-router-dom';
import { Provider, StoreProviderProps } from '@/redux/store';
import routes from '@/route';
import RouteWithSubRoutes from '@/components/RouteWithSubRoutes';
import '@/assets/scss/common.scss';
import '@/app.scss';
import { BASE_NAME } from '@client/constants';
import { LocaleProvider } from 'zarm';
import locale from 'zarm/lib/locale-provider/locale/zh_CN';
import { useLoginFn } from '@client/hooks/useLogin';

export const AppBody: FC = () => {
    useLoginFn();
    return (
        <Switch>
            {routes.map((route) => (
                <RouteWithSubRoutes key={route.name} {...route} />
            ))}
        </Switch>
    );
};

export const AppProvider: FC<StoreProviderProps> = (props: StoreProviderProps) => {
    return (
        <Provider context={props.context}>
            <AppBody />
        </Provider>
    );
};

export const AppBrowser: FC = () => {
    return (
        // <LocaleProvider locale={locale}>
        <BrowserRouter basename={BASE_NAME}>
            <AppProvider />
        </BrowserRouter>
        // </LocaleProvider>
    );
};
