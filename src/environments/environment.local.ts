import { Environment } from './environment.model';

export const environment: Environment = {
    serviceBaseUrl: 'http://localhost:8080',
    authConfig: {
        config: [
            {
                configId: 'app',
                authority: 'http://localhost:8180/realms/r2p',
                redirectUrl: window.location.origin,
                clientId: 'r2p-spa',
                scope: 'openid profile email',
                responseType: 'code',
                customParamsAuthRequest: {
                    response_mode: 'query',
                },
                silentRenew: false,
                useRefreshToken: false,
                autoUserInfo: false,
                maxIdTokenIatOffsetAllowedInSeconds: 600,
                secureRoutes: ['http://localhost:8080'],
            },
        ],
    },
};

