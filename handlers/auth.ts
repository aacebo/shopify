import * as express from 'express';
import { Shopify } from '@shopify/shopify-api';
import { BadRequestError } from '@kustomer/apps-server-sdk';

export function auth() {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (!req.query.shop) {
      return next(new BadRequestError('shop is a required query param'));
    }

    return res.redirect(await Shopify.Auth.beginAuth(
      req,
      res,
      `${req.query.shop}.myshopify.com`,
      '/auth/redirect',
      false
    ));
  };
}
