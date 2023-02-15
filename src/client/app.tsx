import React, { FC } from 'react';
import { render, hydrate } from 'react-dom';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { AppBrowser } from '@/components/AppContainer';
import { loadableReady } from '@loadable/component';

if (process.env.SYS_TYPE === 'ssr') {
    loadableReady(() => {
        // hydrate(<AppBrowser />, document.getElementById('root'));
        hydrateRoot(document.getElementById('root'), <AppBrowser />);
    });
} else {
    // render(<AppBrowser />, document.getElementById('root'));
    const container = document.getElementById('root');
    const root = createRoot(container);
    root.render(<AppBrowser />);
}
