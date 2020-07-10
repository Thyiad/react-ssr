console.log('server config process.env.NODE_ENV is: ', process.env.NODE_ENV);
console.log('process.cwd() is: ', process.cwd());

const isDev = true;
export default {
    isDev,
    baseDir: process.cwd(),
    port: isDev ? 8089 : process.env.PORT,
};
