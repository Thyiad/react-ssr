const createConfig = require('./create-config');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();
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
const clientConfig = createConfig('client', true, envConfig);
// const clientCompile = webpack(smp.wrap(clientConfig));
const clientCompile = webpack(clientConfig);

const dateStartClient = Date.now();
let loggedClient = false;
clientCompile.hooks.done.tapAsync('client_compile_done', (compilation, callback) => {
    if (!loggedClient) {
        const dateEndClient = Date.now();
        console.log(chalk.blue(`client_compile_done, timeSpan: ${(dateEndClient - dateStartClient) / 1000}s`));
        loggedClient = true;
    } else {
        console.log(chalk.blue(`client_recompile_done`));
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
const serverConfig = createConfig('server', true, envConfig);
const serverCompile = webpack(serverConfig);

let serverChildProcess = false;
let loggedServer = false;
const dateStartServer = Date.now();
serverCompile.hooks.done.tap('server_compile_done', (compilation, callback) => {
    if (!loggedServer) {
        const dateEndServer = Date.now();
        console.log(chalk.blue(`server_compile_done, timeSpan: ${(dateEndServer - dateStartServer) / 1000}s`));
        loggedServer = true;
    } else {
        console.log(chalk.blue(`server_recompile_done`));
    }

    // 手动kill
    if (serverChildProcess) {
        const killResult = serverChildProcess.kill('SIGINT');
        console.log('kill exist server: ' + killResult);
    }
    serverChildProcess = childProcess.spawn('node', [path.resolve(cwd, `dist/server/main.js`)]);
    serverChildProcess.stdout.on('data', (data) => {
        console.log(`server out: ${data}`);
    });
    serverChildProcess.stderr.on('data', (data) => {
        console.error(`server error: ${data}`);
    });

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
