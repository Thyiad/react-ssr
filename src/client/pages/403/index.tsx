import { Button, Result } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NoFoundPage: React.FC<RoutePageProps> = () => {
    const navigate = useNavigate();

    return (
        <Result
            status="403"
            title="403"
            subTitle="Sorry, you don't have access to this page."
            extra={
                <Button type="primary" onClick={() => navigate('/')}>
                    Back Home
                </Button>
            }
        />
    );
};

export default NoFoundPage;
