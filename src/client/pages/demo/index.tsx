import React, { FC } from 'react';
import * as api from '@/constants/api';
import { thyUI, UITypes, thyReq } from '@thyiad/util/lib/index';
import { Button, Input } from 'zarm';
import './index.scss';

const DemoPage: FC<RoutePageProps> = (props) => {
    const handleBtn = () => {
        thyUI.toast('啦啦啦');
        thyReq
            .post(api.CommonOK)
            .then((res) => {
                console.log(res);
            })
            .finally(() => {
                thyUI.alert('请求结束');
            });
    };

    return (
        <div style={{ padding: 24 }}>
            <Input placeholder="请输入"></Input>
            <Button theme="primary" onClick={handleBtn}>
                test
            </Button>
        </div>
    );
};

export default DemoPage;
