import { ResponseData } from './data';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { LOGIN_COOKIE_KEY, LOGIN_PATHNAME } from '@/constant/index';
import cookie from '@/utils/cookie';
import { toast } from '@/utils/ui';
import { simpleStringify } from '@/utils/str';
import { logout } from '@/utils/url';

/**
 * ajax请求状态码
 */
enum AjaxStatus {
    Success = 2000,
    Error = 3000,
    Expired = 4000,
}

/**
 * axios实例
 */
const axiosInstance = axios.create({
    baseURL: '/',
    timeout: 30000,
    responseType: 'json',
});

/**
 * request中间件
 */
axiosInstance.interceptors.request.use((req) => {
    console.log(
        `======== request start ======== method: ${req.method} url: ${req.url} headers:${simpleStringify(
            req.headers || {},
        )} params: ${simpleStringify(req.data || req.params || {})}`,
    );
    return req;
});

const request = <T>(
    type: 'get' | 'post',
    url: string,
    data?: any,
    headers?: { [key: string]: string },
    config?: { noToast?: boolean; formType?: boolean },
): Promise<T> => {
    headers = headers || {};
    headers[LOGIN_COOKIE_KEY] = cookie.get(LOGIN_COOKIE_KEY) || '';
    if (config?.formType) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    const req =
        type === 'get'
            ? axiosInstance.get<ResponseData<T>>(url, {
                  headers,
                  data,
              })
            : axiosInstance.post<ResponseData<T>>(url, data, {
                  headers,
              });

    return req
        .then((res) => {
            const responseData: ResponseData = res.data || {};

            if (responseData.code === AjaxStatus.Success) {
                return responseData.data;
            } else if (responseData.code === AjaxStatus.Expired) {
                responseData.message = 'token已过期，请重新登录';
                logout();
            }

            return Promise.reject(responseData);
        })
        .catch((err) => {
            config?.noToast && toast(err.message || '未知错误', 'error');
            return Promise.reject(err);
        });
};

export const get = <T>(
    url: string,
    data?: { [key: string]: any },
    headers?: { [key: string]: string },
    config?: { noToast?: boolean; formType?: boolean },
): Promise<T> => {
    return request('get', url, data, headers, config);
};

export const post = <T>(
    url: string,
    data?: { [key: string]: any },
    headers?: { [key: string]: string },
    config?: { noToast?: boolean; formType?: boolean },
): Promise<T> => {
    return request('post', url, data, headers, config);
};

export default {
    get,
    post,
};
