export type NacosModuleOptions = {
  server: string;
  namespace?: string;
  username?: string;
  password?: string;
  naming: {
    group?: string;
    serviceName: string;
    ip?: string;
    healthy?: boolean;
    enabled?: boolean;
  };
  config: {
    group?: string;
    dataId: string;
  };
};
