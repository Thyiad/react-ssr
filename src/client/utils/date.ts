/** 日期格式化 */
export const formatDate = (dateFrom: number | string, format = 'yyyy-MM-dd hh:mm:ss') => {
    if (dateFrom === 0 || dateFrom === '') {
        return '';
    }
    if (Object.prototype.toString.call(dateFrom) === '[object String]') {
        dateFrom = dateFrom.toString().replace(/-/g, '/');
    }
    const date = new Date(dateFrom);
    const o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds(), // 毫秒
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length));
    }
    Object.keys(o).forEach((k) => {
        if (new RegExp(`(${k})`).test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length));
        }
    });
    return format;
};
