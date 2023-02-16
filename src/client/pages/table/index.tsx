import React, { FC, useRef, useMemo, useCallback, useState } from 'react';
import { Avatar, Button, Select, FormInstance, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { thyUI, thyReq } from '@thyiad/util';
import { TableItem, TableListParams } from './table';
import * as api from '@client/constants/api';
import './index.scss';
import { EditDialogProps, TableActionType, TableDialogTitleDic } from '@client/constants/enum';
import type { ActionType, ProColumns, RequestData } from '@ant-design/pro-components';
import { ProTable, DrawerForm, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';

const TablePage: FC<RoutePageProps> = (props) => {
    const actionRef = useRef<ActionType>();
    const formRef = useRef<FormInstance>();
    const [dialogTableForm] = Form.useForm();
    const [dialogTable, setDialogTable] = useState<EditDialogProps<TableItem>>({
        visible: false,
        type: TableActionType.none,
        data: {},
    });

    /**
     * 查询
     */
    const queryList = useCallback(async (params?: TableListParams): Promise<RequestData<TableItem>> => {
        params = params || {};

        // 此处为示例，正式代码应当写到models中
        const res: ServerListData = await thyReq.post(api.CommonList, {
            ...params,
            pageNo: params.current,
        });
        return {
            data: res.rows,
            success: true,
            total: res.total,
        };
    }, []);

    const handleTableAction = useCallback(
        (actionType: TableActionType, record?: TableItem) => {
            switch (actionType) {
                case TableActionType.none:
                    setDialogTable({
                        visible: false,
                        type: TableActionType.none,
                        data: {},
                    });
                    break;
                case TableActionType.create:
                    setDialogTable({
                        visible: true,
                        type: TableActionType.create,
                        data: {},
                    });
                    dialogTableForm.resetFields();
                    break;
                case TableActionType.update:
                    setDialogTable({
                        visible: true,
                        type: TableActionType.update,
                        data: { ...record },
                    });
                    dialogTableForm.resetFields();
                    dialogTableForm.setFieldsValue({ ...record });
                    break;
                case TableActionType.remove:
                    thyUI.confirm(`确定要删除 ${record.name} 吗？`, () => {
                        thyReq.post(api.CommonOK, { _id: record._id }).then(() => {
                            thyUI.toast('删除成功');
                            actionRef.current.reload();
                        });
                    });
                    break;
                default:
                    break;
            }
        },
        [dialogTableForm],
    );

    const handleDialogTableFinish = useCallback(
        async (formValue: Partial<TableItem>): Promise<boolean> => {
            const targetApi = dialogTable.type === TableActionType.create ? api.CommonOK : api.CommonOK;
            const targetData =
                dialogTable.type === TableActionType.create ? formValue : { ...dialogTable.data, ...formValue };

            await thyReq.post(targetApi, targetData);
            thyUI.toast(`${TableDialogTitleDic[dialogTable.type]}成功`);
            setDialogTable({
                visible: false,
                type: TableActionType.none,
                data: {},
            });
            actionRef.current.reload();
            return false;
        },
        [dialogTable],
    );

    const columns: ProColumns<TableItem>[] = useMemo(() => {
        return [
            // 头像
            {
                title: '头像',
                dataIndex: 'avatar',
                render(_text, record, _index, _action) {
                    return <Avatar src={record.avatar} />;
                },
                hideInSearch: true,
            },
            // 姓名
            {
                title: '姓名',
                dataIndex: 'name',
            },
            // 年龄
            {
                title: '年龄',
                dataIndex: 'age',
            },
            // 生日
            {
                title: '生日',
                dataIndex: 'birthday',
            },
            // 生日
            {
                title: '自定义',
                dataIndex: 'customize',
                fieldProps: {
                    onChange: (a, b) => {
                        // a：value
                        // b: option
                        console.log(a, b);
                    },
                },
                // 参数分别是：列配置、table配置、form引用
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                renderFormItem: (colItem, config, form) => (
                    <Select placeholder="请选择">
                        {[1, 2, 3].map((item) => (
                            <Select.Option key={item} value={item}>
                                {item}
                            </Select.Option>
                        ))}
                    </Select>
                ),
            },
            // 描述
            {
                title: '描述',
                dataIndex: 'description',
            },
            // 操作
            {
                title: '操作',
                dataIndex: 'option',
                valueType: 'option',
                render: (_, record) => {
                    return (
                        <div className="cell-action">
                            <a
                                onClick={() => {
                                    thyUI.toast('点击了修改');
                                }}
                            >
                                修改
                            </a>
                            <a
                                onClick={() => {
                                    thyUI.toast('点击了删除');
                                }}
                                style={{ color: '#f5222d' }}
                            >
                                删除
                            </a>
                        </div>
                    );
                },
            },
        ];
    }, []);

    return useMemo(() => {
        return (
            <>
                <ProTable<TableItem>
                    actionRef={actionRef}
                    formRef={formRef}
                    columns={columns}
                    request={(params) => queryList(params)}
                    toolBarRender={() => [
                        <Button
                            key="add"
                            type="primary"
                            onClick={() => {
                                handleTableAction(TableActionType.create);
                            }}
                        >
                            新增
                        </Button>,
                    ]}
                    rowKey="_id"
                    options={false}
                    tableAlertRender={false}
                    tableAlertOptionRender={false}
                    pagination={{ defaultPageSize: 10 }}
                />
                <DrawerForm<Partial<TableItem>>
                    open={dialogTable.visible}
                    title={`${TableDialogTitleDic[dialogTable.type]}商户`}
                    drawerProps={{
                        onClose: () => {
                            handleTableAction(TableActionType.none);
                        },
                    }}
                    form={dialogTableForm}
                    onFinish={handleDialogTableFinish}
                >
                    <ProFormText
                        name="name"
                        label="名称"
                        placeholder="请输入名称"
                        rules={[{ required: true, message: '请输入名称' }]}
                    />
                    <ProFormSelect
                        name="select"
                        label="下拉"
                        options={[]}
                        placeholder="请选择下拉"
                        rules={[{ required: true, message: '请选择下拉' }]}
                    />
                    <ProFormTextArea name="desc" label="描述" placeholder="请输入描述" />
                </DrawerForm>
            </>
        );
    }, [columns, dialogTable, dialogTableForm, handleDialogTableFinish, handleTableAction, queryList]);
};

export default TablePage;
