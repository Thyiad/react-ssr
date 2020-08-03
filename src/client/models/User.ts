import * as api from '@/constant/api';
import { LOGIN_COOKIE_KEY, LOGIN_PATHNAME } from '@/constant/index';
import { thyReq } from '@thyiad/util';

export const fetchCurrentUserinfo = (): Promise<UserModel> => {
    return thyReq.post<UserModel>(api.FetchCurrentUserinfo);
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
