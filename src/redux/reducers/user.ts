import { IState, IAction } from '../data';
import { UserModel } from '@/models/User';

export const actions = {
    setCurrentUserinfo: (currentUserinfo: UserModel): IAction => {
        return {
            type: 'setCurrentUserinfo',
            payload: currentUserinfo,
        };
    },
};

export const reducers = {
    setCurrentUserinfo: (state: IState, action: IAction<UserModel>): IState => {
        return {
            ...state,
            currentUserinfo: action.payload,
        };
    },
};

export default {
    actions,
    reducers,
};
