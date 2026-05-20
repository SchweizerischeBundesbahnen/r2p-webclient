import { Environment } from './environment.model';

export const environment: Environment = {
    serviceBaseUrl: 'http://localhost:8080',
    authConfig: {
        config: [
            {
                configId: 'app',
                authority:
                    'https://login.microsoftonline.com/2cda5d11-f0ac-46b3-967d-af1b2e1bd01a/v2.0',
                redirectUrl: window.location.origin,
                clientId: 'f5b54c65-e0b1-4233-bc60-bf4c59f399bd',
                scope: `openid profile email offline_access  api://f5b54c65-e0b1-4233-bc60-bf4c59f399bd/r2p`,
                silentRenew: true,
                useRefreshToken: true,
                autoUserInfo: false,
                maxIdTokenIatOffsetAllowedInSeconds: 600,
                secureRoutes: ['http://localhost:8080'],
            },
        ],
    },
};
