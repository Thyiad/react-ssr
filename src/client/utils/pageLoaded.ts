import { dmTools } from '@dm/utils';

import { addGlobalClassName } from './common';

export const pageLoaded = async () => {
    if (dmTools.isClient()) {
        addGlobalClassName();
    }
};
