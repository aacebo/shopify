import { AuthQuery } from '@shopify/shopify-api';
import { KApp } from '@kustomer/apps-server-sdk';
import { Order } from '@shopify/shopify-api/dist/rest-resources/2022-04';

export function onOrderUpdate(app: KApp) {
  return async (
    _org: string,
    _query: AuthQuery,
    _headers: any,
    order: Order
  ) => {
//     app.log.info(query);
//     app.log.info(headers);

//     if (!Shopify.Utils.validateHmac(query)) {
//       throw new UnauthorizedError('failed to validate hmac');
//     }

    app.log.info(order);
  };
}
