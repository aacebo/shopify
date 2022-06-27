import * as express from 'express';
import Shopify from '@shopify/shopify-api';
import { Webhook } from '@shopify/shopify-api/dist/rest-resources/2022-04';
import { KApp, UnauthorizedError } from '@kustomer/apps-server-sdk';

import { SHOP_AUTH } from './on-auth';

export function onAuthComplete(app: KApp) {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const session = await Shopify.Auth.validateAuthCallback(
        req,
        res,
        req.query as any
      );

      const shopAuth = SHOP_AUTH[session.shop];
      delete SHOP_AUTH[session.shop];

      if (!shopAuth) {
        return next(new UnauthorizedError('shop session not found'));
      }

      const existing = await Webhook.all({ session });
      const baseUrl = `${app.options.url}/orgs/${shopAuth.org}/hooks`;

      if (!existing.some(h => h.address === `${baseUrl}/order-update`)) {
        const webhook = new Webhook({ session });
        webhook.topic = 'orders/updated';
        webhook.address = `${baseUrl}/order-update`;
        webhook.format = 'json';
        await webhook.save();
      }

      return res.redirect(shopAuth.redirectUri);
    } catch (err) {
      app.log.error(err);
      return next(err);
    }
  };
}
