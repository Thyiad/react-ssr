import { useContext } from 'react';
import { Store, StoreContext } from '../redux/store';
import { IState } from '@/redux/data';

export const useRedux = () => {
    const { state, dispatch, actions } = useContext<StoreContext>(Store);

    return {
        state,
        dispatch,
        actions,
    };
};

type StateKey = keyof IState;

export const useProp = (key: StateKey) => {
    const { state } = useContext<StoreContext>(Store);

    return state[key];
};
