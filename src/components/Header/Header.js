import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Avatar,
  Typography,
  makeStyles
} from '@material-ui/core';
import { Link, useLocation, useHistory } from 'react-router-dom';
import colors from '../../configs/colors';
import images from '../../configs/images';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  flexGrow: {
    flexGrow: 1
  },
  toolbar: {
    backgroundColor: colors.white
    // boxShadow: 'none'
  },
  bottomToolbar: {
    marginTop: '-1em'
  },
  appName: {
    fontSize: theme.spacing(2),
    flexGrow: 1,
    marginLeft: theme.spacing(1),
    color: colors.black
  },
  linkButton: {
    color: '#000',
    margin: `0 ${theme.spacing(1)}px`,
    cursor: 'pointer',
    fontSize: '0.7em',
    textTransform: 'uppercase',
    textDecoration: 'none'
    // '-webkit-box-shadow': '3px 4px 5px -2px rgba(0,0,0,0.75)',
    // '-moz-box-shadow': '3px 4px 5px -2px rgba(0,0,0,0.75)',
    // 'box-shadow': '3px 4px 5px -2px rgba(0,0,0,0.75)'
  },
  landscapeDiagnosisButton: {
    backgroundColor: '#ffc000'
  },
  landscapeRestorationButton: {
    backgroundColor: '#ffe69b'
  },
  landscapeImpactAssessmentButton: {
    backgroundColor: '#b4c7e7'
  },
  tradeOffAnalysisButton: {
    backgroundColor: '#8cacdb'
  },
  linkButtonsContainer: {
    // width: '100%',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  activeButton: {
    // padding: theme.spacing(1)
    color: '#00953b',
    fontWeight: 'bold'
  },
  avatar: {
    cursor: 'pointer',
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center'
  }
}));

const Header = () => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();

  const landingPageMenu = [
    {
      name: 'Home',
      path: '/'
    },
    {
      name: 'Documentation',
      path: '/'
    },
    {
      name: 'Tool',
      path: '/tools',
    },
  ];

  const appTypeList = [
    {
      name: 'Geo Spatial Layers',
      buttonClassName: classes.landscapeDiagnosisButton,
      path: '/geospatial-layers'
    },
    {
      name: 'Landscape Diagnosis',
      buttonClassName: classes.landscapeDiagnosisButton,
      path: '/landscape-diagnosis'
    },
    {
      name: 'Landscape Restoration',
      buttonClassName: classes.landscapeRestorationButton,
      path: '/landscape-restoration'
    },
    {
      name: 'Landscape Impact Assessment',
      buttonClassName: classes.landscapeImpactAssessmentButton,
      path: ''
    },
    {
      name: 'TradeOff Analysis & Optimization',
      buttonClassName: classes.tradeOffAnalysisButton,
      path: ''
    }
  ];

  const getActiveButtonClass = link =>
    location.pathname === link.path ? classes.activeButton : '';

  const canRenderLandingPageMenu = () => {
    console.log(location.pathname, 'path name');
    return landingPageMenu.find(item => item.path === location.pathname);
  };


  const renderMenu = () => {
    if (canRenderLandingPageMenu())
      return landingPageMenu.map(type => (
        <div
          className={`${classes.buttonContainer}`}
          key={type.name}
        >
          <Link to={type.path} className={`${classes.linkButton} ${getActiveButtonClass(type)}`}>
            {type.name}
          </Link>
        </div>
      ));
    return appTypeList.map(type => (
      <div
        className={`${classes.buttonContainer}`}
        key={type.name}
      >
        <Link to={type.path} className={`${classes.linkButton} ${getActiveButtonClass(type)}`}>
          {type.name}
        </Link>
      </div>
    ));
  };

  const navigateToHome = () => {
    history.push('/');
  };

  return (
    <AppBar className={classes.toolbar} position="sticky">
      <Toolbar className={classes.toolbar}>
        <div className={classes.avatar} onClick={navigateToHome}>
          <Avatar src={images.logo4} />
          <Typography className={classes.appName}  >
            Landscape Doctor Toolbox
       </Typography>
        </div>
        <div className={classes.linkButtonsContainer}>
          {renderMenu()}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
