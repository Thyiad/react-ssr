import React, { FC, CSSProperties, ComponentProps } from 'react';
import { createFromIconfontCN } from '@ant-design/icons';

const Font = createFromIconfontCN({
    scriptUrl: ['//at.alicdn.com/t/font_1975329_hnbb2ta451n.js'],
});

export const iconFontKeys = [
    'iconweixin',
    'iconzhentong',
    'iconpill',
    'iconmemo',
    'iconyiliao',
    'iconyiliaodoc',
    'iconcha',
    'iconyuanhuan',
    'iconshuangyuan',
    'iconsanjiaoxing',
    'iconstudent',
    'iconclass',
    'iconstar',
    'iconsanjiaoxing-fill',
    'iconround-fill',
    'iconvideo',
    'iconeraser',
    'iconface-jingya',
    'iconface-sad',
    'iconface-normal',
    'iconface-happy',
    'iconlingdang',
    'iconqizhi',
    'iconlaba',
    'iconimage',
] as const;

export type IconTypes = typeof iconFontKeys[number];

type IconFontProps = ComponentProps<typeof Font> & { type: IconTypes };
const IconFont: FC<IconFontProps> = (props: IconFontProps) => {
    return <Font {...props} />;
};

export default IconFont;
