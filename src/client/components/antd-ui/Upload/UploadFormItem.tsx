import React, { useState, useMemo, useCallback } from 'react';
import { Button, Upload, message, Modal } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { UploadFile, UploadChangeParam, RcFile } from 'antd/lib/upload/interface';
import lrz from 'lrz';
import { dataURLtoFile, getBase64, getFileName } from './tool';
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

    value?: string | string[];
    onChange?: (fileValue: string | string[]) => void;

    /** muti向上抛数组，否则抛string */
    isMulti: boolean;
    listType: 'picture' | 'picture-card' | 'text';
    showUploadList?: boolean;
    hideUpload?: boolean;
    maxCount?: number;
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
        hideUpload: isDisable,
        maxCount,
        value,
        compressOption,
        isMulti,
        listType,
        showUploadList,
    } = props;

    const [modalState, setModalState] = useState({
        previewImage: '',
        previewVisible: false,
        previewTitle: '',
    });

    // @ts-ignore
    const initFileList: UploadFile<Response>[] = useMemo(() => {
        if (value) {
            return (Array.isArray(value) ? value : [value]).map((url, index) => ({
                uid: index.toString(),
                name: getFileName(url),
                status: 'done',
                url,
            }));
        }
        return [];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [fileList, setFileList] = useState<UploadFile<Response>[]>(initFileList);
    const [uploading, setUploading] = useState(false);

    const needHide = useMemo(() => {
        return isDisable || (maxCount && fileList.length >= maxCount);
    }, [isDisable, maxCount, fileList]);

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
                fileList.splice(0, 1);
                setFileList([...fileList]);
            }
        },
        [fileList],
    );

    const onUploadChange = useCallback(
        (params: UploadChangeParam<UploadFile<Response>>) => {
            setUploading(params.file.status === 'uploading');
            if (!params.file.status) {
                handleRemove(params.file);
                return;
            }
            if (!isMulti) {
                if (params.file.status === 'done' && params.file.response && params.file.response.code === 2000) {
                    const resData = params.file.response.data;
                    if (onChange) {
                        onChange(Array.isArray(resData) ? resData[0] : resData);
                    }
                    params.file.url = Array.isArray(resData) ? resData[0] : resData;
                } else if (params.file.status === 'error') {
                    if (uploadErr) {
                        uploadErr();
                    }
                }
                setFileList([params.file]);
            } else {
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
                setFileList(newFileList);

                onChange && onChange(isMulti ? fileUrls : fileUrls[0]);
                if (params.file.status === 'error') {
                    if (uploadErr) {
                        uploadErr();
                    }
                }
            }
        },
        [handleRemove, isMulti, onChange, uploadErr],
    );

    const beforeUpload = useCallback(
        (file: RcFile) => {
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
                            handleRemove(file);
                            reject(new Error('图片上传发生错误：前端压缩图片失败'));
                        });
                });
            }

            selectSuc && selectSuc(file);
            return true;
        },
        [extList, fileSize, compressOption, selectSuc, handleRemove],
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

    const btnDom = useMemo(() => {
        if (needHide) {
            return <span>{isDisable && fileList.length <= 0 ? '无' : ''}</span>;
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
    }, [btnProps, fileList.length, isDisable, listType, needHide, showLoading, uploadText, uploading]);

    return useMemo(() => {
        return (
            <>
                <Upload
                    className="upload-item"
                    action={uploadUrl}
                    headers={headers}
                    listType={listType}
                    onChange={onUploadChange}
                    fileList={fileList}
                    // @ts-ignore
                    beforeUpload={beforeUpload}
                    showUploadList={showUploadList}
                    data={uploadParams}
                    onPreview={handlePreview}
                    onRemove={handleRemove}
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
        uploadUrl,
        headers,
        listType,
        onUploadChange,
        fileList,
        beforeUpload,
        showUploadList,
        uploadParams,
        handlePreview,
        handleRemove,
        modalState.previewVisible,
        modalState.previewTitle,
        modalState.previewImage,
        handleCancel,
        btnDom,
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
        minSize: 102400,
        extList: ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
    },
    hideUpload: false,
    maxCount: 5,
};

export default UploadFormItem;
