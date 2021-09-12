import { IState, IAction } from '../data';
import { UserItem } from '@/types/user';

export const actions = {
    setcurrentUser: (currentUser: UserItem): IAction => {
        return {
            type: 'setcurrentUser',
            payload: currentUser,
        };
    },
};

export const reducers = {
    setcurrentUser: (state: IState, action: IAction<UserItem>): IState => {
        return {
            ...state,
            currentUser: action.payload,
        };
    },
};

export default {
    actions,
    reducers,
};
