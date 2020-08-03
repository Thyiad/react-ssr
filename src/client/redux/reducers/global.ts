import { IState, IAction } from '../data';

export const actions = {
    setKeyValue: (key: string, value: any): IAction => {
        return {
            type: 'setKeyValue',
            payload: {
                key,
                value,
            },
        };
    },
};

export const reducers = {
    setKeyValue: (state: IState, action: IAction<{ key: string; value: any }>): IState => {
        return {
            ...state,
            [action.payload.key]: action.payload.value,
        };
    },
};

export default {
    actions,
    reducers,
};
