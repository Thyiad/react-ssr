import { IState, IAction } from '../data';
import { UserModel } from '@/models/User';

export const actions = {
    setcurrentUser: (currentUser: UserModel): IAction => {
        return {
            type: 'setcurrentUser',
            payload: currentUser,
        };
    },
};

export const reducers = {
    setcurrentUser: (state: IState, action: IAction<UserModel>): IState => {
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
