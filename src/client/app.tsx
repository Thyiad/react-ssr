import React, { FC } from 'react';
import { render, hydrate } from 'react-dom';
import { AppBrowser } from '@/components/AppContainer';
import { loadableReady } from '@loadable/component';
import { pageLoaded } from '@client/utils/pageLoaded';
import smoothscroll from 'smoothscroll-polyfill';
import { thyEnv } from '@thyiad/util';
import { initThyiadUtil } from './utils';

if (thyEnv.canUseWindow()) {
    smoothscroll.polyfill();
}

pageLoaded();

initThyiadUtil();

if (process.env.SYS_TYPE === 'ssr') {
    loadableReady(() => {
        hydrate(<AppBrowser />, document.getElementById('root'));
    });
} else {
    render(<AppBrowser />, document.getElementById('root'));
}
