import { useContext } from 'react';
import { Store, StoreContext } from '../redux/store';

export const useRedux = () => {
    const { state, dispatch, actions, context } = useContext<StoreContext>(Store);

    return {
        state,
        dispatch,
        actions,
        context,
    };
};
