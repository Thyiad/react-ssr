import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { MessageBar, MessageBarType } from '@fluentui/react';
import './index.scss';

let toastContainer: HTMLElement = null;
const durationTimer = 0;
const duration = 2000;

const hideToast = () => {
    toastContainer.className = 'fluent-toast-container hide';
};

const showToast = (title: string, type?: MessageBarType) => {
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        document.body.appendChild(toastContainer);
    }
    if (durationTimer) {
        clearTimeout(durationTimer);
    }

    toastContainer.className = 'fluent-toast-container show';

    const msgBar = (
        <MessageBar messageBarType={type} isMultiline={false} dismissButtonAriaLabel="Close">
            {title}
        </MessageBar>
    );
    ReactDOM.render(msgBar, toastContainer);
    // @ts-ignore
    // durationTimer = setTimeout(() => {
    //     hideToast();
    // }, duration);
};

const Toast = {
    show: showToast,
    hide: hideToast,
};

export default Toast;
