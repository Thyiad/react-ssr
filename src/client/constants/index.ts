/**
 * token的cookie名
 */
export const LOGIN_COOKIE_KEY = 'zaLoginCookieKey';

/**
 * 发送请求时token的header名
 */
export const REQUEST_HEADER_TOKEN_NAME = 'accessKey';

export const BASE_NAME = '';

export const CTX_SSR_DATA = 'clientSsrData';

export const IS_DEV = process.env.NODE_ENV === 'development';

/**
 * 开发环境固定dev，正式打包由node端注入变量
 */
export const DEPLOY_ENV: DeployEnv = IS_DEV ? 'dev' : window.DEPLOY_ENV || 'prd';

console.log('client deploy env is: ' + DEPLOY_ENV);
