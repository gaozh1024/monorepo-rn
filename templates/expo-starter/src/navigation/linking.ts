import type { LinkingOptions } from '@react-navigation/native';
import { appConfig } from '../bootstrap/app-config';
import { ROUTES } from './routes';
import type { RootStackParamList } from './types';

const schemePrefix = `${appConfig.appScheme}://`;
const expoPrefix = `exp+${appConfig.appScheme}://`;
const webPrefix = typeof window === 'undefined' ? undefined : window.location.origin;

export const appLinking: LinkingOptions<RootStackParamList> = {
  prefixes: [schemePrefix, expoPrefix, ...(webPrefix ? [webPrefix] : [])],
  config: {
    screens: {
      [ROUTES.LAUNCH]: 'launch',
      [ROUTES.LOGIN]: 'login',
      [ROUTES.REGISTER]: 'register',
      [ROUTES.FORGOT_PASSWORD]: 'forgot-password',
      [ROUTES.MAIN_TABS]: {
        screens: {
          [ROUTES.HOME]: 'home',
          [ROUTES.MY]: 'my',
        },
      },
      [ROUTES.GLOBAL_DRAWER]: 'drawer',
      [ROUTES.WEB_SMOKE]: 'web-smoke',
      [ROUTES.MY_MAIN]: 'profile',
      [ROUTES.USER_INFO]: 'me',
      [ROUTES.SETTINGS]: 'settings',
      [ROUTES.THEME]: 'settings/theme',
      [ROUTES.LANGUAGE]: 'settings/language',
      [ROUTES.ABOUT]: 'about',
    },
  },
};
