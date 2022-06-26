import { KApp } from '@kustomer/apps-server-sdk';

export function onCreateOrder(app: KApp) {
  return async (
    _orgId: string,
    _userId: string,
    data: any
  ) => {
    app.log.info(data);
  };
}
