import { AuthQuery } from '@shopify/shopify-api';
import { KApp, UnauthorizedError } from '@kustomer/apps-server-sdk';
import { Order } from '@shopify/shopify-api/dist/rest-resources/2022-04';

import * as klasses from '../klasses';

export function onOrderUpdate(app: KApp) {
  return async (
    org: string,
    _query: AuthQuery,
    headers: any,
    order: Order
  ) => {
    const shop = headers['x-shopify-shop-domain'];

    if (!shop) {
      throw new UnauthorizedError('invalid request');
    }

    if (!order.id || !order.email || !order.customer) return;

    try {
      let customer = await app.in(org).customers.getByEmail(order.email);

      if (!customer && order.phone) {
        customer = await app.in(org).customers.getByPhone(order.phone);
      }

      if (!customer) {
        customer = await app.in(org).customers.create({
          name: `${order.customer.first_name} ${order.customer.last_name}`,
          emails: [{ email: order.email }],
          phones: order.phone ? [{ phone: order.phone }] : []
        });
      }

      let kobject = await app.in(org).kobjects.getByExternalId(order.id.toString(), 'order');

      if (!kobject) {
        kobject = await app.in(org).customers.createKObject(customer.id, 'order', {
          externalId: order.id.toString(),
          title: `Order ${order.name} ${order.line_items?.length || 0} item(s) ordered for ${order.total_price}`,
          description: (order.line_items || []).map(li => li.title).join('\n'),
          custom: klasses.order.map(shop, order)
        });
      }

      // update kobject
    } catch (err) {
      throw err;
    }
  };
}
