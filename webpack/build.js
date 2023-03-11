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
const clientCompile = webpack(clientConfig, (error, stats) => {
    if (error) {
        console.log(chalk.red(error));
    } else if (stats.hasErrors()) {
        chalk.red('编译client发生了错误');
        process.stdout.write(stats.toString());
        process.exit(1);
    }
});

const dateStartClient = Date.now();
clientCompile.hooks.done.tap('client_compile_done', (compilation, callback) => {
    const dateEndClient = Date.now();
    console.log(chalk.blue(`\nclient_compile_done, timeSpan: ${(dateEndClient - dateStartClient) / 1000}s`));
    callback && callback();
    if (envConfig.sysType === 'spa') {
        setTimeout(() => {
            process.exit(0);
        });
    }
});
// clientCompile.run((err) => {
//     if (err) {
//         console.log(chalk.red(err));
//     }
// });
if (envConfig.sysType === 'spa') {
    return;
}

// server
const serverConfig = createConfig('server', false, envConfig);
const serverCompile = webpack(serverConfig, (error, stats) => {
    if (error) {
        chalk.red(error);
    } else if (stats.hasErrors()) {
        chalk.red('编译server发生了错误');
        process.stdout.write(stats.toString());
        process.exit(1);
    }
});

const dateStartServer = Date.now();
serverCompile.hooks.done.tap('server_compile_done', (compilation, callback) => {
    const dateEndServer = Date.now();
    console.log(chalk.blue(`\nserver_compile_done, timeSpan: ${(dateEndServer - dateStartServer) / 1000}s`));
    callback && callback();
});
serverCompile.run((err) => {
    if (err) {
        console.log(chalk.red(err));
    }
});
