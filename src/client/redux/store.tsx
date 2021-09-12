import React, { FC, createContext, useReducer, Dispatch, useMemo, PropsWithChildren } from 'react';
import { buildActionReducers, getInitState, reducer, ReducerActions } from './store-builder';
import { IState, IAction } from './data';

export interface StoreContext {
    state: IState;
    dispatch: Dispatch<IAction>;
    actions: ReducerActions;
    context?: any;
}

export const Store = createContext<any>({ state: getInitState() });

export interface StoreProviderProps {
    context?: any;
}

export const Provider: FC<StoreProviderProps> = (props: PropsWithChildren<StoreProviderProps>) => {
    const { context, children } = props;
    const [state, dispatch] = useReducer(reducer, getInitState(context));
    const actions = useMemo(() => {
        return buildActionReducers(dispatch).actions;
    }, []);
    return <Store.Provider value={{ state, dispatch, actions, context }}>{children}</Store.Provider>;
};

export default {
    Store,
    Provider,
};
