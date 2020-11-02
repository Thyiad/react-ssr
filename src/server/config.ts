import envConfig from '../../webpack/env-config';

const isDev = process.env.NODE_ENV === 'development';

const config = {
    isDev,
    useRem: true,
    baseDir: process.cwd(),
    port: isDev ? envConfig.serverPort : 8080,
    deployEnv: isDev ? 'dev' : process.env.DEPLOY_ENV || 'prd',
};

console.log(
    `server node env is: ${process.env.NODE_ENV}, server baseDir is: ${config.baseDir}, server deploy env is: ${config.deployEnv}`,
);

export default config;
