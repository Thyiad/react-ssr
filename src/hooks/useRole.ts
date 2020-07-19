import { useEffect } from 'react';
import { History } from 'history';
import { getMatchRoute } from '@/utils/url';

export const useRole = (history: History, curRole?: string): void => {
    useEffect(() => {
        const unRegister = history.listen((e) => {
            const findedRoute = getMatchRoute(e.pathname);
            if (!findedRoute || !findedRoute.roles || !curRole) {
                return;
            }
            if (!findedRoute.roles.includes(curRole)) {
                history.replace('/403');
            }
        });
        return unRegister;
    }, [history, curRole]);
};
