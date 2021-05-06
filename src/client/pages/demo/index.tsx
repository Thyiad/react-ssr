import React, { useMemo } from 'react';
import './index.scss';
import { dmUrl } from '@dm/utils';
import { Button } from 'zarm';
import { login } from '@client/utils/login';

const PageDemo: React.FC<RoutePageProps> = () => {
    const aaa = dmUrl.parse();
    console.log(aaa);
    const handleLogin = () => {
        login({ isMustLogin: true }, () => {
            console.log('in login callback');
        }).then((res) => {
            console.log(res);
        });
    };
    return (
        <div className="page-demo">
            lalala, demo page, {JSON.stringify(aaa, null, '    ')}
            <Button onClick={handleLogin}>登录</Button>
        </div>
    );
};

export default PageDemo;
