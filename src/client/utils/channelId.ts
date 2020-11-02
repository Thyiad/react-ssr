import { ChannelIdEnum } from '@client/types/enum';
import { Context } from 'koa';

/** 获取发送给接口的channelId */
export const getRequestChannelId = (ctx?: Context): string => {
    // todo: 如果域名有做渠道区分，此处需要获取真实的channeiId
    return ChannelIdEnum.app;
};
