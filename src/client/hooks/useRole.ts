import { useEffect, useRef } from 'react';
import { getMatchRoute } from '@/utils/index';
import { NavigateFunction, Location } from 'react-router-dom';

const checkRole = (navigate: NavigateFunction, pathname: string, curRole?: string): void => {
    const findedRoute = getMatchRoute(pathname);
    if (!findedRoute || !findedRoute.roles || !curRole) {
        return;
    }
    if (!findedRoute.roles.includes(curRole)) {
        navigate('/403', { replace: true });
    }
};

interface UseRoleRes {
    isFirstRender: React.MutableRefObject<boolean>;
    checkRole: typeof checkRole;
}

export const useRole = (navigate: NavigateFunction, location: Location, curRole?: string): UseRoleRes => {
    const isFirstRender = useRef(true);

    useEffect(() => {
        checkRole(navigate, location.pathname, curRole);
    }, [navigate, location, curRole]);

    return { isFirstRender, checkRole };
};
