import React, { ReactNode } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { message, notification, Modal } from 'antd';
import { UITypes } from '@thyiad/util';
import { Route } from 'react-router-dom';
import { RouteElement } from '@client/components/RouterV6';

/**
 * 顶部加载中提示，不阻塞操作
 * @param msg 提示内容
 */
export const msgLoading = (msg: string) => message.loading(msg);

/**
 * toast消息
 * @param msg 需要toast的消息内容
 * @param type 类型：success, warning, error, info, loading，默认success
 */
export const toast = (msg: string, type: UITypes = UITypes.success) => {
    // @ts-ignore
    message[type](msg);
};

/**
 * 右上角通知消息
 * @param msg 通知标题
 * @param subMsg 通知描述
 * @param type 类型：success, warning, error, info，默认 success
 */
export const notify = (msg: string, subMsg = '', type: UITypes = UITypes.success) => {
    // @ts-ignore
    notification[type]({
        message: msg,
        description: subMsg,
    });
};

/**
 * alert 消息框
 * @param msg alert 的 消息内容
 * @param type 类型：info, success, warning, error，默认 info
 * @param content 弹窗内容
 * @param cb 确认回调
 */
export const alert = (
    msg: string,
    type: UITypes = UITypes.success,
    content: string | ReactNode = '',
    cb?: () => void,
) => {
    // @ts-ignore
    Modal[type]({
        title: msg,
        content,
        okText: '确定',
        // @ts-ignore
        onOK() {
            if (cb) {
                cb();
            }
        },
    });
};

/**
 * 确认弹窗
 * @param msg 提示消息
 * @param ok 确认回调
 * @param cancel 取消回调
 */
export const confirm = (msg: string, ok?: () => void, cancel?: () => void, content?: string) => {
    Modal.confirm({
        title: msg,
        icon: <QuestionCircleOutlined />,
        content,
        onOk() {
            if (ok) {
                ok();
            }
        },
        onCancel() {
            if (cancel) {
                cancel();
            }
        },
    });
};

export const renderRoute = (route: RouteProps) => {
    return (
        <Route path={route.path} key={route.name} element={<RouteElement route={route} />}>
            {route.routes?.map((childRoute) => renderRoute(childRoute))}
        </Route>
    );
};
