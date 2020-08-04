import { RouteComponentProps } from 'react-router-dom';
import { IState } from '@client/redux/data';

declare global {
    interface Window {
        ssrData?: IState;
    }
    interface RouteProps {
        /** 页面标题 */
        title: string;
        /** name, 页面key */
        name: string;
        /** 路由 */
        path: string;
        /** 是否严格匹配 */
        exact?: boolean;
        /** 如果是跳转，此处配置跳转的路由 */
        redirect?: string;
        /** 页面组件 */
        component?: FC<RoutePageProps>;
        /** 子路由 */
        routes?: RouteProps[];
        /** 是否在菜单中隐藏 */
        hideInMenu?: boolean;
        /** 是否服务端渲染 */
        isSSR?: boolean;
    }

    interface RouteType {
        path: string;
        component;
    }

    interface RoutePageProps extends RouteComponentProps {
        routes?: RouteProps[];
    }
}

declare module 'koa' {
    interface Context {
        render(page: string, options?: any): void;
    }
}
