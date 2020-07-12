const createConfig = require('./create-config');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const path = require('path');
const childProcess = require('child_process');

const cwd = process.cwd();
const clientConfig = createConfig("client", false);
const clientCompile = webpack(clientConfig);

let logged = false;
clientCompile.hooks.done.tapAsync("client_compile_done", (compilation, callback) => {
    console.log(chalk.blue(`client_compile_done`))
    callback && callback();
})
clientCompile.run(err=>{
    if(err){
        console.log(chalk.red(err))
    }
})

const serverConfig = createConfig("server", false);
const serverCompile = webpack(serverConfig);
serverCompile.hooks.done.tap("server_compile_done", (compilation, callback)=>{
    console.log(chalk.blue(`server_compile_done`))
    callback && callback();
})
serverCompile.run(err=>{
    if(err){
        console.log(chalk.red(err))
    }
})