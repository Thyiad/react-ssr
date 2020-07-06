import React from 'react';

const notFound: React.FC<RoutePageProps> = (props) => {
    return (
        <div>
            <p>404 not found page</p>
            <p>{`pathname is: ${props?.location.pathname}, search is: ${props?.location.search}`}</p>
        </div>
    );
};

export default notFound;
