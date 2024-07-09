import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Grid,
  List,
  ListItem,
  Paper,
  ListItemText,
  ListItemIcon
} from '@material-ui/core';
import { Map as MapIcon, GetApp as GetAppIcon } from '@material-ui/icons';
import { useLocation } from 'react-router-dom';


import { CustomMap } from '../../components';
import { fetchRecommendationData } from '../../Api/services';

import './index.css';

/**
 * load recommendation data at the beginiing
 * of the application
 */
const storeRecommendationData = () => {
  const storedRecommendationData = localStorage.getItem('RECOMMENDATION_DATA');
  if (
    !JSON.parse(storedRecommendationData) ||
    !JSON.parse(storedRecommendationData).data
  ) {
    fetchRecommendationData()
      .then(res => {
        localStorage.setItem('RECOMMENDATION_DATA', JSON.stringify(res));
      })
      .catch(() => {
        alert('Something wrong while fetching data');
      });
  }
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tab-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <div className="tab-pabel-container">{children}</div>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tab-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    // flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    height: '100%'

  },
  sideBar: {
    height: '100%'
  }
}));

export default function LandscapeRestoration() {
  const classes = useStyles();
  const location = useLocation();

  const [map, setMap] = useState(null);
  const [selectedRasterLayer, setSelectedRasterLayer] = useState('');

  useEffect(() => {
    storeRecommendationData();
  }, []);

  const handleMapTypeChange = layerType => {
    if (map) {
      setSelectedRasterLayer(layerType);
      map.getLayers().forEach(element => {
        const title = element.get('title');
        element.setVisible(title === layerType || title === 'My Farm');
      });
    }
  };


  const openTreeSpeciesTool = () => {
    window.open('https://www.diversityforrestoration.org/tool.php', '_blank');
  };

  return (
    <Grid container >
      <Grid item xs={3}>
        <div style={{ height: '100%', width: '100%' }} >
          <Paper elevation={2} className={classes.sideBar}>
            <List component="nav" aria-label="main mailbox folders">
              <ListItem button selected>
                <ListItemIcon>
                  <MapIcon />
                </ListItemIcon>
                <ListItemText primary="SLM" />
              </ListItem>
              <ListItem button onClick={() => openTreeSpeciesTool()}>
                <ListItemIcon>
                  <MapIcon />
                </ListItemIcon>
                <ListItemText primary="Tree Species" />
              </ListItem>
            </List>
          </Paper>
        </div>
      </Grid>
      <Grid item xs={9}>
        <div className="container">
          <CustomMap
            map={map}
            onSetMap={setMap}
            onLayerTypeChange={handleMapTypeChange}
            coordinates={(
              location.state && location.state.lat && location.state.lon ?
                { lat: location.state.lat, lon: location.state.lon } : null)
            }
          />
        </div>
      </Grid>
    </Grid>

  );
}
