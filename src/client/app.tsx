import React, { FC } from 'react';
import { render, hydrate } from 'react-dom';
import { AppContainer } from '@/components/AppContainer';
import { loadableReady } from '@loadable/component';

if (process.env.SYS_TYPE === 'ssr') {
    loadableReady(() => {
        hydrate(<AppContainer />, document.getElementById('root'));
    });
} else {
    render(<AppContainer />, document.getElementById('root'));
}
