import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  listItemLabel: {
    // backgroundColor: "#ffffff",
    color: '#ffffff'
  },
  menu: {
    'z-index': 9999
  },
  listItem: {
    marginTop: 0,
    padding: 0
  },
  list: {
    marginTop: 0,
    padding: 0
  }
}));

export default function LayerTypeSwicher(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const { selectedDetection, setSelectedDetection, detections } = props;

  const classes = useStyles();

  const toggleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedDetection(index);
    props.onLayerTypeChange(detections[index]);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <List
        component="nav"
        aria-label="Forest Monitoring"
        className={classes.list}
      >
        <ListItem
          className={classes.listItem}
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          aria-label="Forest Monitoring"
          onClick={toggleMenu}
        >
          <ListItemText
            className={classes.listItemLabel}
            primary="Choose detections"
            secondary={
              <Typography variant="body2">
                {detections[selectedDetection]}
              </Typography>
            }
          />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        className={classes.menu}
      >
        {detections.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedDetection}
            onClick={event => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
