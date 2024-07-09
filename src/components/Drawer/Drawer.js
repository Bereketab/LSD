import React from 'react';
import {
  Paper,
  Toolbar,
  IconButton,
  Button,
  List,
  makeStyles,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography
} from '@material-ui/core';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import MenuIcon from '@material-ui/icons/Menu';
import LayersIcon from '@material-ui/icons/Layers';
import BuildIcon from '@material-ui/icons/Build';

import LayerTypeSwitcher from '../LayerTypeSwicher/LayerTypeSwicher';
import ToolBoxSwitcher from '../ToolBoxSwitcher/ToolBoxSwitcher';
import DownloadRecommendation from '../DownloadRecommendation/DownloadRecommendation';
import images from '../../configs/images';

const useStyles = makeStyles(theme => ({
  drawer: {
    height: '100vh',
    marginTop: 0,
    transition: 'all .5s cubic-bezier(0.820, 0.085, 0.395, 0.895)',
    background: '#171e26',
    position: 'absolute',
    top: 0,
    left: -300,
    width: 0,
    'z-index': 1100,
    ' -webkit-box-shadow': '8px 0px 21px -18px rgba(148,148,148,1)',
    '-moz-box-shadow': '8px 0px 21px -18px rgba(148,148,148,1)',
    'box-shadow': '8px 0px 21px -18px rgba(148,148,148,1)'
  },
  drawerToolBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  openedDrawer: {
    width: 300,
    left: 0
  },
  closedDrawer: {
    width: 0,
    left: -300
  },
  topFloatingButton: {
    position: 'absolute',
    top: 10,
    left: 50,
    'z-index': 9999,
    transition: 'left .5s cubic-bezier(0.820, 0.085, 0.395, 0.895)',
    backgroundColor: '#171e26'
  },
  visibleMenu: {
    left: 50
  },
  hiddenMenu: {
    left: -500
  },
  lightIcon: {
    color: '#a5a5a5'
  },
  menuButton: {
    background: '#31373efa',
    'margin-left': theme.spacing(2)
  },
  drawerMenu: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: '#fff',
    padding: theme.spacing(2)
  },
  clickable: {
    cursor: 'pointer'
  },
  listItem: {
    borderBottomWidth: 1,
    'border-bottom': '1px solid #2b3138'
  }
}));

const Drawer = props => {
  const {
    onMapTypeChange,
    isDrawerOpen,
    onToggleDrawer,
    onToolBoxChange,
    toolboxs,
    setSelectedToolbox,
    selectedToolbox
  } = props;

  const classes = useStyles();

  const getDrawerVisiblityStyle = isOpen =>
    isOpen ? classes.openedDrawer : classes.closedDrawer;

  const getMenuStyle = isOpen =>
    isOpen ? classes.hiddenMenu : classes.visibleMenu;

  return (
    <>
      <Paper
        elevation={2}
        className={`${classes.drawer}  ${getDrawerVisiblityStyle(
          isDrawerOpen
        )}`}
      >
        {isDrawerOpen && (
          <>
            <Toolbar className={classes.drawerToolBar}>
              <img src={images.logo} alt="Land use logo" className="logo" />
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
                onClick={() => onToggleDrawer()}
              >
                <KeyboardArrowLeft className="primary-text" />
              </IconButton>
            </Toolbar>
            <hr className="divider" />
            <List component="nav">
              <ListItem className={classes.listItem}>
                <ListItemIcon>
                  <BuildIcon color="error" className={classes.lightIcon} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <ToolBoxSwitcher
                      toolboxs={toolboxs}
                      onChange={setSelectedToolbox}
                    />
                  }
                />
              </ListItem>
              <ListItem className={classes.listItem}>
                <ListItemIcon>
                  <LayersIcon color="error" className={classes.lightIcon} />
                </ListItemIcon>
                {/* <ListItemText
                  primary={
                    // <LayerTypeSwitcher onLayerTypeChange={onMapTypeChange} />
                  }
                /> */}
              </ListItem>
              <DownloadRecommendation classes={classes} />
            </List>
          </>
        )}
      </Paper>

      <Paper
        elevation={2}
        className={`${classes.topFloatingButton} ${getMenuStyle(isDrawerOpen)}`}
        onClick={() => onToggleDrawer()}
      >
        <div className={classes.drawerMenu}>
          <Button className={classes.menuButton}>
            <MenuIcon className="primary-text" />
          </Button>
          <Typography variant="h6" className={classes.title}>
            {selectedToolbox}
          </Typography>
        </div>
      </Paper>
    </>
  );
};

export default Drawer;
