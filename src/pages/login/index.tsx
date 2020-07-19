import React, { FC, useState, useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { login } from '@/models/User';
import { getBaseHost, getQuery } from '@/utils/url';
import Cookies from '@/utils/cookie';
import { LOGIN_COOKIE_KEY, LOGIN_ROLE_KEY } from '@/constant/index';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './index.scss';

const Login: FC<RoutePageProps> = (props) => {
    const { target } = getQuery();
    const [isLogining, setIsLogining] = useState(false);
    const history = useHistory();

    const handleLogin = useCallback(
        (values: any) => {
            setIsLogining(true);
            login(values)
                .then((res) => {
                    const resData = res;
                    const baseHost = getBaseHost();
                    Cookies.set(LOGIN_COOKIE_KEY, resData.token, { domain: baseHost, expires: 365 });
                    Cookies.set(LOGIN_ROLE_KEY, resData.role, { domain: baseHost, expires: 365 });

                    const targetUrl = target ? decodeURIComponent(target.toString()) : '/';
                    if (/^http/.test(targetUrl)) {
                        window.location.href = targetUrl;
                    } else {
                        history.push(targetUrl);
                    }
                    setIsLogining(false);
                })
                .catch(() => {
                    setIsLogining(false);
                });
        },
        [history, target],
    );

    return useMemo(() => {
        return (
            <div className="login-main">
                <Form onFinish={handleLogin}>
                    <Form.Item name="account" rules={[{ required: true, message: '请输入账号!' }]}>
                        <Input prefix={<UserOutlined />} placeholder="请输入账号" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: '请输入密码!' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="请输入密码"></Input.Password>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={isLogining}>
                            登 录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }, [handleLogin, isLogining]);
};

export default Login;
