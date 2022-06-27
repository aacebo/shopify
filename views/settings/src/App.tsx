import { useState } from 'react';
import { Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

import { NewShopDialog } from './components';
import './App.css';

function App() {
  const org = 'aacebo';
  const url = new URL(process.env.PUBLIC_URL);
  const [newShopDialogOpen, setNewShopDialogOpen] = useState(false);

  return (
    <div className="App">
      <Button
        style={{ margin: 'auto' }}
        color='primary'
        variant='outlined'
        onClick={() => setNewShopDialogOpen(true)}
      >
        <AddIcon color='primary' />
        Add Store
      </Button>

      <Button
        style={{ margin: 'auto' }}
        color='secondary'
        variant='outlined'
        onClick={() => {
          window.Kustomer.command.run(
            'shopify_sdk--create-order',
            { body: { hello: 'world' } },
            () => {

            });
        }}
      >
        <AddIcon color='secondary' />
        Add Order
      </Button>

      <NewShopDialog
        open={newShopDialogOpen}
        onClose={(shop) => {
          setNewShopDialogOpen(false);

          if (shop) {
            window.Kustomer.showModal({
              type: 'redirect',
              content: {
                title: 'ADD STORE',
                iconUrl: `${url.protocol}//${url.host}/assets/icon2.png`,
                description: 'You will need to go to Shopify to add a store.\nClick Go to Shopify below.',
                primaryDataKt: 'goToShopify',
                secondaryDataKt: 'cancelAddStore',
                showCancelButton: true,
                actionButton: {
                  text: 'Go to Shopify',
                  linkUrl: `${url.protocol}//${url.host}/auth?shop=${shop}&org=${org}&redirectUri=https://${org}.helpsimply.com/app/channels-and-apps/settings/shopify_sdk`,
                },
                alertTagText: 'To connect a new store, make sure you sign out of all other stores in Shopify.',
                alertTagType: 'warning',
              }
            }, () => {

            });
          }
        }}
      />
    </div>
  );
}

export default App;
