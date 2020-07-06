import React from 'react';
import { Link } from 'react-router-dom';

const home: React.FC<RoutePageProps> = () => {
    return (
        <div>
            <p>this is home page</p>
            <p>
                <Link to="/about">click me goto about(use Link)</Link>
            </p>
        </div>
    );
};

export default home;
