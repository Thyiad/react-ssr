// 支持ie8+
const ATTR_BINDED = 'ilogbinded';

const getInnerText = (element: HTMLElement): string => {
    return typeof element.textContent === 'string' ? element.textContent : element.innerText;
};
export interface IAsmType {
    href?: string;
    txt: string;
    asm: string;
}

let pushAsm = (data: IAsmType) => {
    const { _za, location } = window;
    if (_za && typeof _za.pushAsm === 'function') {
        data.href = data.href || location.href;
        _za.pushAsm(data);
        pushAsm = (d) => {
            d.href = d.href || location.href;
            _za.pushAsm(d);
        };
    }
};
let pushData = () => {
    const { _za } = window;
    if (_za && typeof _za.pushData === 'function') {
        if (_za) {
            _za.pushData();
        }
        pushData = () => {
            _za.pushData();
        };
    }
};
const bind = (target: HTMLElement, asm: string) => {
    if (target) {
        const isBinded = target.getAttribute(ATTR_BINDED);
        if (asm && isBinded === null) {
            const href = encodeURIComponent(window.location.href);
            let txt = getInnerText(target);
            txt = txt.trim();
            pushAsm({ href, txt, asm });
        }
    }
};
export default {
    bind,
    pushAsm(data: IAsmType) {
        pushAsm(data);
    },
    pushData() {
        pushData();
    },
};
