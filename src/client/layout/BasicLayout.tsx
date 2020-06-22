import React, { FC, useState } from 'react';
import './BasicLayout.scss';
import allRoutes from '@client/route';
import { useHistory, Switch } from 'react-router-dom';
import RouteWithSubRoutes from '../components/RouteWithSubRoutes';

const BasicLayout: FC<RoutePageProps> = (props) => {
    const { routes } = props;
    const [openMenus, setOpenMenus] = useState<string[]>([]);
    const history = useHistory();

    const toggleOpen = (parentName: string) => {
        const index = openMenus.indexOf(parentName);
        if (index < 0) {
            const targetOpenMenus = [...openMenus, parentName];
            setOpenMenus(targetOpenMenus);
        } else {
            const nextMenus = [...openMenus];
            nextMenus.splice(index, 1);
            console.log(openMenus);
            setOpenMenus(nextMenus);
        }
    };

    const jumpPage = (path: string) => {
        props?.history.push(path);
    };

    return (
        <div className="basic-layout">
            <div className="basic-layout-l-menu">
                {allRoutes
                    ?.filter((item) => !item.hideInMenu)
                    .map((item) => (
                        <React.Fragment key={item.name}>
                            <div
                                className="basic-layout-l-menu-item"
                                onClick={() => {
                                    toggleOpen(item.name);
                                }}
                            >
                                {item.title}
                            </div>
                            {openMenus.includes(item.name) &&
                                item.routes &&
                                item.routes
                                    .filter((item) => !item.hideInMenu)
                                    .map((subItem) => (
                                        <div
                                            key={subItem.name}
                                            className="basic-layout-l-menu-item"
                                            onClick={() => jumpPage(subItem.path)}
                                        >
                                            {subItem.title}
                                        </div>
                                    ))}
                        </React.Fragment>
                    ))}
            </div>
            <div className="basic-layout-r">
                <div className="basic-layout-r-header"></div>
                <div className="basic-layout-r-main">
                    <Switch>
                        {routes?.map((route) => (
                            <RouteWithSubRoutes key={route.name} {...route} />
                        ))}
                    </Switch>
                </div>
            </div>
        </div>
    );
};

export default BasicLayout;
