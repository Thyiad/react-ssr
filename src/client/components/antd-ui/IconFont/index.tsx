import React, { FC, CSSProperties } from 'react';
import { createFromIconfontCN } from '@ant-design/icons';

const Font = createFromIconfontCN({
    scriptUrl: ['//at.alicdn.com/t/font_1975329_901dz1bfifi.js'],
});

export type IconTypes =
    | 'iconcha'
    | 'iconyuanhuan'
    | 'iconshuangyuan'
    | 'iconsanjiaoxing'
    | 'iconstudent'
    | 'iconclass'
    | 'iconstar'
    | 'iconsanjiaoxing-fill'
    | 'iconround-fill';

export interface IconFontProps {
    type: IconTypes;
    style?: CSSProperties;
    className?: string;
}
const IconFont: FC<IconFontProps> = ({ type, style, className }: IconFontProps) => {
    return <Font type={type} className={className} style={style} />;
};

export default IconFont;
