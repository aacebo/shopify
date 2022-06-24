import * as express from 'express';
import { Shopify } from '@shopify/shopify-api';
import { BadRequestError } from '@kustomer/apps-server-sdk';

export const SHOP_REDIRECT: { [shop: string]: string } = { };

export function auth() {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (!req.query.shop) {
      return next(new BadRequestError('shop is a required query param'));
    }

    if (!req.query.redirectUri) {
      return next(new BadRequestError('redirectUri is a required query param'));
    }

    const shop = `${req.query.shop}.myshopify.com`;
    SHOP_REDIRECT[shop] = req.query.redirectUri.toString();

    return res.redirect(await Shopify.Auth.beginAuth(
      req,
      res,
      shop,
      '/auth/redirect',
      false
    ));
  };
}
