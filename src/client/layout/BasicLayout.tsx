import React, { FC } from 'react';
import './BasicLayout.scss';

const BasicLayout: FC = () => {
    return (
        <div className="basic-layout">
            <div className="basic-layout-l-menu"></div>
            <div className="basic-layout-r">
                <div className="basic-layout-r-header"></div>
                <div className="basic-layout-r-main"></div>
            </div>
        </div>
    );
};

export default BasicLayout;
