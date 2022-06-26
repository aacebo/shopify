import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

export interface NewShopDialogProps {
  open?: boolean;
  onClose: (shop?: string) => void;
}

export function NewShopDialog(props: NewShopDialogProps) {
  const [shop, setShop] = useState<string>();

  return (
    <Dialog
      open={props.open || false}
      onClose={() => props.onClose()}
      hideBackdrop
    >
      <DialogTitle>Add Store</DialogTitle>

      <DialogContent>
        <TextField
          variant='outlined'
          label='Shop Name'
          value={shop}
          style={{ marginTop: '10px' }}
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
          onClick={() => props.onClose(shop)}
        >
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
}
