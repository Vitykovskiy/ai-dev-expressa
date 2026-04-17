import type { BackofficeTab } from '@expressa/shared-types';

export interface BackofficeAppEnvironment {
  appTitle: string;
  apiBaseUrl: string;
}

export interface BackofficeNavigationItem {
  tab: BackofficeTab;
  path: string;
  label: string;
  summary: string;
  accent: string;
}
