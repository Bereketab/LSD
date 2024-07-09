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

export default function LayerTypeSwicher({ toolboxs, onChange }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLayerTypeIndex, setSelectedLayerTypeIndex] = useState(1);
  const toolNotSelected = 'None';

  const classes = useStyles();

  const toggleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedLayerTypeIndex(index);
    onChange(toolboxs[index]);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <List component="nav" aria-label="Tool" className={classes.list}>
        <ListItem
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          aria-label="Tool box type"
          onClick={toggleMenu}
          className={classes.listItem}
        >
          <ListItemText
            className={classes.listItemLabel}
            primary="ToolBoxes"
            secondary={
              <Typography variant="body2">
                {toolboxs[selectedLayerTypeIndex] || toolNotSelected}
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
        {toolboxs.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedLayerTypeIndex}
            onClick={event => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
