import React, { FC } from 'react';
import { render, hydrate } from 'react-dom';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { AppBrowser } from '@/components/AppContainer';
import { loadableReady } from '@loadable/component';

const container = document.getElementById('root');
if (process.env.SYS_TYPE === 'ssr') {
    loadableReady(() => {
        hydrateRoot(container!, <AppBrowser />);
    });
} else {
    const root = createRoot(container!);
    root.render(<AppBrowser />);
}

// 启用 Hot Module Replacement
if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept();
}
