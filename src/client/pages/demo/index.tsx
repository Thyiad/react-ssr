import React, { useMemo } from 'react';
import './index.scss';
import { dmUrl } from '@dm/utils';

const PageDemo: React.FC<RoutePageProps> = () => {
    const aaa = dmUrl.parse();
    console.log(aaa);
    return <div className="page-demo">lalala, demo page, {JSON.stringify(aaa, null, '    ')}</div>;
};

export default PageDemo;
