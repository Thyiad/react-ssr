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

// client
const clientConfig = createConfig('client', false, envConfig);
const clientCompile = webpack(clientConfig);

const dateStartClient = Date.now();
clientCompile.hooks.done.tapAsync('client_compile_done', (compilation, callback) => {
    const dateEndClient = Date.now();
    console.log(chalk.blue(`client_compile_done, timeSpan: ${(dateEndClient - dateStartClient) / 1000}s`));
    callback && callback();
});
clientCompile.run((err) => {
    if (err) {
        console.log(chalk.red(err));
    }
});
if (envConfig.sysType === 'spa') {
    return;
}

// server
const serverConfig = createConfig('server', false, envConfig);
const serverCompile = webpack(serverConfig);

const dateStartServer = Date.now();
serverCompile.hooks.done.tap('server_compile_done', (compilation, callback) => {
    const dateEndServer = Date.now();
    console.log(chalk.blue(`server_compile_done, timeSpan: ${(dateEndServer - dateStartServer) / 1000}s`));
    callback && callback();
});
serverCompile.run((err) => {
    if (err) {
        console.log(chalk.red(err));
    }
});
