import React, { FC, useState } from 'react';
import { Form, Divider, Button } from 'antd';
import { UploadBtn, UploadFormItem, IconFont } from '@/components/antd-ui/index';
import { iconFontKeys } from '@/components/antd-ui/IconFont/index';
import * as api from '@client/constants/api';
import { thyUI, UITypes } from '@thyiad/util/lib/index';
import ChartDemo from './chart';

const DemoPage: FC<RoutePageProps> = (props) => {
    const barData = [
        { x: '张三', y: 80 },
        { x: '李四', y: 30 },
        { x: '王五', y: 99 },
        { x: '张三1', y: 30 },
        { x: '李四2', y: 60 },
        { x: '王五3', y: 30 },
    ];

    const [uploadValue, setUploadValue] = useState<string[]>([]);

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
            <UploadFormItem
                uploadUrl={api.UPLOAD_OSS}
                uploadParams={{ saveDir: 'oss/upload', keepName: false }}
                isMulti={false}
                listType="picture-card"
                fileSize={6}
                extList={['.png', 'jpg']}
                uploadText="上传文件"
                // onChange={(e) => {
                //     console.log(e);
                // }}
                value="https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2771978851,2906984932&fm=26&gp=0.jpg"
            />
            <Form
                onFinish={(values) => {
                    console.log(values);
                }}
            >
                <Form.Item name="upload" label="upload file">
                    <UploadFormItem
                        uploadUrl={api.UPLOAD_OSS}
                        uploadParams={{ saveDir: 'oss/upload', keepName: false }}
                        isMulti={true}
                        selectMulti
                        listType="text"
                        showUploadList={true}
                        fileSize={6}
                        extList={['.png', 'jpg']}
                        uploadText="上传文件"
                    />
                </Form.Item>
                <Button htmlType="submit">提交</Button>
            </Form>
            <Divider />
            <ChartDemo />
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
