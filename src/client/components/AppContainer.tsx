import React, { FC, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Provider, StoreProviderProps } from '@/redux/store';
import routes from '@/route';
import { BASE_NAME } from '@client/constants';
import { LocaleProvider } from 'zarm';
import locale from 'zarm/lib/locale-provider/locale/zh_CN';
import '@/assets/scss/common.scss';
import '@/app.scss';
import { renderRoute } from './RouterV6';

export const AppBody: FC = () => {
    const location = useLocation();
    useEffect(() => {
        // // 路由变化，在这里拦截处理
        // console.log('路由发生变化', location.pathname);
        // const r = getMatchRoute();
        // console.log(r);
    }, [location]);

    return <Routes>{routes.map((route) => renderRoute(route))}</Routes>;
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
