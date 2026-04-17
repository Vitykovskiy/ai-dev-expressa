import type {
  BackofficeAccessContextResponse,
  BackofficeAccessDenyReason,
  BackofficeTab,
} from '@expressa/shared-types';

export interface BackofficeAppEnvironment {
  appTitle: string;
  apiBaseUrl: string;
  disableTelegramAuth: boolean;
  testTelegramId: string | null;
}

export interface BackofficeNavigationItem {
  tab: BackofficeTab;
  path: string;
  label: string;
  summary: string;
  accent: string;
}

export type BackofficeAccessStatus = 'idle' | 'restoring' | 'bootstrapping' | 'ready' | 'error';

export type BackofficeAccessErrorReason =
  | BackofficeAccessDenyReason
  | 'route-access-denied'
  | 'network-error'
  | 'unexpected-response';

export interface BackofficeAccessError {
  statusCode: number;
  reason: BackofficeAccessErrorReason;
  message: string;
}

export interface BackofficeAccessState {
  status: BackofficeAccessStatus;
  accessToken: string | null;
  context: BackofficeAccessContextResponse | null;
  error: BackofficeAccessError | null;
}
