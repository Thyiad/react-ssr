import { DEPLOY_ENV } from './index';

const apiHostDic: HostDicType = {
    dev: 'https://mgw-daily.zhongan.com',
    test: 'https://mgw-daily.zhongan.com',
    pre: 'https://gwbk-uat.zhongan.com',
    prd: 'https://gwbk.zhongan.com',
};
export const API_HOST = apiHostDic[DEPLOY_ENV];
