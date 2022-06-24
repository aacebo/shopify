import * as express from 'express';
import { Shopify } from '@shopify/shopify-api';
import { KApp } from '@kustomer/apps-server-sdk';

export function authComplete(app: KApp) {
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

      app.log.info(session);
    } catch (err) {
      return next(err);
    }

    return res.redirect(`${app.baseUrls.web}/app/channels-and-apps/settings/shopify`);
  };
}
