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
const clientCompile = webpack(clientConfig, (error, stats) => {
    if (error) {
        console.log(chalk.red(error));
    } else if (stats.hasErrors()) {
        chalk.red('编译client发生了错误');
        process.stdout.write(stats.toString());
        // process.exit(1);
    }
});

let loggedClient = false;
const dateStartClient = Date.now();
clientCompile.hooks.done.tapAsync('client_compile_done', (compilation, callback) => {
    if (!loggedClient) {
        const dateEndClient = Date.now();
        console.log(chalk.blue(`\nclient_compile_done, timeSpan: ${(dateEndClient - dateStartClient) / 1000}s`));
        loggedClient = true;
    } else {
        console.log(chalk.blue(`\nclient_recompile_done`));
    }
    callback && callback();
});
const clientDevServer = new webpackDevServer(clientConfig.devServer, clientCompile);
clientDevServer.startCallback((err) => {
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
        console.log(chalk.blue(`\nserver_compile_done, timeSpan: ${(dateEndServer - dateStartServer) / 1000}s`));
        loggedServer = true;
    } else {
        console.log(chalk.blue(`\nserver_recompile_done`));
    }

    // 手动kill方式
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
    console.log(chalk.blue(`server has started at ${envConfig.serverPort}`));
    callback && callback();
});
serverCompile.watch(serverConfig.devServer.watchOptions, (err) => {
    if (err) {
        console.log(chalk.red(err));
    }
});
