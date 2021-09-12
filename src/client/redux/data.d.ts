import { UserItem } from '@/types/user';

export interface IState {
    currentUser?: UserItem;
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
