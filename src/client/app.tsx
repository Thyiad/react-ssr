import React, { FC } from 'react';
import { render, hydrate } from 'react-dom';
import { AppBrowser } from '@/components/AppContainer';
import { loadableReady } from '@loadable/component';

if (process.env.SYS_TYPE === 'ssr') {
    loadableReady(() => {
        hydrate(<AppBrowser />, document.getElementById('root'));
    });
} else {
    render(<AppBrowser />, document.getElementById('root'));
}
