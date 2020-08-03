console.log(`node_env: ${process.env.NODE_ENV}, app_env: ${process.env.APP_ENV}`);
export const HOST =
    process.env.NODE_ENV === 'development'
        ? 'https://easymock.thyiad.top/mock/5e15c46171d5710015e178e5/boilerplate' // 测试地址
        : ''; // 线上地址

export const CommonOK = `${HOST}/commonOK`;
export const CommonError = `${HOST}/commonError`;
export const CommonExpired = `${HOST}/commonExpired`;
export const CommonList = `${HOST}/tableList`;

export const FetchCurrentUserinfo = `${HOST}/getUserInfo`;
export const Login = `${HOST}/login`;
