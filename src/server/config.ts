const isDev = process.env.NODE_ENV === 'development';
export default {
    isDev,
    baseDir: process.cwd(),
    port: isDev ? 8089 : process.env.PORT,
};
