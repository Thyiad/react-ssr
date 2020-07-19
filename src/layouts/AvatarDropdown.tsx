import React, { FC, useMemo, useCallback } from 'react';
import { Avatar, Dropdown, Menu } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useRedux } from '@/hooks/useRedux';
import { logout } from '@/utils/url';
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

    const dropdownMenu = useMemo(() => {
        return (
            <Menu onClick={onMenuClick}>
                <Menu.Item key="logout">
                    <LogoutOutlined />
                    退出登录
                </Menu.Item>
            </Menu>
        );
    }, [onMenuClick]);

    return useMemo(() => {
        return (
            <Dropdown overlay={dropdownMenu}>
                <span className="avatar-dropdown">
                    <Avatar size="small" src={state.currentUserinfo?.avatar} alt="" />
                    <span style={{ marginLeft: 8, color: nameColor }}>{state.currentUserinfo?.name}</span>
                </span>
            </Dropdown>
        );
    }, [dropdownMenu, state.currentUserinfo, nameColor]);
};

export default AvatarDropdown;
