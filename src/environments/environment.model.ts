import { PassedInitialConfig } from 'angular-auth-oidc-client';

export interface Environment {
    serviceBaseUrl: string;
    authConfig: PassedInitialConfig;
}
