console.log(`node_env: ${process.env.NODE_ENV}, app_env: ${process.env.APP_ENV}`);
export const HOST =
    process.env.NODE_ENV === 'development'
        ? 'https://easymock.thyiad.top/mock/5fabb662f398e40020f988dd/boilerplate' // 测试地址
        : ''; // 线上地址

export const CommonOK = `${HOST}/commonOK`;
export const CommonError = `${HOST}/commonError`;
export const CommonExpired = `${HOST}/commonExpired`;
export const CommonList = `${HOST}/tableList`;

export const UPLOAD_OSS = `${HOST}/api/user/uploadOSS`;
export const FetchCurrentUser = `${HOST}/getUserInfo`;
export const Login = `${HOST}/login`;
