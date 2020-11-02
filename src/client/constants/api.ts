import { DEPLOY_ENV } from './index';

const apiHostDic: HostDicType = {
    dev: 'https://mgw-daily.zhongan.com',
    test: 'https://mgw-daily.zhongan.com',
    pre: 'https://gwbk-uat.zhongan.com',
    prd: 'https://gwbk.zhongan.com',
};
const evtHostDic: HostDicType = {
    dev: 'https://evt-test3.zhongan.com',
    test: 'https://evt-test3.zhongan.com',
    pre: 'https://evt-uat.zhongan.com',
    prd: 'https://evt.zhongan.com',
};
export const HOST_GW = apiHostDic[DEPLOY_ENV];
export const HOST_EVT = evtHostDic[DEPLOY_ENV];
