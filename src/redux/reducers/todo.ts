import { IState, IAction } from '../data';

export const actions = {
    setDoingItem: (item: string): IAction => {
        return {
            type: 'setDoingItem',
            payload: item,
        };
    },
    setTodoList: (todoList: string[]): IAction => {
        return {
            type: 'setTodoList',
            payload: todoList,
        };
    },
};

export const reducers = {
    setDoingItem: (state: IState, action: IAction<string>): IState => {
        return {
            ...state,
            doingItem: action.payload,
        };
    },
    setTodoList: (state: IState, action: IAction<string[]>): IState => {
        return {
            ...state,
            todoList: action.payload,
        };
    },
};

export default {
    actions,
    reducers,
};
