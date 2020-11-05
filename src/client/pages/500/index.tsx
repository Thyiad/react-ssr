import { Button, Result } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';

const NoFoundPage: React.FC<RoutePageProps> = () => {
    const history = useHistory();

    return (
        <Result
            status="500"
            title="500"
            subTitle="Sorry, the page you visited does not exist."
            extra={
                <Button type="primary" onClick={() => history.push('/')}>
                    Back Home
                </Button>
            }
        />
    );
};

export default NoFoundPage;
