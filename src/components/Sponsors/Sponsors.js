import React from 'react';
import { Paper, Typography } from '@material-ui/core';

export default function Sponsors() {
  return (
    <div className="sponsors">
      <Paper className="sponsors-image-container" elevation={2} style={{ margin: 0 }}>
        <div className="sponsor-container">
          <img className="sponsor" src="/ciat.png" alt="ciat" />
          <img className="sponsor" src="/icog.png" alt="icog-labs" />
          <img className="sponsor" src="/moa.png" alt="icog-labs" />
          <img className="sponsor" src="/cgiar.png" alt="icog-labs" />
          <img className="sponsor" src="/africa.png" alt="icog-labs" />
        </div>
        <br />
      </Paper>
    </div>
  );
}
