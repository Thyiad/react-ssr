import React, { useCallback, useMemo, useState } from 'react';
import { Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadFile, UploadChangeParam, RcFile } from 'antd/lib/upload/interface';
import lrz from 'lrz';
import { dataURLtoFile } from './tool';
import { Response } from './upload';

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

const UploadBtn: React.FC<IProps> = (props: IProps) => {
    const [fileList, setFileList] = useState<UploadFile<Response>[]>([]);
    const [uploading, setUploading] = useState(false);
    const {
        uploadHeaders,
        uploadParams,
        uploadSuc,
        uploadErr,
        compressOption,
        selectSuc,
        uploadText,
        btnProps,
        showLoading,
        uploadUrl,
        extList,
        fileSize,
    } = props;

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
            setFileList([...params.fileList]);
            setUploading(params.file.status === 'uploading');
            if (params.file.status === 'done' && params.file.response && params.file.response.code === 2000) {
                const resData = params.file.response.data;
                if (uploadSuc) {
                    uploadSuc(Array.isArray(resData) ? resData[0] : resData);
                }
            } else if (params.file.status === 'error') {
                if (uploadErr) {
                    uploadErr();
                }
            }
        },
        [uploadSuc, uploadErr],
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

            selectSuc && selectSuc(file);
            return true;
        },
        [extList, fileSize, compressOption, selectSuc],
    );

    return useMemo(() => {
        return (
            <Upload
                action={uploadUrl}
                headers={headers}
                onChange={onChange}
                fileList={fileList}
                data={uploadParams}
                // @ts-ignore
                beforeUpload={beforeUpload}
                showUploadList={false}
            >
                <Button loading={showLoading && uploading} icon={<UploadOutlined />} {...btnProps}>
                    {uploadText}
                </Button>
            </Upload>
        );
    }, [
        uploadUrl,
        headers,
        onChange,
        fileList,
        beforeUpload,
        uploading,
        showLoading,
        uploadText,
        btnProps,
        uploadParams,
    ]);
};

UploadBtn.defaultProps = {
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
