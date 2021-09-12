import { thyEnv } from '@thyiad/util';
import { addGlobalClassName } from './common';

export const pageLoaded = async () => {
    if (thyEnv.canUseWindow()) {
        addGlobalClassName();
    }
};
