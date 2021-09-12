import * as api from '@/constants/api';
import { LOGIN_COOKIE_KEY } from '@/constants/index';
import { LOGIN_PATHNAME } from '@/constants/url';
import { thyReq } from '@thyiad/util';
import { UserItem } from '@/types/user';

export const fetchCurrentUser = (): Promise<UserItem> => {
    return thyReq.post<UserItem>(api.FetchCurrentUser);
};

export const login = (loginParams: any): Promise<LoginRes> => {
    return thyReq.post<LoginRes>(api.Login, loginParams);
};

export interface LoginRes {
    token: string;
    role: string;
}
