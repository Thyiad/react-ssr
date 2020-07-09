import log4js from 'log4js';
import config from '../config';

const buildAppender = (category: string) => {
    return {
        type: 'dateFile',
        category: category,
        filename: `${config.baseDir}/logs/${category}`,
        pattern: 'yyyy-MM-dd.log',
        alwaysIncludePattern: true,
        maxLogSize: 104800,
        backups: 100,
    };
};

log4js.configure({
    appenders: {
        error: buildAppender('error'),
        info: buildAppender('info'),
    },
    categories: {
        error: { appenders: ['error'], level: 'error' },
        info: { appenders: ['info'], level: 'info' },
        default: {
            appenders: ['info'],
            level: 'info',
        },
    },
});

const loggerError = log4js.getLogger('error');
const loggerInfo = log4js.getLogger('info');

export default {
    /** 一般日志 */
    info: (message: any, ...rest: any[]) => {
        loggerInfo.info(message, rest.length > 0 ? rest : '');
    },
    /** 错误日志 */
    error: (message: any, ...rest: any[]) => {
        loggerError.error(message, rest.length > 0 ? rest : '');
    },
};
