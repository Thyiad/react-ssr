import { UserModel } from '@/models/User';

export interface IState {
    /** 是否登录 */
    isLogin?: boolean;
    isSearchLoginStatus: boolean;
}

export interface IAction<T = any> {
    type: string;
    payload: T;
}

export interface IActions {
    [key: string]: (...rest: any[]) => IAction;
}

type IReducer = (state: IState, action: IAction) => IState;

export interface IReducers {
    [key: string]: IReducer;
}

export interface IReducerFile {
    actions: IActions;
    reducers: IReducers;
}
