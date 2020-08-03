import React, { FC, createContext, useReducer, Dispatch, useMemo } from 'react';
import { buildActionReducers, initState, reducer, ReducerActions } from './store-builder';
import { IState, IAction } from './data';

export interface StoreContext {
    state: IState;
    dispatch: Dispatch<IAction>;
    actions: ReducerActions;
}

export const Store = createContext<any>({ state: initState });

export const Provider: FC = (props) => {
    // eslint-disable-next-line react/prop-types
    const { children } = props;
    const [state, dispatch] = useReducer(reducer, initState);
    const actions = useMemo(() => {
        return buildActionReducers(dispatch).actions;
    }, []);
    return <Store.Provider value={{ state, dispatch, actions }}>{children}</Store.Provider>;
};

export default {
    Store,
    Provider,
};
