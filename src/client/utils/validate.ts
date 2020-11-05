import { Toast } from 'zarm';

export const NAME = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[\u2E80-\uFE4F]|[a-zA-Z]|\s|[·?])*$/; // 中英文
export const ENNAME = /^[A-Za-z][A-Za-z\s]*[A-Za-z]$/; // 英文
export const PHONE = /^1[3456789]\d{9}$/; // 手机
export const PHONE344 = /\B(?=(?:\d{4})+$)/; // 手机344格式
// 姓名特殊符号屏蔽
/* eslint-disable-next-line */
export const MARK = /[_`~!@#$%^&*()+=|{}':;'\\",\[\].<>/?~！@#￥%……&*（）£～~——+|{}【】《》〈〉「」〔〕［］｛｝\｜〃‖々『』〖〗∶＇＂＊＇＂︿＃＄％＿＋－＝＜...「ˉ¨‘；：”“’。，、？]|\n|\r|\t/;
/* eslint-disable-next-line */
export const CNNAME = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[\u2E80-\uFE4F]|\s)*$/; // 中文
/* eslint-disable-next-line */
export const EMAIL = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/; // email
export const POSTCODE = /^\d{6}$/; // 邮编
export const TEL = /^([0-9]{3,4}-?)?[0-9]{7,8}$/; // 固话
export const TELPHONE = /^1\d{10}$|^([0-9]{3,4}-?)?[0-9]{7,8}$/; // 手机固话
/* eslint-disable-next-line */
export const BANK = /^([1-9]\d{15,18})$/; // 银行卡号
/* eslint-disable-next-line */
export const MARKS = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/; // 表情
/* eslint-disable-next-line */
export const ADDRESS = /^(\D)([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[\u2E80-\uFE4F]|[a-zA-Z0-9]|\s|[_,.，。:/\\?])*(\D)$/; // 地址
// 地址特殊符号屏蔽
/* eslint-disable-next-line */
export const ADDRESSMARK = /[`~!@#$%^&*+=|{}';'"\[\]<>?~！@#￥%……&*（）£～~——+|{}《》〈〉「」()\-【】［］〔〕｛｝——·．\｜〃‖々『』〖〗∶＇＂＊＇＂︿＃＄％＿＋－＝＜...「ˉ¨｀￥ˇ•‘；：”“’、？]|\n|\r|\t/;
export const AMOUNT = /^\d+$/; // 金额

const citys = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外',
};

/** 验证是否是身份证 */
export const isIdCard = (cardNo: string): boolean => {
    // Rules.add('idcard', function(el, value, label, errorMsg){
    let value = cardNo.toLocaleUpperCase();
    if (citys[value.substr(0, 2)] === undefined) {
        return false;
    } // 非法地区
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
    if (/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(value)) {
        // 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
        // 下面分别分析出生日期和校验位
        const arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        const arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
        if (citys[value.substr(0, 2)] === undefined) {
            return false;
        }
        if (value.length === 15) {
            const arrSplit = value.match(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/) || '';
            // 检查生日日期是否正确
            const dtmBirth = new Date(`19${arrSplit[2]}/${arrSplit[3]}/${arrSplit[4]}`);
            if (dtmBirth.toString() !== 'Invalid Date') {
                // 将15位身份证转成18位
                // 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                let nTemp = 0;
                value = `${value.substr(0, 6)}19${value.substr(6, value.length - 6)}`;
                for (let i = 0; i < 17; i++) {
                    nTemp += parseInt(value.substr(i, 1), 10) * arrInt[i];
                }
                value += arrCh[nTemp % 11];
            }
        }
        if (value.length === 18) {
            const arrSplit = value.match(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/) || '';
            // 检查生日日期是否正确
            const dtmBirth = new Date(`${arrSplit[2]}/${arrSplit[3]}/${arrSplit[4]}`);
            if (dtmBirth.toString() !== 'Invalid Date') {
                // 检验18位身份证的校验码是否正确。
                // 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                let nTemp = 0;
                for (let i = 0; i < 17; i++) {
                    nTemp += parseInt(value.substr(i, 1), 10) * arrInt[i];
                }
                const valnum = arrCh[nTemp % 11];
                if (valnum === value.substr(17, 1)) {
                    return true;
                }
            }
        }
    }
    return false;
};

/** 验证联系人自动 */
export const validateContactMapping = {
    name: (value, showToast = true) => {
        if (!value) {
            showToast && Toast.show('姓名不能为空');
            return false;
        }
        if (value && (value.length < 2 || value.length > 32)) {
            showToast && Toast.show('姓名长度为2-32位含空格');
            return false;
        }
        if (!NAME.test(value) || MARKS.test(value)) {
            showToast && Toast.show('姓名只可输入中英文及空格和中间点·');
            return false;
        }
        if (MARKS.test(value)) {
            showToast && Toast.show('姓名中不可以包含表情');
            return false;
        }
        return true;
    },
    certificatesNumber_P: (value, showToast = true) => {
        if (!value) {
            showToast && Toast.show('证件号不能为空');
            return false;
        }
        return true;
    },
    certificatesNumber_H: (value, showToast = true) => {
        if (!value) {
            showToast && Toast.show('户口簿不能为空');
            return false;
        }
        return true;
    },
    certificatesNumber_I: (value, showToast = true) => {
        if (!value) {
            showToast && Toast.show('证件号不能为空');
            return false;
        }
        if (!isIdCard(value)) {
            showToast && Toast.show('请输⼊正确的身份证号');
            return false;
        }
        return true;
    },
    birthday: (value, showToast = true) => {
        if (!value) {
            showToast && Toast.show('生日不能为空');
            return false;
        }
        return true;
    },
    gender: (value, showToast = true) => {
        if (!value) {
            showToast && Toast.show('请选择性别');
            return false;
        }
        return true;
    },
    relationship: (value, showToast = true) => {
        if (!value) {
            showToast && Toast.show('请选择关系');
            return false;
        }
        return true;
    },
    isSocialSecurity: (value, showToast = true) => {
        if (!value) {
            showToast && Toast.show('请选择社保');
            return false;
        }
        return true;
    },
    nickName: (value, showToast = true) => {
        if (!value) {
            showToast && Toast.show('英文姓名不能为空');
            return false;
        }
        if (value && (value.length < 2 || value.length > 32)) {
            showToast && Toast.show('英文姓名长度为2-32位含空格');
            return false;
        }
        if (!ENNAME.test(value)) {
            showToast && Toast.show('英文姓名只可输入英文及空格和中间点·');
            return false;
        }
        if (MARKS.test(value)) {
            showToast && Toast.show('英文姓名中不可以包含表情');
            return false;
        }
        return true;
    },
    mobilePhone: (value, showToast = true) => {
        if (!value) {
            showToast && Toast.show('请输⼊手机号');
            return false;
        }
        if (!PHONE.test(value)) {
            showToast && Toast.show('请输入正确的⼿机号');
            return false;
        }
        return true;
    },
    occupation: (value, showToast = true) => {
        if (!value) {
            showToast && Toast.show('请选择职业');
            return false;
        }
        return true;
    },
    smsCode: (value, showToast = true) => {
        if (!value) {
            showToast && Toast.show('请输⼊短信验证码');
            return false;
        }
        return true;
    },
    // isSendSmsCode: (value, showToast = true) => {
    //   if (value === false) {
    //     showToast && Toast.show('请填写验证码');
    //     return false;
    //   }
    //   return true;
    // },
};
