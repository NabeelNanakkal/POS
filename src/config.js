export const DASHBOARD_PATH = '/sample-page';
export const DEFAULT_THEME_MODE = 'system';

export const CSS_VAR_PREFIX = '';

const config = {
  orgName: "Company Pvt Ltd",
  orgWebsite: "www.company.com",
  basename: '/',
  defaultPath: '/main/home',
  fontFamily: `'Roboto', sans-serif`,
  borderRadius: 4,
  env: import.meta.env.VITE_APP_ENV,
  ip: import.meta.env.VITE_APP_API_ENDPOINT || 'http://localhost:5000/api',
  health: `${import.meta.env.VITE_APP_API_ENDPOINT || 'http://localhost:5000/api'}/health`
};

export default config;
