/* eslint-disable no-useless-escape */
export default (...strArray: string[]): string => {
    const resultArray: string[] = [];

    if (strArray[0].match(/^[^/:]+:\/*$/) && strArray.length > 1) {
        const first = strArray.shift();
        strArray[0] = `${first}${strArray[0]}`;
    }

    if (strArray[0].match(/^file:\/\/\//)) {
        strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1:///');
    } else {
        strArray[0] = strArray[0].replace(/^([^/:]+):\/*/, '$1://');
    }

    for (let i = 0; i < strArray.length; i++) {
        let component: string = strArray[i];

        if (typeof component !== 'string') {
            component = '';
            // throw new TypeError('不是字符串类型');
        }

        if (component === '') {
            // eslint-disable-next-line no-continue
            continue;
        }

        if (i > 0) {
            component = component.replace(/^[\/]+/, '');
        }
        if (i < strArray.length - 1) {
            component = component.replace(/[\/]+$/, '');
        } else {
            component = component.replace(/[\/]+$/, '/');
        }

        resultArray.push(component);
    }

    let str = resultArray.join('/');
    str = str.replace(/\/(\?|&|#[^!])/g, '$1');
    const parts = str.split('?');
    str = [parts.shift(), parts.length > 0 ? '?' : '', parts.join('&')].join('');

    return str;
};
