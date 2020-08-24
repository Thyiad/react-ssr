import React from 'react';
import './CommonFooter.scss';
import systemInfo from '@client/constants/systemInfo';

const { copyright } = systemInfo;

const CommonFooter: React.FC = () => (
    <div className="common-footer">
        2012 - {new Date().getFullYear()} ©{' '}
        <a href={copyright.website} target="_blank" rel="noopener noreferrer">
            {copyright.ownerName}
        </a>
        . All rights reserved. &nbsp; <br />
        {copyright.beian && (
            <a href="http://www.beian.miit.gov.cn" target="_blank" rel="noopener noreferrer">
                {copyright.beian}
            </a>
        )}
    </div>
);

export default CommonFooter;
