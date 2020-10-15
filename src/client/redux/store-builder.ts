import { Dispatch } from 'react';
import reducers from './reducers/index';
import { IState, IAction, IReducers } from './data';
import { MessageBarType } from '@fluentui/react';

const initState: IState = {
    currentUser: undefined,
};

export const getInitState = (): IState => {
    let ssrData: IState = null;
    const isBrowser = new Function('try {return this===window;}catch(e){ return false;}');
    if (isBrowser()) {
        ssrData = window.ssrData;
    }
    return {
        ...ssrData,
        ...initState,
    };
};

export type ReducerKinds = keyof typeof reducers;
export type ReducerActions = { [key in ReducerKinds]: typeof reducers[key]['actions'] };

// buildActions
// buildReducers
let reducerActions: ReducerActions;
let reducerHandle: IReducers;
export const buildActionReducers = (
    dispatch: Dispatch<IAction>,
): { actions: ReducerActions; reducerHandle: IReducers } => {
    Object.keys(reducers).forEach((kindKey) => {
        // @ts-ignore
        // 这一块ts提示不好搞，所以直接注掉了
        const currentReducer: any = reducers[kindKey];
        const currentActions: { [key: string]: any } = {};
        Object.keys(currentReducer['actions']).forEach((actionKey: string) => {
            currentActions[actionKey] = (...args: any[]) => {
                const action = currentReducer['actions'][actionKey].apply(null, args);
                dispatch(action);
            };
        });
        reducerActions = {
            ...reducerActions,
            [kindKey]: currentActions,
        };
        Object.keys(currentReducer['reducers']).forEach((reducerKey) => {
            reducerHandle = {
                ...reducerHandle,
                [reducerKey]: currentReducer['reducers'][reducerKey],
            };
        });
    });

    return {
        actions: reducerActions,
        reducerHandle: reducerHandle,
    };
};

export const reducer = (state: IState, action: IAction): IState => {
    if (reducerHandle[action.type]) {
        console.log('%c action', 'color:#CD533D', action);
        const data = reducerHandle[action.type](state, action);
        console.log('%c next state', 'color:#12c286', data);
        return data;
    }
    return state;
};

export default {
    initState,
    buildActionReducers,
    reducer,
};
