import { useEffect } from 'react';
import { thyEnv } from '@thyiad/util';
import { QUIT_GUIDE_HASH } from '@client/constants/keyword';

let isShow = false;
/**
 * 通过挽留弹窗
 * @param cb
 */
export const useQuitGuide = (cb: () => void) => {
    useEffect(() => {
        if (!thyEnv.canUseWindow()) {
            return;
        }

        const hashChangeHandle = () => {
            const hash = window.location.hash.slice(1);
            if (hash === QUIT_GUIDE_HASH && !isShow) {
                isShow = true;
                cb();
            }
        };

        const href = window.location.href.replace(window.location.hash, '');
        const url = `${href}#${QUIT_GUIDE_HASH}`;
        window.history.replaceState(null, document.title, url);
        window.history.pushState(null, document.title, href);

        window.addEventListener('hashchange', hashChangeHandle);
        return () => {
            window.removeEventListener('hashchange', hashChangeHandle);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
