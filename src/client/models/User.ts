import * as api from '@client/constants/api';
import { LOGIN_COOKIE_KEY } from '@client/constants/index';
import { LOGIN_PATHNAME } from '@client/constants/url';
import { thyReq } from '@thyiad/util';

export const fetchCurrentUser = (): Promise<UserModel> => {
    return thyReq.post<UserModel>(api.FetchCurrentUser);
};

export const login = (loginParams: any): Promise<LoginRes> => {
    return thyReq.post<LoginRes>(api.Login, loginParams);
};

export interface UserModel extends BaseModel {
    account?: string;
    role?: string;
    name?: string;
    avatar?: string;
    sex?: string;
    phone?: string;
    email?: string;
}

export interface LoginRes {
    token: string;
    role: string;
}
