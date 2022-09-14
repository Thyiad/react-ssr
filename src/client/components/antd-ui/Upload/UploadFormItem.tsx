import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Button, Upload, message, Modal } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { UploadFile, UploadChangeParam, RcFile } from 'antd/lib/upload/interface';
import lrz from 'lrz';
import { dataURLtoFile, getBase64, getFileName } from './tool';
import { Response } from './upload';
import './index.css';

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
    /**
     * 是否限制图片尺寸
     */
    imageSize?: {
        width?: number;
        height?: number;
    };

    value?: string | string[];
    onChange?: (fileValue: string | string[]) => void;

    /** muti向上抛数组，否则抛string */
    isMulti: boolean;
    selectMulti?: boolean;
    listType: 'picture' | 'picture-card' | 'text';
    showUploadList?: boolean;
    hideUpload?: boolean;
    maxCount?: number;
    withCredentials?: boolean;

    /** 成功响应时的数据格式 */
    responseFormat?: {
        code: number | string;
        data: string;
    };
}

const UploadFormItem: React.FC<IProps> = (props) => {
    const {
        uploadUrl,
        uploadHeaders,
        uploadParams,
        extList,
        fileSize,
        uploadText,
        btnProps,
        onChange,
        selectSuc,
        uploadErr,
        showLoading,
        hideUpload,
        maxCount,
        value,
        compressOption,
        imageSize,
        isMulti,
        listType,
        showUploadList,
        withCredentials,
        responseFormat,
        selectMulti,
    } = props;

    const [modalState, setModalState] = useState({
        previewImage: '',
        previewVisible: false,
        previewTitle: '',
    });

    const [fileList, setFileList] = useState<UploadFile<Response>[]>([]);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        let targetFileList = [];
        if (value) {
            targetFileList = (Array.isArray(value) ? value : [value]).map((url, index) => ({
                uid: index.toString(),
                name: getFileName(url),
                status: 'done',
                url,
            }));
        } else {
            targetFileList = [];
        }
        setFileList(targetFileList);
    }, [value]);

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

    const handleRemove = useCallback(
        (file) => {
            const index = fileList.findIndex((item) => item.uid === file.uid);
            if (index >= 0) {
                fileList.splice(index, 1);
                setFileList([...fileList]);
                onChange && onChange(fileList.map((item) => item.url).filter((item) => item));
            }
        },
        [fileList, onChange],
    );

    const onUploadChange = useCallback(
        (params: UploadChangeParam<UploadFile<Response>>) => {
            setUploading(params.file.status === 'uploading');
            if (!params.file.status) {
                handleRemove(params.file);
                return;
            }
            if (!isMulti) {
                if (params.file.status !== 'removed') {
                    setFileList([params.file]);
                }
                if (
                    params.file.status === 'done' &&
                    params.file.response &&
                    params.file.response.code === responseFormat!.code
                ) {
                    const resData = params.file.response[responseFormat!.data];
                    if (onChange) {
                        onChange(Array.isArray(resData) ? resData[0] : resData);
                    }
                    params.file.url = Array.isArray(resData) ? resData[0] : resData;
                } else if (params.file.status === 'error') {
                    if (uploadErr) {
                        uploadErr();
                    }
                }
            } else {
                if (params.file.status !== 'removed') {
                    setFileList(params.fileList);
                }
                if (
                    params.file.status === 'done' &&
                    params.file.response &&
                    params.file.response.code === responseFormat!.code
                ) {
                    const resData = params.file.response[responseFormat!.data];
                    const serverUrl = Array.isArray(resData) ? resData[0] : resData;
                    params.file.url = serverUrl;

                    // 上传成功
                    // 其他的都完毕后才onChange：都有status并且status !== 'uploading'
                    const notUploadingList = params.fileList.filter(
                        (file) => file.status && file.status !== 'uploading',
                    );
                    if (notUploadingList.length === params.fileList.length) {
                        const doneList = notUploadingList.filter((file) => file.status === 'done');
                        // @ts-ignore
                        const fileUrls: string[] = doneList.map((item) => item.url).filter((item) => !!item);
                        onChange && onChange(fileUrls);
                    }
                } else if (params.file.status === 'error') {
                    if (uploadErr) {
                        uploadErr();
                    }
                }
            }
        },
        [handleRemove, isMulti, onChange, responseFormat, uploadErr],
    );

    const beforeUpload = useCallback(
        async (file: RcFile) => {
            if (Array.isArray(extList) && extList.length > 0) {
                const extValid = extList.some((ext) => file.name.endsWith(ext));
                if (!extValid) {
                    message.error(`格式不对，只允许上传以下格式：${extList.join(' ')}`);
                    handleRemove(file);
                    return false;
                }
            }

            if (fileSize) {
                if (file.size / 1024 / 1024 > fileSize) {
                    message.error(`文件过大，不能大于${fileSize}M`);
                    handleRemove(file);
                    return false;
                }
            }

            if (imageSize && (imageSize.width || imageSize.height)) {
                await new Promise((resolve, reject) => {
                    const img = new Image();
                    const _URL = window.URL || window.webkitURL;
                    img.src = _URL.createObjectURL(file);
                    img.onload = function () {
                        if (
                            (imageSize.width && imageSize.width !== img.width) ||
                            (imageSize.height && imageSize.height !== img.height)
                        ) {
                            message.error(`图片的尺寸不对，请重新上传`);
                            reject(false);
                        }
                        resolve(true);
                    };
                });
            }

            if (
                compressOption &&
                compressOption.isCompress &&
                file.size > compressOption.minSize &&
                compressOption.extList.some((ext) => file.name.endsWith(ext))
            ) {
                file = await new Promise((resolve, reject) => {
                    lrz(file)
                        .then((rst: any) => {
                            // @ts-ignore
                            const newFile: RcFile = dataURLtoFile(rst.base64, rst.origin.name);
                            newFile.uid = file.uid;
                            resolve(newFile);
                        })
                        .catch(() => {
                            message.error('图片上传发生错误：前端压缩图片失败');
                            handleRemove(file);
                            reject(new Error('图片上传发生错误：前端压缩图片失败'));
                        });
                });
            }

            selectSuc && selectSuc(file);
            return file;
        },
        [extList, fileSize, imageSize, compressOption, selectSuc, handleRemove],
    );

    const handlePreview = useCallback(async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setModalState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    }, []);
    const handleCancel = useCallback(
        () =>
            setModalState({
                previewImage: '',
                previewVisible: false,
                previewTitle: '',
            }),
        [],
    );

    const needHide = useMemo(() => {
        return hideUpload || (maxCount && fileList.length >= maxCount);
    }, [hideUpload, maxCount, fileList]);

    const btnDom = useMemo(() => {
        if (needHide) {
            return <span>{hideUpload && fileList.length <= 0 ? '无' : ''}</span>;
        }
        if (listType === 'picture-card') {
            return (
                <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>{uploadText}</div>
                </div>
            );
        }

        return (
            <Button loading={showLoading && uploading} icon={<UploadOutlined />} {...btnProps}>
                {uploadText}
            </Button>
        );
    }, [btnProps, fileList.length, hideUpload, listType, needHide, showLoading, uploadText, uploading]);

    return useMemo(() => {
        return (
            <>
                <Upload
                    className={['upload-item', needHide && fileList.length > 0 ? 'hide-btn' : ''].join(' ')}
                    disabled={hideUpload}
                    action={uploadUrl}
                    headers={headers}
                    listType={listType}
                    fileList={fileList}
                    // @ts-ignore
                    onChange={onUploadChange}
                    // @ts-ignore
                    beforeUpload={beforeUpload}
                    showUploadList={showUploadList}
                    data={uploadParams}
                    onPreview={handlePreview}
                    onRemove={handleRemove}
                    withCredentials={withCredentials}
                    multiple={selectMulti}
                >
                    {btnDom}
                </Upload>

                <Modal
                    visible={modalState.previewVisible}
                    title={modalState.previewTitle}
                    footer={null}
                    onCancel={handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={modalState.previewImage} />
                </Modal>
            </>
        );
    }, [
        needHide,
        fileList,
        hideUpload,
        uploadUrl,
        headers,
        listType,
        onUploadChange,
        beforeUpload,
        showUploadList,
        uploadParams,
        handlePreview,
        handleRemove,
        withCredentials,
        btnDom,
        modalState.previewVisible,
        modalState.previewTitle,
        modalState.previewImage,
        handleCancel,
        selectMulti,
    ]);
};

UploadFormItem.defaultProps = {
    showUploadList: true,
    extList: [],
    fileSize: 5,
    uploadText: '上传',
    btnProps: {},
    showLoading: false,
    compressOption: {
        isCompress: true,
        minSize: 1024 * 1024 * 0.1,
        extList: ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
    },
    hideUpload: false,
    maxCount: 5,
    responseFormat: {
        code: 2000,
        data: 'data',
    },
};

export default UploadFormItem;
