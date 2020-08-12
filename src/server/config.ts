import envConfig from '../../webpack/env-config';

const isDev = process.env.NODE_ENV === 'development';

export default {
    isDev,
    baseDir: process.cwd(),
    port: isDev ? envConfig.serverPort : process.env.PORT,
    useRem: false,
};
