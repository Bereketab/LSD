import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Divider
} from '@material-ui/core';
import LabelIcon from '@material-ui/icons/LabelImportant';
import * as olProj from 'ol/proj';

import {
  fetchWeatherDataAtLocation,
  fetchSoilDataAtLocation
} from '../../Api/services';
import {
  convertKelvineToCelcius,
  decodeFeatureValues,
  getRecommendations,
  distanceForEachRecommendation2,
  getDecodedValueForAllRecommendations,
  getRecommendationData,
  formatSolilPropertyData
} from '../../utils/helper';
import './LocationInfo.css';
import images from '../../configs/images';

const useStyles = makeStyles(theme => ({
  infoContainer: {
    background: '#00953b',
    paddingBottom: theme.spacing(4)
  },
  verticalSpace: {
    // 'margin-top': '8em'
  },
  label: {
    color: '#e3e3e3'
  },
  icon: {
    color: '#e3e3e3',
    fontSize: theme.spacing(2)
  },
  text: {
    color: '#ffffff',
    textAlign: 'right'
  },
  countryName: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: 'white'
  },
  centeredText: {
    textAlign: 'center',
    paddingBottom: theme.spacing(2)
  },
  loader: {
    color: 'white'
  },
  round: {
    borderRadius: '4em'
  },
  weatherData: {
    padding: '1em 2em',
    margin: '0 1em'
  }
}));

export default function LocationInfo(props) {
  const { selectedFeature, selectedLocation } = props;
  const [data, setData] = useState({});
  const [selectedData, setSelectedData] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const styles = useStyles();

  const getRecommendation = async data => {
    try {
      // decode
      const decodedFeatureValues = decodeFeatureValues(data);
      const recommendationData = await getRecommendationData(); // get recommendation loockup data
      const decodedValue = getDecodedValueForAllRecommendations(
        decodedFeatureValues,
        recommendationData
      );
      // calculate distance for each recommendation
      const recommendationsDistance = distanceForEachRecommendation2(
        decodedValue
      );
      // return recommendations with shortest distance
      setRecommendations(getRecommendations(recommendationsDistance));
    } catch (error) {
      console.log(error);
      alert('Error while getting the recommendation.');
    }
  };

  const getInfo = () => {
    setIsLoading(true);
    let lonLat;
    if (selectedFeature) {
      lonLat = olProj.toLonLat(
        selectedFeature.geometry.flatCoordinates.slice(0, 2)
      );
    } else if (selectedLocation) {
      lonLat = selectedLocation;
    }
    Promise.all([
      fetchWeatherDataAtLocation(lonLat),
      fetchSoilDataAtLocation(lonLat)
    ])
      .then(res => {
        const tempData = {
          ...(res[0].cod === 200 ? res[0] : {}),
          ...(res[1].elevation ? res[1] : {})
        };
        // eslint-disable-next-line no-unused-expressions
        res[1].elevation ? getRecommendation(res[1]) : setRecommendations([]);
        /* if (res[1].mask === false) {
          getRecommendation(res[1]);
        } else { setRecommendations([]); }; */
        setData(tempData);
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
      });
  };

  if (
    selectedData &&
    selectedFeature &&
    selectedData.Site !== selectedFeature.Site
  ) {
    setSelectedData(selectedFeature);
  } else if (
    selectedLocation &&
    selectedLocation[0] !== selectedData[0] &&
    selectedLocation[1] !== selectedData[1]
  ) {
    setSelectedData(selectedLocation);
    getInfo();
  }

  const renderSoilPropertyData = soilPropertyData => {
    const dataToRender = Object.values(
      formatSolilPropertyData(soilPropertyData)
    );
    // .values();
    return dataToRender.map(item => (
      <ListItem
        className={`${styles.round} card`}
        button
        onClick={() => props.onShowColorPlethLayer()}
        key={item.label}
      >
        <ListItemIcon>
          <div className="row">
            <LabelIcon className={styles.icon} />
            <div className="itemLabel">
              <Typography className={styles.label}>{item.label}</Typography>
            </div>
          </div>
        </ListItemIcon>
        <ListItemText
          className={styles.text}
          primary={
            typeof item.value === 'number' ? item.value.toFixed(2) : item.value
          }
        />
      </ListItem>
    ));
  };

  useEffect(() => {
    getInfo();
  }, [selectedLocation, selectedFeature]);

  const getWeatherIcon = store =>
    store && store.weather ? `${store.weather[0].icon.slice(0, -1)}n` : '';

  return (
    <>
      <div className={`${styles.infoContainer} ${styles.verticalSpace}`}>
        {isLoading && (
          <div className="center loaderContainer card">
            <CircularProgress className={styles.loader} />
          </div>
        )}
        {!isLoading && (
          <>
            <Typography variant="h5" className={styles.countryName}>
              {data ? data.name : 'Unknown Site'}{' '}
            </Typography>
            <hr className="divider" />
          </>
        )}
        {!isLoading && data !== {} && data.weather && !isLoading && (
          <div className={`row shadow ${styles.weatherData}`}>
            <div>
              <img
                src={images[getWeatherIcon(data)]}
                alt="weather icon"
                className="weatherImage"
              />
            </div>
            <div>
              <Typography className={styles.text} variant="h6" gutterBottom>
                {convertKelvineToCelcius(data.main.temp)} &#8451;
              </Typography>
              <Typography
                className={styles.text}
                variant="caption"
                gutterBottom
              >
                {data.weather[0].description}
              </Typography>
            </div>
          </div>
        )}
        {!isLoading && recommendations.length > 0 && (
          <div className="verticalSpace">
            <hr className="divider" />
            <Typography
              variant="h6"
              className={`${styles.text} ${styles.centeredText} ${styles.underline} verticalSpace`}
            >
              Recommendations
            </Typography>
            <div className="recomendationLabel">
              {recommendations.map(recommendation => (
                <ListItem
                  className={`${styles.round} card`}
                  key={recommendation}
                  button
                  onClick={() => props.onShowColorPlethLayer()}
                >
                  <ListItemIcon>
                    <LabelIcon className={styles.icon} />
                  </ListItemIcon>
                  <ListItemText
                    className={styles.text}
                    primary={recommendation}
                  />
                </ListItem>
              ))}
            </div>
          </div>
        )}

        {!isLoading && data && data.main && (
          <div className={styles.infoContainer}>
            <hr className="divider" />
            <Typography
              variant="h6"
              className={`${styles.text} ${styles.centeredText} ${styles.underline} verticalSpace`}
            >
              Detail Properties
            </Typography>
            <List component="nav" aria-label="main mailbox folders">
              {renderSoilPropertyData(data)}
            </List>
          </div>
        )}
      </div>
    </>
  );
}
