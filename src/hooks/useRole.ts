import { useEffect, useRef } from 'react';
import { History } from 'history';
import { getMatchRoute } from '@/utils/url';

const checkRole = (history: History, curRole?: string, pathname?: string): void => {
    const findedRoute = getMatchRoute(pathname || window.location.pathname);
    if (!findedRoute || !findedRoute.roles || !curRole) {
        return;
    }
    if (!findedRoute.roles.includes(curRole)) {
        history.replace('/403');
    }
};

interface UseRoleRes {
    isFirstRender: React.MutableRefObject<boolean>;
    checkRole: typeof checkRole;
}

export const useRole = (history: History, curRole?: string): UseRoleRes => {
    const isFirstRender = useRef(true);

    useEffect(() => {
        const unRegister = history.listen((e) => {
            checkRole(history, curRole, e.pathname);
        });
        return unRegister;
    }, [history, curRole]);

    return { isFirstRender, checkRole };
};
