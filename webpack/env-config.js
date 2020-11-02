const fs = require('fs');
const path = require('path');

let localEnvConfig = {};
const localEnvConfigPath = path.join(__dirname, 'env-config.local.js');
if (fs.existsSync(localEnvConfigPath)) {
    localEnvConfig = require(localEnvConfigPath);
}

/**
 * 注：不要修改该文件，如果要覆盖，请新建一个 env-config.local.js（已 ignore 掉）
 * 以保证此文件合并代码不会冲突
 */
module.exports = {
    /** 开发时监听的host */
    host: 'localhost',
    /** 开发时客户端端口 */
    clientPort: 8088,
    /** 开发时服务端端口 */
    serverPort: 8089,
    /** 系统类型: ssr | spa */
    sysType: 'ssr',
    /** 是否正在打包dll，暂时不启用dllPlugin和DllReferencePlugin */
    isDll: false,
    ...localEnvConfig,
};
