import { Button, Icon } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

import './App.css';

function App() {
  return (
    <div className="App">
      <Button
        style={{ margin: 'auto' }}
        color='primary'
        variant='outlined'
      >
        <AddIcon color='primary' />
        Add Store
      </Button>
    </div>
  );
}

export default App;
