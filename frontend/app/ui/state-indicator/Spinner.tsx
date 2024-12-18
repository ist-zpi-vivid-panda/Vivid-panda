import React from 'react';

import CircularProgress from '@mui/material/CircularProgress';

// TODO: Change colors to match the rest of the app

const Spinner = () => (
  <React.Fragment>
    <svg width={0} height={0}>
      <defs>
        <linearGradient id="spinner_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e01cd5" />

          <stop offset="100%" stopColor="#1CB5E0" />
        </linearGradient>
      </defs>
    </svg>

    <CircularProgress sx={{ 'svg circle': { stroke: 'url(#spinner_gradient)' } }} />
  </React.Fragment>
);

export default Spinner;
