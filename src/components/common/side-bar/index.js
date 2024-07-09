import React, { useState } from 'react';
import {
  Paper, AppBar, Toolbar,
  Typography, makeStyles, ListItemText,
  List, ListItem, ListItemIcon, Collapse,
  ListItemSecondaryAction, Switch, IconButton,
  Tooltip, Menu, MenuItem, Link
} from '@material-ui/core';
import { LayersRounded, ExpandLess, ExpandMore, Info, MoreVert } from '@material-ui/icons';
import Proptypes from 'prop-types';

const useStyle = makeStyles((theme) => ({
  title: {
    textAlign: 'center',
    fontSize: '1.1em',
    border: '1px solid #e3e3e3',
    paddingBottom: '1em',
    paddingTop: '1em',
  },
  header: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: '#00953b'
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-end"
  },
  fullHeight: {
    height: '100%'
  }
}));

function Sidebar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [checked, setChecked] = React.useState(true);

  const { onSelectLayer, selectedLayers, spatialLayers,handleChange } = props;
  const [isClimaticFactorCollapsed, setIsClimaticFactorCollapsed] = useState(false);
  const [isTopographicSectionCollapsed, setIsTopographicSectionCollapsed] = useState(false);
  const [isSoilCharactersticsSectionCollapsed, setIsSoilCharactersticsSectionCollapsed] = useState(false);

  
  const handleMenuVertClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuVertClose = (downloadLink) => {
    setAnchorEl(null);
    const win = window.open(downloadLink, '_blank');
    if (win != null) {
      win.focus();
    }

  };

  const classes = useStyle();

  const menuOptions = ['Download'];

  const getDownloadButton = (downloadLink) => (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleMenuVertClick}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleMenuVertClose}
      >
        {menuOptions.map((option) => (
          <MenuItem key={option} onClick={() => handleMenuVertClose(downloadLink)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );

  return (
    <Paper elevation={2} className={classes.fullHeight}>
      <Typography variant="h6" className={classes.title}>
        Explore Geospatial  Layers
          </Typography>
    
        
          <List component="div" disablePadding>
            {
              spatialLayers.map(item => (
                <ListItem button className={classes.nested}
                  selected={selectedLayers.indexOf(item.name) !== -1}
                  
                  key={item.name}>
                  <ListItemIcon>
                    <Switch size="small"
                      
                      name={item.name}
                      onChange={(e)=>handleChange(e,item)}
                      // onChange={(e) => onSelectLayer(e,item.name, item.url, item.params)}
                    />
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                  <ListItemSecondaryAction >
                    <div className={classes.row}>
                      <Tooltip title={item.description} placement="top">
                        <IconButton size="small">
                          <Info fontSize="small" color="disabled" />
                        </IconButton>
                      </Tooltip>
                      {getDownloadButton(item.downloadLink)}
                    </div>
                  </ListItemSecondaryAction>
                </ListItem>))
            }
          </List>
        
       
     
    </Paper>
  );
}

Sidebar.propTypes = {
  handleChange: Proptypes.func
};

export default Sidebar;

