import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';

export interface NewShopDialogProps {
  open?: boolean;
  onClose?: () => void;
}

export function NewShopDialog(props: NewShopDialogProps) {
  const url = new URL(process.env.PUBLIC_URL);
  const [shop, setShop] = useState<string>();

  return (
    <Dialog open={props.open || false} onClose={props.onClose}>
      <DialogTitle>Add Store</DialogTitle>

      <DialogContent>
        <img
          src={`${url.protocol}//${url.host}/assets/icon.png`}
          height='100px'
          width='100px'
          draggable={false}
          style={{
            display: 'block',
            margin: 'auto'
          }}
        />

        <DialogContentText style={{ marginBottom: '10px' }}>
          You will need to go to Shopify to add a store. Click "Login" below.
        </DialogContentText>

        <TextField
          variant='outlined'
          label='Shop Name'
          value={shop}
          onChange={(e) => setShop(e.target.value)}
          fullWidth
          autoFocus
        />
      </DialogContent>

      <DialogActions>
        <Button
          variant='contained'
          color='primary'
          disabled={!shop}
          href={`${url.protocol}//${url.host}/auth?shop=${shop}&org=aacebo&redirectUri=https://aacebo.helpsimply.com/app/channels-and-apps/settings/shopify_sdk`}
        >
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
}
