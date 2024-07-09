import React from 'react';
import { ButtonGroup, makeStyles, Button } from '@material-ui/core';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';

const useStyle = makeStyles(() => ({
  buttonGroup: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    color: 'white'
  },
  button: {
    backgroundColor: '#fff'
  },
  icon: {
    color: 'grey'
  }
}));

export default function MapControls(props) {
  const classes = useStyle();
  const { onZoomIn, onZoomOut } = props;
  return (
    <div style={{ position: 'absolute', top: 10, left: 15, zIndex: 12 }}>
      <ButtonGroup
        className={classes.buttonGroup}
        aria-label="contained primary button group"
        orientation="vertical"
      >
        <Button
          aria-label="zoom in"
          className={classes.button}
          onClick={onZoomIn}
        >
          <ZoomInIcon fontSize="medium" className={classes.icon} />
        </Button>
        <Button
          aria-label="zoom out"
          className={classes.button}
          onClick={onZoomOut}
        >
          <ZoomOutIcon fontSize="medium" className={classes.icon} />
        </Button>
      </ButtonGroup>
    </div>
  );
}
