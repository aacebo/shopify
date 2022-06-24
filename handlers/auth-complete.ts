import * as express from 'express';
import { Shopify } from '@shopify/shopify-api';
import { UnauthorizedError } from '@kustomer/apps-server-sdk';

import { SHOP_REDIRECT } from './auth';

export function authComplete() {
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

      const redirectUri = SHOP_REDIRECT[session.shop];
      delete SHOP_REDIRECT[session.shop];

      if (!redirectUri) {
        return next(new UnauthorizedError('shop session not found'));
      }

      return res.redirect(`${redirectUri}/app/channels-and-apps/settings/shopify`);
    } catch (err) {
      return next(err);
    }
  };
}
