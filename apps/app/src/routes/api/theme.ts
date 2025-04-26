import { createThemeAction } from 'remix-themes';

import { themeSessionResolver } from '../../.server/cookies';

export const action = createThemeAction(themeSessionResolver);
