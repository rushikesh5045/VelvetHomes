// SortComponent.jsx
import React, { useState } from 'react';
import { Select, MenuItem, Button, Box } from '@mui/material';

const SortComponent = ({ onSortChange }) => {
  const [sortBy, setSortBy] = useState('price'); // Default sorting by price
  const [sortOrder, setSortOrder] = useState('asc'); // Default sorting order is ascending

  const applySort = () => {
    onSortChange({ sortBy, sortOrder });
  };

  return (
    <Box mt={2} mb={2} display="flex" alignItems="center" >
      <Select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        variant="outlined"
        style={{ marginRight: '8px', fontSize: '0.9rem' }}
      >
        <MenuItem value="price">Price</MenuItem>
        {/* Add more options based on your data */}
      </Select>
      <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} variant="outlined" style={{ fontSize: '0.9rem' }}>
        <MenuItem value="asc">Low to high</MenuItem>
        <MenuItem value="desc">High to low</MenuItem>
      </Select>
      <div style={{ marginLeft: '8px', flex: '1' }}>
      <Button
        variant="contained"
        onClick={applySort}
        style={{ backgroundColor: 'black', color: 'whitesmoke', marginLeft: '8px', fontSize: '10px' }}
      >
        Apply Sort
      </Button>
      </div>
    </Box>
  );
};

export default SortComponent;
