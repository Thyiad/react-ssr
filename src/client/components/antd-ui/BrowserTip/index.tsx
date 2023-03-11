import { removeCSS, updateCSS } from './dynamicCSS';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { Button, Modal } from 'antd';
import './index.css';

interface BrowserItem {
    logo: string;
    name: string;
    url: string;
}

interface BrowerTipProps {
    needShow?: () => boolean;
    browserList?: BrowserItem[];
    tipContent?: React.ReactNode;
}

const whereCls = 'ant-where-checker';
const localKeyLastShowDate = 'brwoser_tip_show_last_date';
const defaultBrowserList: BrowserItem[] = [
    {
        logo: 'https://static.yirenyian.com/opoc/browser/edge.png',
        name: '微软edge浏览器',
        url: 'https://www.microsoft.com/zh-cn/edge',
    },
    {
        logo: 'https://static.yirenyian.com/opoc/browser/chrome.png',
        name: '谷歌chrome浏览器',
        url: 'https://www.google.cn/chrome/',
    },
    {
        logo: 'https://static.yirenyian.com/opoc/browser/360x.png',
        name: '360极速浏览器X',
        url: 'https://browser.360.cn/eex/index.html',
    },
];
const defaultNeedShow = () => {
    const lastDate = window.localStorage.getItem(localKeyLastShowDate);
    const date = new Date();
    const today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    const show = lastDate !== today;
    window.localStorage.setItem(localKeyLastShowDate, today);

    return show;
};

const BrowserTip: FC<BrowerTipProps> = (props) => {
    const { needShow, tipContent, browserList } = props;

    const defaultTipContent = useMemo(() => {
        return (
            <div className="browser-tip-wrapper">
                <div>
                    各位老师，七维一人一案平台近期做了统一的组件升级，您目前使用的浏览器版本过低，网络安全性欠佳，为给学校数据提供更强大的网络保护，请使用以下浏览器访问。
                </div>
                <div style={{ marginTop: 6 }}>
                    再次感谢大家对七维一人一案平台的支持，七维会持续为您提供更好的软件支持服务！
                </div>
                <div className="browser-list">
                    {(browserList || defaultBrowserList).map((item) => (
                        <div key={item.name} className="browser-item">
                            <img className="browser-logo" src={item.logo} />
                            <div className="browser-name">{item.name}</div>
                            <Button className="browser-btn" size="small" href={item.url} target="_blank">
                                前往下载
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }, [browserList]);

    React.useEffect(() => {
        const p = document.createElement('p');
        p.className = whereCls;
        p.style.position = 'fixed';
        p.style.pointerEvents = 'none';
        p.style.visibility = 'hidden';
        p.style.width = '0';
        document.body.appendChild(p);
        updateCSS(
            `
:where(.${whereCls}) {
  content: "__CHECK__";
}
    `,
            whereCls,
        );

        // Check style
        const { content } = getComputedStyle(p);
        const isSupport = String(content).includes('CHECK');

        if (!isSupport) {
            const canShow = (needShow || defaultNeedShow)();
            if (canShow) {
                Modal.info({
                    width: 660,
                    title: '升级提示',
                    content: tipContent || defaultTipContent,
                });
            }
        }

        return () => {
            document.body.removeChild(p);
            removeCSS(whereCls);
        };
    }, [needShow, tipContent, defaultTipContent]);

    return <div></div>;
};

export default BrowserTip;
