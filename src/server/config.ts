console.log('server config process.env.NODE_ENV is: ', process.env.NODE_ENV);

const isDev = true;
export default {
    isDev,
    baseDir: __dirname,
    port: isDev ? 8089 : process.env.PORT,
};
