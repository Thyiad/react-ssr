import { RouteComponentProps } from 'react-router-dom';
import { IState } from '@client/redux/data';

declare global {
    declare module '*.css';
    declare module '*.less';
    declare module '*.scss';
    declare module '*.sass';
    declare module '*.svg';
    declare module '*.png';
    declare module '*.jpg';
    declare module '*.jpeg';
    declare module '*.gif';
    declare module '*.bmp';
    declare module '*.tiff';

    interface Window {
        ssrData?: IState;
    }

    interface RouteProps {
        /** 页面标题 */
        title: string;
        /** name, 页面key */
        name: string;
        /** icon */
        icon?: React.ReactNode;
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
        /** 权限控制 */
        roles?: string[];
        /** 是否ssr */
        isSSR?: boolean;
        /** ssr初始数据 */
        getInitialProps?: () => Promise<any>;
    }

    interface RoutePageProps extends RouteComponentProps {
        routes?: RouteProps[];
    }

    interface ServerListData<T = any> {
        total: number;
        rows: T[];
    }

    interface SelectData {
        value: string;
        label: string;
    }

    interface CasSelectData extends SelectData {
        children: CasSelectData[];
    }

    interface TreeItem {
        key: string;
        title: string;
        children: TreeItem[];
    }
    interface TreeSelectItem extends TreeItem {
        value: string;
        children: TreeSelectItem[];
    }

    interface BaseModel {
        _id?: string;
        createdAt?: string;
        updatedAt?: string;
        isDeleted?: boolean;
    }
}

declare module 'koa' {}
