import Api from '../index';
import ApiConstants from '../ApiConstants';

export const fetchWeatherDataAtLocation = lonLat =>
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lonLat[1]}&lon=${lonLat[0]}&appid=98b2f113ab1b25de7a10aeec020535e8`)
    .then(res => res.json());

export const fetchSoilDataAtLocation = (lonLat) =>
  Api(`${ApiConstants.GET_DATA}?lon=${lonLat[0]}&lat=${lonLat[1]}`);

export const fetchRecommendationData = () =>
  Api(`${ApiConstants.RECOMMENDATION_DATA}`, null, 'get', null);

export const fetchSdgData = (lon, lat) =>
  Api(`${ApiConstants.SDG_DATA}?lon=${lon}&lat=${lat}`, null, 'get', null);