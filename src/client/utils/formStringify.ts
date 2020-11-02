/* eslint-disable */
export const formStringify = (obj: { [key: string]: any }) => {
    let query = '';
    let name;
    let value;
    let fullSubName;
    let subName;
    let subValue;
    let innerObj;
    let i;
    for (name in obj) {
        value = obj[name];
        if (value instanceof Array) {
            for (i = 0; i < value.length; ++i) {
                subValue = value[i];
                fullSubName = `${name}[${i}]`;
                innerObj = {};
                innerObj[fullSubName] = subValue;
                query += `${formStringify(innerObj)}&`;
            }
        } else if (value instanceof Object) {
            for (subName in value) {
                subValue = value[subName];
                fullSubName = `${name}.${subName}`; // + '[' + subName + ']';
                innerObj = {};
                innerObj[fullSubName] = subValue == null ? '' : subValue;

                query += `${formStringify(innerObj)}&`;
            }
        } else if (value !== undefined && value !== null)
            query += `${encodeURIComponent(name)}=${encodeURIComponent(value)}&`;
    }
    return query.length ? query.substr(0, query.length - 1) : query;
};

export const formParse = (str: string) => {
    const result: { [key: string]: string } = {};
    let data: string[];
    data = str.split('&');
    if (data.length === 0) {
        return result;
    }
    data.forEach((item) => {
        const items: string[] = item.split('=');
        if (items[0]) {
            result[items[0]] = decodeURIComponent(items.slice(1).join('=') || '');
        }
    });
    return result;
};
