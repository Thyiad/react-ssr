import React, { useState, useMemo, useCallback } from 'react';
import { Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadFile, UploadChangeParam, RcFile } from 'antd/lib/upload/interface';
import lrz from 'lrz';
import { dataURLtoFile, getFileName } from './tool';
import { Response } from './upload.d';

interface IProps {
    uploadUrl: string;
    uploadHeaders?: {
        accessKey?: string;
        'upload-save-dir'?: string;
        'upload-keep-name'?: 'true' | 'false';
        [key: string]: string | undefined;
    };
    uploadParams?: {
        [key: string]: any;
    };
    extList?: string[];
    fileSize?: number;
    uploadText?: string;
    btnProps?: { [key: string]: any };
    fileListChange?: (fileUrlList: string[]) => void;
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

    hideUpload?: boolean;
    maxCount?: number;
    initFileUrlList?: string[];
}

const FileList: React.FC<IProps> = (props) => {
    const {
        uploadUrl,
        uploadHeaders,
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
        compressOption,
    } = props;

    // @ts-ignore
    const initFileList: UploadFile<Response>[] = useMemo(() => {
        if (Array.isArray(initFileUrlList)) {
            return initFileUrlList.map((url, index) => ({
                uid: index.toString(),
                name: getFileName(url),
                status: 'done',
                url,
            }));
        }
        return [];
    }, [initFileUrlList]);

    const [fileList, setFileList] = useState<UploadFile<Response>[]>(initFileList);
    const [uploading, setUploading] = useState(false);

    const needHide = useMemo(() => {
        return hideUpload || (maxCount && fileList.length >= maxCount);
    }, [hideUpload, maxCount, fileList]);

    // @ts-ignore
    const headers: { [key: string]: string } = useMemo(() => {
        const targetHeaders = {
            ...uploadHeaders,
        };
        Object.keys(targetHeaders).forEach((key) => {
            targetHeaders[key] = targetHeaders[key] || '';
        });
        return targetHeaders;
    }, [uploadHeaders]);

    const onChange = useCallback(
        (params: UploadChangeParam<UploadFile<Response>>) => {
            setUploading(params.file.status === 'uploading');
            const newFileList = params.fileList
                .map((file) => {
                    if (file.response && file.response.code === 2000) {
                        const resData = file.response.data;
                        const serverUrl = Array.isArray(resData) ? resData[0] : resData;
                        file.url = serverUrl;
                    }
                    return file;
                })
                .filter((file) => !!file.status);
            // @ts-ignore
            const fileUrls: string[] = newFileList.map((item) => item.url).filter((item) => !!item);
            fileListChange && fileListChange(fileUrls);
            if (params.file.status === 'error') {
                if (uploadErr) {
                    uploadErr();
                }
            }
            setFileList(newFileList);
        },
        [fileListChange, uploadErr],
    );

    const beforeUpload = useCallback(
        (file: RcFile) => {
            if (Array.isArray(extList) && extList.length > 0) {
                const extValid = extList.some((ext) => file.name.endsWith(ext));
                if (!extValid) {
                    message.error(`格式不对，只允许上传以下格式：${extList.join(' ')}`);
                    return false;
                }
            }

            if (fileSize) {
                if (file.size / 1024 / 1024 > fileSize) {
                    message.error(`文件过大，不能大于${fileSize}M`);
                    return false;
                }
            }

            if (
                compressOption &&
                compressOption.isCompress &&
                file.size > compressOption.minSize &&
                compressOption.extList.some((ext) => file.name.endsWith(ext))
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
                            message.error('图片上传发生错误：前端压缩图片失败');
                            reject(new Error('图片上传发生错误：前端压缩图片失败'));
                        });
                });
            }

            return true;
        },
        [extList, fileSize, compressOption],
    );

    return useMemo(() => {
        return (
            <Upload
                action={uploadUrl}
                headers={headers}
                onChange={onChange}
                fileList={fileList}
                // @ts-ignore
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
    }, [
        uploadUrl,
        headers,
        onChange,
        fileList,
        beforeUpload,
        uploadParams,
        needHide,
        hideUpload,
        showLoading,
        uploading,
        btnProps,
        uploadText,
    ]);
};

FileList.defaultProps = {
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
    hideUpload: false,
    maxCount: 5,
    initFileUrlList: [],
};

export default FileList;
