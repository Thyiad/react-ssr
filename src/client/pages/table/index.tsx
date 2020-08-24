import React, { FC, useRef, useMemo, useCallback } from 'react';
import ProTable, { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';
import { Avatar, Button } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { thyUI, thyReq } from '@thyiad/util';
import { TableItem, TableListParams } from './table';
import * as api from '@client/constants/api';
import './index.scss';

const TablePage: FC<RoutePageProps> = (props) => {
    const actionRef = useRef<ActionType>();

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
                render(_, record) {
                    return (
                        <>
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
                        </>
                    );
                },
            },
        ];
    }, []);

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

    return useMemo(() => {
        return (
            <>
                <ProTable<TableItem>
                    headerTitle=""
                    actionRef={actionRef}
                    rowKey="key"
                    toolBarRender={(action, { selectedRows }) => [
                        <Button
                            key="add"
                            icon={<PlusOutlined />}
                            type="primary"
                            onClick={() => {
                                thyUI.toast('点击了新增');
                            }}
                        >
                            新增
                        </Button>,
                    ]}
                    // table 工具菜单
                    options={{ fullScreen: false, reload: false, setting: false, density: false }}
                    // table顶部描述内容
                    tableAlertRender={false}
                    request={(params) => queryList(params)}
                    columns={columns}
                    pagination={{ defaultPageSize: 10 }}
                />
            </>
        );
    }, [columns, queryList]);
};

export default TablePage;
