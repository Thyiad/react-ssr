import React, { FC, useCallback, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Provider, StoreProviderProps } from '@/redux/store';
import routes from '@/route';
import 'antd/dist/reset.css';
import '@/assets/scss/common.scss';
import '@/app.scss';
import { getMatchRoute, initThyiadUtil } from '@/utils/index';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { renderRoute } from './RouterV6';

initThyiadUtil();

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
        <ConfigProvider locale={zhCN}>
            <BrowserRouter>
                <AppProvider />
            </BrowserRouter>
        </ConfigProvider>
    );
};
