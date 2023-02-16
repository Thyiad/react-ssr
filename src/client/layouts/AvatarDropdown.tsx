import React, { FC, useMemo, useCallback } from 'react';
import { Avatar, Dropdown, Menu } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useRedux } from '@/hooks/useRedux';
import { logout } from '@/utils/index';
import './AvatarDropdown.scss';

interface AvatarDropdownProps {
    nameColor?: string;
}

const AvatarDropdown: FC<AvatarDropdownProps> = (props) => {
    const { state } = useRedux();
    const { nameColor } = props;

    const onMenuClick = useCallback((event: any) => {
        const { key } = event;

        if (key === 'logout') {
            logout();
        }
    }, []);

    return useMemo(() => {
        return (
            <Dropdown
                menu={{
                    items: [
                        {
                            key: 'logout',
                            icon: <LogoutOutlined />,
                            label: '退出登录',
                        },
                    ],
                    onClick: onMenuClick,
                }}
            >
                <span className="avatar-dropdown">
                    <Avatar size="small" src={state.currentUser?.avatar} alt="" />
                    <span style={{ marginLeft: 8, color: nameColor }}>{state.currentUser?.name}</span>
                </span>
            </Dropdown>
        );
    }, [state.currentUser, nameColor, onMenuClick]);
};

export default AvatarDropdown;
