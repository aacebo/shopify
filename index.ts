import 'dotenv/config';
import { KApp } from '@kustomer/apps-server-sdk';
import Shopify, { ApiVersion } from '@shopify/shopify-api';

import pkg from './package.json';
import changelog from './changelog.json';
import * as klasses from './klasses';
import * as handlers from './handlers';

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
  throw new Error('clientId and clientSecret are required');
}

if (!process.env.SHOPIFY_API_KEY || !process.env.SHOPIFY_API_SECRET) {
  throw new Error('shopify apiKey and apiSecret are required');
}

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  API_VERSION: ApiVersion.April22,
  HOST_NAME: process.env.NODE_ENV === 'local' ? 'localhost' : 'shopify-mgh2.onrender.com',
  HOST_SCHEME: process.env.NODE_ENV === 'local' ? 'http' : 'https',
  IS_EMBEDDED_APP: false,
  SCOPES: [
    'read_orders',
    'write_orders'
  ]
});

const url = 'https://shopify-mgh2.onrender.com';
const app = new KApp({
  app: pkg.name,
  version: pkg.version,
  title: 'Shopify (SDK)',
  visibility: 'public',
  dependencies: ['kustomer-^1.8.5'],
  default: false,
  system: false,
  url,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  roles: [
    'org.user.customer.read',
    'org.user.customer.write',
    'org.user.kobject.write',
    'org.permission.customer.read',
    'org.permission.customer.create',
    'org.permission.customer.update',
    'org.permission.kobject.create',
    'org.permission.kobject.kobject_*.create'
  ],
  iconUrl: `${url}/assets/icon2.png`,
  env: 'qa',
  appDetails: {
    appDeveloper: {
      name: 'Kustomer',
      website: 'https://kustomer.com',
      supportEmail: 'support@kustomer.com',
    },
    externalPlatform: {
      name: 'Shopify',
      website: 'https://shopify.com',
    },
  },
  description: `Bring all customer purchases from Shopify into the agent timeline in Kustomer.\n

  Use the Shopify app to empower agents with Shopify actions and to meet client requests completely from within Kustomer. The Shopify integration gives you a complete picture of your customer without needing to switch between applications. \n

  **Shopify** is a commerce platform that allows anyone to set up an online store and sell their products. \n
  By connecting Shopify to Kustomer, you can: \n
  - Create searches based on many pieces of order information to prioritize your conversations.
  - View Order details, such as fulfillment status and total charges, without leaving Kustomer.
  - Refund or cancel items in an order directly within the Shopify custom view or timeline layout.
  - View an itemized breakdown of all of the items in the order.
  - Navigate directly to orders in Shopify using deep links.
  Learn more about the integration in the [Kustomer Help Center](https://help.kustomer.com/en_us/shopify-integration-rkei5NSL).
  `,
  screenshots: [
    `${url}/assets/screenshot-1.png`,
    `${url}/assets/screenshot-2.png`,
    `${url}/assets/screenshot-3.png`,
    `${url}/assets/screenshot-4.png`,
    `${url}/assets/screenshot-5.png`,
    `${url}/assets/screenshot-6.png`,
  ],
  releaseNotesUrl: 'https://help.kustomer.com/en_us/shopify-release-notes-SJ1QLlQhI',
  changelog
});

app.useKlass('order', klasses.order);
app.useCustomSettings(
  'Shopify',
  'The Shopify app integration allows you to connect all of your Shopify stores to your Kustomer org so that you can see all of your customer\'s purchases from the [Shopify Insight Card](https://help.kustomer.com/en_us/shopify-insight-card-B1qNbYNYI) and timeline. Learn how to connect your stores [here](https://support.kustomer.com/en_us/shopify-integration-rkei5NSL#Connecting).',
  '/views/settings'
);

app.useCustomView('customer-card', '/views/smartbar/customer', {
  context: 'smartbar-card',
  resource: 'customer',
  displayName: 'Shopify',
  icon: 'shopify',
  state: 'open'
});

app.useCustomView('conversation-card', '/views/smartbar/conversation', {
  context: 'smartbar-card',
  resource: 'conversation',
  displayName: 'Shopify',
  icon: 'shopify',
  state: 'open'
});

app.useCustomView('order-card', '/views/smartbar/order', {
  context: 'smartbar-card',
  resource: 'kobject',
  klass: 'order',
  displayName: 'Shopify',
  icon: 'shopify',
  state: 'open'
});

app.useCustomView('timeline', '/views/timeline', {
  context: 'expanded-timeline',
  resource: 'kobject',
  klass: 'order',
  displayName: 'Shopify',
  icon: 'shopify',
  state: 'open'
});

app.onHook('order-create', handlers.onOrderCreate(app));
app.onHook('order-update', handlers.onOrderUpdate(app));
app.onAuth(handlers.auth());
app.onAuthComplete(handlers.authComplete(app));

(async () => {
  try {
    await app.start(
      +(process.env.PORT || 80),
      process.env.NODE_ENV === 'local'
    );

    app.log.info(await app.in('aacebo').getToken());
  } catch (err) {
    app.log.error(JSON.stringify(err, undefined, 2));
  }
})();
