import { Order } from "@shopify/shopify-api/dist/rest-resources/2022-04";

export const order = {
  scheme: {
    icon: 'shopify',
    color: '#64943E',
    metadata: {
      properties: {
        orderIdNum: {
            displayName: 'Order Id'
        },
        orderStatusStr: {
            displayName: 'Order Status'
        },
        billingStatusStr: {
            displayName: 'Billing Status'
        },
        orderNumberStr: {
            displayName: 'Order Number'
        },
        orderCreatedAt: {
            displayName: 'Order Created'
        },
        orderUpdatedAt: {
            displayName: 'Order Updated'
        },
        specialInstructionsStr: {
            displayName: 'Special Instructions'
        },
        totalPriceNum: {
            displayName: 'Total Price'
        },
        shippingAddressStr: {
            displayName: 'Shipping Address'
        },
        shippingCityStr: {
            displayName: 'Shipping City'
        },
        shippingStateStr: {
            displayName: 'Shipping State'
        },
        shippingZipStr: {
            displayName: 'Shipping Zip Code'
        },
        shippingCountryStr: {
            displayName: 'Shipping Country'
        },
        shipmentStatusStr: {
            displayName: 'Shipment Status'
        },
        skusTxt: {
          displayName: 'Product SKU\'s'
        },
        paymentSummaryStr: {
            displayName: 'Payment Summary'
        },
        trackingNumberStr: {
            displayName: 'Tracking Number'
        },
        orderTagsStr: {
            displayName: 'Order Tags'
        },
        customerTagsStr: {
            displayName: 'Customer Tags'
        },
        shopNameStr: {
            displayName: 'Shop Name'
        },
        orderStatusUrl: {
            displayName: 'Order Status Link'
        },
        hasBeenCancelledBool: {
            displayName: 'Order Cancelled'
        },
        hasBeenRefundedBool: {
            displayName: 'Order Refunded'
        },
        localeStr: {
            displayName: 'Locale'
        },
        presentmentCurrencyStr: {
            displayName: 'Currency Type'
        }
      }
    }
  },
  map: (shop: string, order: Order) => {
    order.shipping_address = order.shipping_address || { };

    return {
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
      customerTagsStr: order.customer?.tags,
      shopNameStr: shop,
      orderStatusUrl: order.order_status_url,
      hasBeenCancelledBool: !!order.cancelled_at,
      hasBeenRefundedBool: order.refunds?.length > 0,
      localeStr: order.customer_locale,
      presentmentCurrencyStr: order.presentment_currency
    };
  }
};
