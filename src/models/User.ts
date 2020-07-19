import * as api from '@/constant/api';
import { LOGIN_COOKIE_KEY, LOGIN_PATHNAME } from '@/constant/index';
import { post } from '@/utils/axios';

export const fetchCurrentUserinfo = (): Promise<UserModel> => {
    return post<UserModel>(api.FetchCurrentUserinfo);
};

export const login = (loginParams: any): Promise<LoginRes> => {
    return post<LoginRes>(api.Login, loginParams);
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
