import React, { FC } from 'react';
import { Divider } from 'antd';
import { UploadBtn, Bar } from '@/components/antd-ui/index';
import * as api from '@client/constants/api';
import { thyUI, UITypes } from '@thyiad/util/lib/index';

const DemoPage: FC<RoutePageProps> = (props) => {
    const barData = [
        { x: '张三', y: 80 },
        { x: '李四', y: 30 },
        { x: '王五', y: 99 },
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
                scale={{ y: { max: 100 } }}
                width={barData.length * 100 + 80}
                height={300}
                barWidth={50}
                toolTipFun={(x: string, y: string) => ({ name: '得分', value: `${y}%` })}
                data={barData}
                color="#43b6af"
            />
        </div>
    );
};

export default DemoPage;
