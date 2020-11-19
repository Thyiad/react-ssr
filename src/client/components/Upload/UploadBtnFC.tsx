import React, { useState, PropsWithChildren } from 'react';
import { Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as api from '@client/constants/api';
import { LOGIN_COOKIE_KEY } from '@client/constants';
import { UploadFile, UploadChangeParam, RcFile } from 'antd/lib/upload/interface';
import { thyUI, UITypes, thyCookie } from '@thyiad/util';
import { Response } from './upload.d';
import lrz from 'lrz';
import { dataURLtoFile } from './tool';

const { toast } = thyUI;

interface IProps {
    uploadUrl?: string;
    uploadParams: {
        saveDir: string;
        keepName: boolean;
        [key: string]: any;
    };
    extList?: string[];
    fileSize?: number;
    uploadText?: string;
    btnProps?: { [key: string]: any };
    selectSuc?: (file: RcFile) => void;
    uploadSuc?: (resData: any) => void;
    uploadErr?: () => void;
    showLoading?: boolean;
    /** 是否前端压缩
     * 默认启用压缩
     * 默认大于100kb才压缩
     * 默认以下格式：['.jpg', '.jpeg', '.png', '.gif', '.bmp']
     * */
    compressOption?: {
        isCompress: boolean;
        minSize: number;
        extList: string[];
    };
}

const UploadBtn: React.FC<IProps> = (props: PropsWithChildren<IProps>) => {
    const [fileList, setFileList] = useState<UploadFile<Response>[]>([]);
    const [uploading, setUploading] = useState(false);

    const headers = {
        accessKey: thyCookie.get(LOGIN_COOKIE_KEY) || '',
    };

    const onChange = (params: UploadChangeParam<UploadFile<Response>>) => {
        const { uploadSuc, uploadErr, uploadUrl } = props;

        setFileList([...params.fileList]);
        setUploading(params.file.status === 'uploading');
        if (params.file.status === 'done' && params.file.response && params.file.response.code === 2000) {
            const isUploadOSS = uploadUrl === api.UPLOAD_OSS;
            const resData = params.file.response.data;
            if (uploadSuc) {
                uploadSuc(isUploadOSS ? resData[0] : resData);
            }
        } else if (params.file.status === 'error') {
            if (uploadErr) {
                uploadErr();
            }
        }
    };

    const beforeUpload = (file: RcFile): boolean | Promise<File> => {
        const { extList, fileSize } = props;
        if (Array.isArray(extList) && extList.length > 0) {
            const extValid = extList.some((ext) => file.name.endsWith(ext));
            if (!extValid) {
                toast(`格式不对，只允许上传以下格式：${extList.join(' ')}`, UITypes.error);
                return false;
            }
        }

        if (fileSize) {
            if (file.size / 1024 / 1024 > fileSize) {
                toast(`文件过大，不能大于${fileSize}M`, UITypes.error);
                return false;
            }
        }

        if (
            props.compressOption &&
            props.compressOption.isCompress &&
            file.size > props.compressOption.minSize &&
            props.compressOption.extList.some((ext) => file.name.endsWith(ext))
        ) {
            return new Promise((resolve, reject) => {
                lrz(file)
                    .then((rst: any) => {
                        const newFile = dataURLtoFile(rst.base64, rst.origin.name);
                        // @ts-ignore
                        newFile.uid = file.uid;
                        resolve(newFile);
                    })
                    .catch(() => {
                        toast('图片上传发生错误：前端压缩图片失败');
                        reject(new Error('图片上传发生错误：前端压缩图片失败'));
                    });
            });
        }

        props.selectSuc && props.selectSuc(file);
        return true;
    };

    const { uploadText, btnProps, showLoading, uploadUrl, uploadParams } = props;

    return (
        <Upload
            action={uploadUrl}
            headers={headers}
            onChange={onChange}
            fileList={fileList}
            // @ts-ignore
            beforeUpload={beforeUpload}
            showUploadList={false}
            data={uploadParams}
        >
            <Button loading={showLoading && uploading} icon={<UploadOutlined />} {...btnProps}>
                {uploadText}
            </Button>
        </Upload>
    );
};

UploadBtn.defaultProps = {
    uploadUrl: api.UPLOAD_OSS,
    extList: [],
    fileSize: 5,
    uploadText: '上传',
    btnProps: {},
    showLoading: false,
    compressOption: {
        isCompress: true,
        minSize: 102400,
        extList: ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
    },
};

export default UploadBtn;
