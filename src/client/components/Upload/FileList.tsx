import React, { useState } from 'react';
import { Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import * as api from '@/constants/api';
import { LOGIN_COOKIE_KEY } from '@/constants';
import { UploadFile, UploadChangeParam, RcFile } from 'antd/lib/upload/interface';
import { thyUI, thyCookie, UITypes, thyStr } from '@thyiad/util';
const { toast } = thyUI;
import { Response } from './upload.d';

interface IProps {
    uploadUrl?: string;
    uploadParams: {
        saveDir: string;
        keepName: boolean;
    };
    extList?: string[];
    fileSize?: number;
    uploadText?: string;
    btnProps?: { [key: string]: any };
    fileListChange?: (fileUrlList: string[]) => void;
    uploadErr?: () => void;
    showLoading?: boolean;

    hideUpload?: boolean;
    maxCount?: number;
    initFileUrlList?: string[];
}

const FileList: React.FC<IProps> = (props: IProps) => {
    const {
        uploadUrl,
        uploadParams,
        extList,
        fileSize,
        uploadText,
        btnProps,
        fileListChange,
        uploadErr,
        showLoading,
        hideUpload,
        maxCount,
        initFileUrlList,
    } = props;
    let initFileList: UploadFile<Response>[] = [];
    if (Array.isArray(initFileUrlList)) {
        // @ts-ignore
        initFileList = initFileUrlList.map((url, index) => ({
            uid: index.toString(),
            name: thyStr.getFileName(url),
            status: 'done',
            url,
        }));
    }
    const [fileList, setFileList] = useState<UploadFile<Response>[]>(initFileList);
    const [uploading, setUploading] = useState(false);
    const needHide = hideUpload || (maxCount && fileList.length >= maxCount);
    const headers = {
        accessKey: thyCookie.get(LOGIN_COOKIE_KEY) || '',
    };

    const onChange = (params: UploadChangeParam<UploadFile<Response>>) => {
        setUploading(params.file.status === 'uploading');
        const newFileList = params.fileList
            .map((file) => {
                if (file.response && file.response.code === 2000) {
                    const isUploadOSS = uploadUrl === api.UPLOAD_OSS;
                    const resData = file.response.data;
                    const serverUrl = isUploadOSS ? resData[0] : resData;
                    file.url = serverUrl;
                }
                return file;
            })
            .filter((file) => !!file.status);
        // @ts-ignore
        const fileUrls: string[] = newFileList.map((item) => item.url).filter((item) => !!item);
        // @ts-ignore
        fileListChange(fileUrls);
        if (params.file.status === 'error') {
            if (uploadErr) {
                uploadErr();
            }
        }
        setFileList(newFileList);
    };

    const beforeUpload = (file: RcFile) => {
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

        // todo：支持前端压缩图片，压缩之后再上传

        return true;
    };

    return (
        <Upload
            action={uploadUrl}
            headers={headers}
            onChange={onChange}
            fileList={fileList}
            beforeUpload={beforeUpload}
            showUploadList
            data={uploadParams}
        >
            {needHide ? (
                <span>{hideUpload && fileList.length <= 0 ? '无' : ''}</span>
            ) : (
                <Button loading={showLoading && uploading} icon={<UploadOutlined />} {...btnProps}>
                    {uploadText}
                </Button>
            )}
        </Upload>
    );
};

FileList.defaultProps = {
    uploadUrl: api.UPLOAD_OSS,
    extList: [],
    fileSize: 5,
    uploadText: '上传',
    btnProps: {},
    showLoading: false,
    hideUpload: false,
    maxCount: 5,
    initFileUrlList: [],
};

export default FileList;
