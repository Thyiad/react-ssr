import React, { FC, createContext, useReducer, Dispatch, useMemo, PropsWithChildren } from 'react';
import { buildActionReducers, getInitState, reducer, ReducerActions } from './store-builder';
import { IState, IAction } from './data';
import { Context } from 'koa';

export interface StoreContext {
    state: IState;
    dispatch: Dispatch<IAction>;
    actions: ReducerActions;
    context?: Context;
}

export const Store = createContext<any>({ state: getInitState() });

export interface StoreProviderProps {
    context?: Context;
}

export const Provider: FC<PropsWithChildren<StoreProviderProps>> = (props: PropsWithChildren<StoreProviderProps>) => {
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
