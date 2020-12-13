import React, { FC } from 'react';
import { Divider } from 'antd';
import { UploadBtn, Bar, Line, Radar, IconFont } from '@/components/antd-ui/index';
import { iconFontKeys } from '@/components/antd-ui/IconFont/index';
import * as api from '@client/constants/api';
import { thyUI, UITypes } from '@thyiad/util/lib/index';

const DemoPage: FC<RoutePageProps> = (props) => {
    const barData = [
        { x: '张三', y: 80 },
        { x: '李四', y: 30 },
        { x: '王五', y: 99 },
        { x: '张三1', y: 30 },
        { x: '李四2', y: 60 },
        { x: '王五3', y: 30 },
    ];

    return (
        <div style={{ padding: 24 }}>
            <h3>上传文件</h3>
            <UploadBtn
                uploadUrl={api.UPLOAD_OSS}
                uploadParams={{ saveDir: 'oss/upload', keepName: false }}
                uploadSuc={(res) => {
                    if (res.ok) {
                        thyUI.toast('导入成功');
                    } else {
                        thyUI.alert('导入失败', UITypes.error, <React.Fragment>{res}</React.Fragment>);
                    }
                }}
                fileSize={2}
                extList={['.xlsx']}
                uploadText="上传文件"
            ></UploadBtn>
            <Divider />
            <Bar
                scale={{ y: { min: 0, max: 100 } }}
                width={barData.length * 100 + 80}
                height={300}
                barWidth={50}
                data={barData}
                toolTipItemTpl="通过率: {value}%"
            />
            <Line
                width={barData.length * 100 + 80}
                height={300}
                scale={{ y: { min: 0, max: 100 } }}
                data={barData}
                toolTipItemTpl="通过率: {value}%"
            />
            <Radar
                width={300}
                height={300}
                scale={{ y: { min: 0, max: 100 } }}
                data={barData}
                toolTipItemTpl="通过率: {value}%"
            />
            <Divider />
            <div>
                {iconFontKeys.map((item) => (
                    <IconFont key={item} type={item} style={{ color: '#1890ff' }} />
                ))}
            </div>
        </div>
    );
};

export default DemoPage;
