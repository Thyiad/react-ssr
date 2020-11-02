/**
 * 注：不要修改该文件，如果要覆盖，请新建一个 env-config.local.js（已 ignore 掉）
 * 以保证此文件合并代码不会冲突
 */
let localEnvConfig = {};
try {
    localEnvConfig = require('./env-config.local');
} catch (error) {}

module.exports = {
    /** 开发时监听的host */
    host: localEnvConfig.host || 'localhost',
    /** 开发时客户端端口 */
    clientPort: localEnvConfig.clientPort || 8088,
    /** 开发时服务端端口 */
    serverPort: localEnvConfig.serverPort || 8089,
    /** 系统类型: ssr | spa */
    sysType: localEnvConfig.sysType || 'ssr',
    /** 是否正在打包dll，暂时不启用dllPlugin和DllReferencePlugin */
    isDll: localEnvConfig.isDll || false,
};
