import { Dispatch } from 'react';
import reducers from './reducers/index';
import { IState, IAction, IReducers } from './data';
import { CTX_SSR_DATA } from '@/constants';
import { thyEnv } from '@thyiad/util';

const initState: IState = {
    currentUser: undefined,
};

export const getInitState = (ctx?: any): IState => {
    const ctxSsrData: IState = ctx ? ctx[CTX_SSR_DATA] : null;
    const winSsrData: IState | null | undefined = thyEnv.canUseWindow() ? window.ssrData : null;
    return {
        ...initState,
        ...ctxSsrData,
        ...winSsrData,
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
    const _dispatch = (actionResult: any) => {
        const resultType = Object.prototype.toString.call(actionResult);
        switch (resultType) {
            // 普通对象
            case '[object Object]':
                dispatch(actionResult);
                break;
            // 普通函数、异步函数
            case '[object Function]':
            case '[object AsyncFunction]':
                // 函数内自己dispatch
                const funResult = actionResult(_dispatch);
                // 返回对象外层dispatch
                return _dispatch(funResult);
                break;
            // Promise
            case '[object Promise]':
                return actionResult.then((res) => {
                    _dispatch(res);
                });
                break;
            default:
                break;
        }
    };
    Object.keys(reducers).forEach((kindKey) => {
        // @ts-ignore
        // 这一块ts提示不好搞，所以直接注掉了
        const currentReducer: any = reducers[kindKey];
        const currentActions: { [key: string]: any } = {};
        Object.keys(currentReducer['actions']).forEach((actionKey: string) => {
            currentActions[actionKey] = (...args: any[]) => {
                const action = currentReducer['actions'][actionKey].apply(null, args);
                return _dispatch(action);
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
