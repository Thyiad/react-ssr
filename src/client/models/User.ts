import * as api from '@client/constants/api';
import { LOGIN_COOKIE_KEY } from '@client/constants/index';

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
