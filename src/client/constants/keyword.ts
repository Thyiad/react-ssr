/** axios 的content-type 常量 */
export const AXIOS_CONTENT_TYPE = 'Content-Type';
/** axios x-www-form-urlencoded 类型 常量 */
export const AXIOS_FORM_URLENCODED = 'application/x-www-form-urlencoded';
/** abtest的query */
export const ABT_QUERY_KEY = 'abt';
/** bizOrigin */
export const BIZ_ORIGIN = 'bizOrigin';
/** 渠道唯一key */
export const UNIQUE_BIZ_KEY = 'uniqueBizKey';
/** 分享code */
export const SHARE_CODE = 'shareCode';
/** 显示模板 */
export const TEMPLATE_TYPE = 'templateType';
/** 活动code */
export const ACTIVITY_CODE = 'activityCode';
/** 赠险加购页面的版型 */
export const PAGE_TYPE = 'pageType';
/** 千里眼biz cookie */
export const ISEE_BIZ = 'ISEE_BIZ';
/** 开发平台code */
export const PROMOTION_CODE = 'promotionCode';
/** biz链接 ~ 符号分隔 */
export const LINK_BIZ = 'linkBiz';
/** 真实channelId */
export const REAL_CHANNEL_ID = 'realChannelId';
/** 第三方存储数据 */
export const THIRDPART_CACHE_KEY = 'thirdData';
/** 客服ID */
export const QW_CRM_BIZNO = 'qwCrmBizNo';
export const BIZ_ORIGIN_MAPPING = {
    80: 'APPdirect',
    94: 'H5direct',
    90: 'PCdirect',
    8: 'WXdirect',
};
/** 回传服务端的cookie */
export const HEADER_COOKIE_KEYS = [
    '__utrace',
    'bizOrigin',
    'customProductName',
    'msgSendId',
    PROMOTION_CODE,
    'bizContent',
    'marketBizChannel',
    'marketBizCode',
    'marketBizContent',
    'mgmBuyCode',
    'bc',
    'abt',
    'visaOrderNo',
    'applyCountry',
    'travelDate',
    // 'zaLoginCookieKey',
    'esc',
    'ec',
    SHARE_CODE,
    LINK_BIZ,
    ACTIVITY_CODE,
    'renew',
    'channelId',
    ISEE_BIZ,
    REAL_CHANNEL_ID,
    THIRDPART_CACHE_KEY,
    QW_CRM_BIZNO,
];

export const BODY_CLASS_NAME = {
    h5: 'h5-header',
    iphonex: 'iphonex',
    fullscreen: 'android-fullscreen',
    wxminprogram: 'wx-minprogram',
    wechat: 'wechat',
    toutiao: 'toutiao',
    ttminprogram: 'tt-minprogram',
    app: 'za-app',
    ios: 'ios',
    android: 'android',
};
