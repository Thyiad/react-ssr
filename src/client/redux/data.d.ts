interface IState {
    doingItem: string;
    todoList: string[];
    name: string;
}

interface IAction<T = any> {
    type: string;
    payload: T;
}

interface IActions {
    [key: string]: (...rest: any[]) => IAction;
}

type IReducer = (state: IState, action: IAction) => IState;

interface IReducers {
    [key: string]: IReducer;
}

interface IReducerFile {
    actions: IActions;
    reducers: IReducers;
}
