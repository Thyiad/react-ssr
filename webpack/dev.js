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

// 编译client
const clientConfig = createConfig('client', true, envConfig, sysType);
const clientCompile = webpack(clientConfig);

let logged = false;
clientCompile.hooks.done.tapAsync('client_compile_done', (compilation, callback) => {
    if (!logged) {
        console.log(chalk.blue(`client has started at ${clientConfig.devServer.port}`));
        logged = true;
    }
    callback && callback();
});
const clientDevServer = new webpackDevServer(clientCompile, clientConfig.devServer);
clientDevServer.listen(clientConfig.devServer.port, (err) => {
    if (err) {
        console.log(chalk.red(err));
    }
});
if (envConfig.sysType === 'spa') {
    return;
}

// 编译server
const serverConfig = createConfig('server', true, envConfig, sysType);
const serverCompile = webpack(serverConfig);
let serverChildProcess = false;
serverCompile.hooks.done.tap('server_compile_done', (compilation, callback) => {
    console.log(chalk.blue(`server_compile_done`));

    // 手动kill方式
    if (serverChildProcess) {
        serverChildProcess.kill();
    }
    serverChildProcess = childProcess.spawn('node', [path.resolve(cwd, `dist/server/main.js`)]);
    serverChildProcess.stdout.on('data', (data) => {
        console.log(`server out: ${data}`);
    });
    serverChildProcess.stderr.on('data', (data) => {
        console.error(`server error: ${data}`);
    });
    console.log(chalk.blue(`server has started at ${envConfig.serverPort}`));

    // // nodemon方式
    // if (!serverChildProcess) {
    //     serverChildProcess = childProcess.spawn('nodemon', [
    //         '--watch',
    //         path.resolve(cwd, `dist/server`),
    //         '--ignore',
    //         '*hot-update.json',
    //         '--ignore',
    //         '*hot-update.js',
    //         '--ignore',
    //         'loadable-stats.json',
    //         path.resolve(cwd, `dist/server/main.js`),
    //     ]);
    //     serverChildProcess.stdout.on('data', (data) => {
    //         console.log(`server out: ${data}`);
    //     });
    //     serverChildProcess.stderr.on('data', (data) => {
    //         console.error(`server error: ${data}`);
    //     });
    //     console.log(chalk.blue(`server has started at ${envConfig.serverPort}`));
    // }
    callback && callback();
});
serverCompile.watch(serverConfig.devServer.watchOptions, (err) => {
    if (err) {
        console.log(chalk.red(err));
    }
});
