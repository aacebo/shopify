import { AuthQuery } from '@shopify/shopify-api';
import { KApp, UnauthorizedError } from '@kustomer/apps-server-sdk';
import { Order } from '@shopify/shopify-api/dist/rest-resources/2022-04';

export function onOrderCreate(app: KApp) {
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

    if (!order.email || !order.customer) return;

    try {
      let customer = await app.in(org).customers.getByEmail(order.email);

      if (!customer) {
        customer = await app.in(org).customers.create({
          name: `${order.customer.first_name} ${order.customer.last_name}`,
          emails: [{ email: order.email }],
          phones: order.phone ? [{ phone: order.phone }] : []
        });
      }

      order.shipping_address = order.shipping_address || { };
      await app.in(org).customers.createKObject(customer.id, 'order', {
        title: `Order ${order.name} ${order.line_items?.length || 0} item(s) ordered for ${order.total_price}`,
        description: (order.line_items || []).map(li => li.title).join('\n'),
        custom: {
          orderIdNum: order.id,
          orderStatusStr: order.fulfillment_status || 'Unfulfilled',
          billingStatusStr: order.financial_status,
          orderNumberStr: order.name,
          orderCreatedAt: order.created_at,
          orderUpdatedAt: order.updated_at,
          specialInstructionsStr: order.note ? order.note.replace(/\((?<=^.{1022}[^\ud800-\udbff]).{2,}|(?<=^.{1022})[\ud800-\udbff].{2,/s, '...') : undefined,
          totalPriceNum: order.total_price ? +order.total_price : 0,
          shippingAddressStr: Object.values(order.shipping_address).join(' '),
          shippingCityStr: order.shipping_address.city,
          shippingStateStr: order.shipping_address.province,
          shippingZipStr: order.shipping_address.zip,
          shippingCountryStr: order.shipping_address.country_code,
          shipmentStatusStr: order.fulfillments?.length ? order.fulfillments[0].shipment_status : undefined,
          skusTxt: (order.line_items || []).map(li => li.sku).join(' '),
          trackingNumberStr: order.fulfillments?.length ? order.fulfillments[0].tracking_number : undefined,
          orderTagsStr: order.tags,
          customerTagsStr: order.customer.tags,
          shopNameStr: shop,
          orderStatusUrl: order.order_status_url,
          hasBeenCancelledBool: !!order.cancelled_at,
          hasBeenRefundedBool: order.refunds?.length > 0,
          localeStr: order.customer_locale,
          presentmentCurrencyStr: order.presentment_currency
        }
      });
    } catch (err) {
      throw err;
    }
  };
}
