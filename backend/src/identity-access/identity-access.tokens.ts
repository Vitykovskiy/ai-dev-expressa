import { AccessConfig } from "./config/access-config";

export const ACCESS_CONFIG = Symbol("ACCESS_CONFIG");

export function provideAccessConfig(config: AccessConfig) {
  return {
    provide: ACCESS_CONFIG,
    useValue: config
  };
}
