import React from 'react';
import { useHistory } from 'react-router-dom';

const NoPermissionPage: React.FC<RoutePageProps> = () => {
    const history = useHistory();

    return <div>403 not permission</div>;
};

export default NoPermissionPage;
