const _stringify = (data: { [key: string]: any }) => {
    return `{${Object.keys(data)
        .map((key) => {
            return `"${key}": "${data[key] ? data[key].toString() : ''}"`;
        })
        .join(',')}}`;
};

/** 简单可是化json */
export const simpleStringify = (data: { [key: string]: any } | [{ [key: string]: any }]) => {
    if (Array.isArray(data)) {
        return `[${data
            .map((item) => {
                return _stringify(item);
            })
            .join(',')}]`;
    }
    return _stringify(data);
};

/**
 * JSON.stringy
 * @param data 格式化数据
 * @param defaultValue 解析错误后的数据
 */
export const jsonStringify = (data, defaultValue?: string) => {
    try {
        return JSON.stringify(data);
    } catch (e) {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        console.log('JSON stringify error: ', e && e.stack, data);
        throw e;
    }
};
/**
 * JSON.parse
 * @param json 格式化数据
 * @param defaultValue 解析错误后的数据
 */
export const jsonParse = (json: string, defaultValue?: any) => {
    try {
        return JSON.parse(json);
    } catch (e) {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        throw e;
    }
};
