import React, { FC } from 'react';
import { render, hydrate } from 'react-dom';
import { AppContainer } from '@/components/AppContainer';
import { loadableReady } from '@loadable/component';

// // spa使用render
// render(<AppContainer />, document.getElementById('root'));

// ssr使用hydrate
loadableReady(() => {
    hydrate(<AppContainer />, document.getElementById('root'));
});
