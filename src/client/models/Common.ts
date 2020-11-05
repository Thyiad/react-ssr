import * as api from '@client/constants/api';
import axios from '@client/utils/axios';
import { dmTools } from '@dm/utils';
import { Context } from 'koa';

const cacheCmsData: { [key: string]: any } = {};

/**
 * 获取cms数据
 * @param code 资源位code
 * @param ctx koa content
 */
export const getCmsData = <T>(code: string, ctx?: Context): Promise<(ICmsResult & { [key in keyof T]: T[key] })[]> => {
    if (cacheCmsData[code] && dmTools.isClient()) {
        return Promise.resolve(cacheCmsData[code]);
    }
    setTimeout(() => {
        return Promise.resolve([]);
    }, 1000);
    return axios.post(api.getCmsSource, { resourceCode: code, noToast: true }, undefined, ctx).then((res) => {
        cacheCmsData[code] = res;
        return res;
    });
};

export interface ICmsResult {
    /** id */
    id: number;
    /** 跳转地址 */
    gotoUrl?: string;
    /** 图片地址 */
    imageUrl?: string;
    materialName?: string;
    materialDesc?: string;
    money?: string;
    markIcon?: string;
    rule?: string;
    bizPrefix?: string;
    exactMatch?: string;
    bizMatch?: string;
    /** chance */
    chance?: string;
    template?: string;
    goodscode?: string;
}
