import React from 'react';
import { ActivityIndicator } from 'zarm';

const PageLoading: React.FC = () => (
    <div style={{ paddingTop: 100, textAlign: 'center' }}>
        <ActivityIndicator size="lg" />
    </div>
);

export default PageLoading;
