const createConfig = require('./create-config');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const path = require('path');
const childProcess = require('child_process');
const envConfig = require('./env-config');
const cwd = process.cwd();

const sysType = process.argv[2];
if (!['ssr', 'spa'].includes(sysType)) {
    console.log(chalk.red('sysType参数未指定，必须为以下之一：ssr、spa'));
    return;
}
envConfig.sysType = sysType;

const clientConfig = createConfig('client', false, envConfig);
const clientCompile = webpack(clientConfig);

let logged = false;
clientCompile.hooks.done.tapAsync('client_compile_done', (compilation, callback) => {
    console.log(chalk.blue(`client_compile_done`));
    callback && callback();
});
const clientStartTime = Date.now();
clientCompile.run((err) => {
    if (err) {
        console.log(chalk.red(err));
    }
    const clientEndTime = Date.now();
    console.log(`前端耗时：${clientEndTime - clientStartTime}ms`);
});
if (envConfig.sysType === 'spa') {
    return;
}

const serverConfig = createConfig('server', false, envConfig);
const serverCompile = webpack(serverConfig);
serverCompile.hooks.done.tap('server_compile_done', (compilation, callback) => {
    console.log(chalk.blue(`server_compile_done`));
    callback && callback();
});
serverCompile.run((err) => {
    if (err) {
        console.log(chalk.red(err));
    }
});
