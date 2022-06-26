import { useState } from 'react';
import { Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

import { NewShopDialog } from './components';
import './App.css';

function App() {
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

      <NewShopDialog
        open={newShopDialogOpen}
        onClose={() => setNewShopDialogOpen(false)}
      />
    </div>
  );
}

export default App;
