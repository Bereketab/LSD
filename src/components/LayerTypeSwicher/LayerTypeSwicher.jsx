import React, { useState, useEffect } from 'react';
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
  const [selectedLayerTypeIndex, setSelectedLayerTypeIndex] = useState(0);

  const classes = useStyles();

  const toggleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const mapLayerTypeOptions = [
    // 'Google Hybrid',
    'Stamen',
    'OSMHumaniterian',
    'OSMStandard'
  ];

  const handleMenuItemClick = (event, index) => {
    setSelectedLayerTypeIndex(index);
    props.onLayerTypeChange(mapLayerTypeOptions[index]);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    props.onLayerTypeChange(mapLayerTypeOptions[selectedLayerTypeIndex]);
  }, []);

  return (
    <>
      <List
        component="nav"
        aria-label="Choose layer type"
        className={classes.list}
      >
        <ListItem
          className={classes.listItem}
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          aria-label="Map layer types"
          onClick={toggleMenu}
        >
          <ListItemText
            className={classes.listItemLabel}
            primary="Choose layer type"
            secondary={
              <Typography variant="body2">
                {mapLayerTypeOptions[selectedLayerTypeIndex]}
              </Typography>
            }
          />
        </ListItem>
      </List>
      {/* <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        className={classes.menu}
      >
        {mapLayerTypeOptions.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedLayerTypeIndex}
            onClick={event => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu> */}
    </>
  );
}
