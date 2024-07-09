/* eslint-disable no-plusplus */
import FEATURE_CALASSIFICATIONS, {
  landFormTypes,
  unknownData,
  noData
} from '../configs/featureCategories';
import { fetchRecommendationData } from '../Api/services';

/**
 * returns the name of landform
 * with a given value
 *
 * @param {number} landFormValue
 */
export const getLandFormTypeName = landFormValue => {
  if (landFormValue === null) return noData;
  const landForm = landFormTypes.find(item => item.value === landFormValue);
  return landForm ? landForm.name : 'nodata';
};

/**
 * return the type of slope shape
 * form a given value
 *
 * @param {number} slopeShapeValue
 */
export const getSlopeShapeName = slopeShapeValue => {
  if (slopeShapeValue === null) return noData;
  if (slopeShapeValue < 0) {
    return FEATURE_CALASSIFICATIONS.slope_shape[0];
  }
  if (slopeShapeValue === 0) {
    return FEATURE_CALASSIFICATIONS.slope_shape[1];
  }
  if (slopeShapeValue > 0) {
    return FEATURE_CALASSIFICATIONS.slope_shape[2];
  }
  return noData;
};

export const convertKelvineToCelcius = temp => (temp - 273.15).toFixed(1);

export const getRecommendationData = async () => {
  let data;
  try {
    // read from local storage
    data = window.localStorage.getItem('RECOMMENDATION_DATA');
    return data
      ? new Promise(resolve => resolve(JSON.parse(data)))
      : fetchRecommendationData();
  } catch (error) {
    // fetch from server
    return fetchRecommendationData();
  }
};

/**
 *
 * returns array containing index of all occurence of the given value
 *
 * @param {array} array
 * @param {string|number} value
 */
export const getAllIndexes = (array, value) => {
  return array.reduce((store, item, index) => {
    if (item === value) store.push(index);
    return store;
  }, []);
};

/**
 *
 * returns binarized object of single value
 * based of feature category
 *
 * @param {sting} featureName
 * @param {float} featureValue
 *
 */
export const decodedFeatureValue = (featureName, featureValue) => {
  let decodedValue = []; // decoded value in the form of [0, 1, 1]
  const decodedFeatureNameValuePair = {}; // decoded feature name and value pair { featureName: decodedValue}
  try {
    const featureDivision = FEATURE_CALASSIFICATIONS[featureName];
    let value = featureValue;
    if (featureName === 'land_form') value = getLandFormTypeName(featureValue);
    if (featureName === 'slope_shape') value = getSlopeShapeName(featureValue);
    // if feature value is nodata (not given) fill the decoded value with -Infinity
    if (value === noData) {
      decodedValue = featureDivision.map(() => unknownData);
    } else if (typeof value === 'string') {
      decodedValue = featureDivision.map(item =>
        item.toLowerCase() === value.toLowerCase() ? 1 : 0
      );
    } else {
      for (let i = 0; i < featureDivision.length; i++) {
        if (Math.round(value) <= featureDivision[i]) {
          decodedValue.push(1);
          break;
        } else {
          decodedValue.push(0);
        }
      }
    }
    // fill the rest with 0
    if (decodedValue.length !== featureDivision.length) {
      const difference = featureDivision.length - decodedValue.length;
      for (let j = 0; j < difference; j++) {
        decodedValue.push(0);
      }
    }
    decodedFeatureNameValuePair[featureName] = decodedValue;
    return decodedFeatureNameValuePair;
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 *
 * returns concatnated object of each features binarized
 * array value with corresponding feature name as key
 *
 * @param {object} featureValues
 *
 */
export const decodeFeatureValues = featureValues => {
  const features = Object.keys(featureValues);
  let decodedValue = {};
  features.forEach(feature => {
    decodedValue = {
      ...decodedValue,
      ...decodedFeatureValue(feature, featureValues[feature])
    };
  });
  return decodedValue;
};

/**
 * return decoded array for each recommendation
 *  each feature is represented as one element
 *
 * @param {array} decodedValue
 */
export const getDecodedValueForAllRecommendations = (
  decodedValue,
  recommendationLookupData
) => {
  const recommendationsDecodedValue = {};

  try {
    // const recommendationData = JSON.parse(localStorage.getItem('RECOMMENDATION_DATA')).data;
    const recommendationData = recommendationLookupData.data;
    const recommendationKeys = Object.keys(recommendationData);

    //  decode value for each recomendation
    recommendationKeys.forEach(recommendation => {
      const singleRecommendationData = recommendationData[recommendation];
      const decodedSingleRecommendationValue = [];
      // get the binary value for each single recommendation features
      const features = Object.keys(singleRecommendationData);
      features.forEach(feature => {
        const indexOfTrue = decodedValue[feature].indexOf(1);
        if (singleRecommendationData[feature][indexOfTrue] === 1) {
          decodedSingleRecommendationValue.push(1);
        } else {
          decodedSingleRecommendationValue.push(0);
        }
      });
      recommendationsDecodedValue[
        recommendation.trim()
      ] = decodedSingleRecommendationValue;
    });
  } catch (error) {
    console.log(error);
    alert('Error while fetching recommendation data');
  }

  return recommendationsDecodedValue;
  // return data;
};

/**
 *
 * Calculate hamming distance between
 * two equal length arrays
 *
 * @param {Array} array1
 * @param {Array} array2
 */
const calculateHammingDistance = (array1, array2) => {
  let distance = 0;
  if (array1.length !== array2.length)
    throw Error('Input arrays have to be equal length.');
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) distance += 1;
  }
  return distance;
};

/**
 *
 * calculate the distance for each recommendation from
 * the given location data (decoded)
 *
 * returns integer
 *
 * @param {Object} decodedFeatureValue
 * @param {Object} recommendationData
 */
export const distanceForEachRecommendation = (
  decodedFeatureValue,
  recommendationData
) => {
  const recommendations = Object.keys(recommendationData);
  const recommendationsDistance = {};
  recommendations.forEach(recommendation => {
    let recommendationDistance = 0;
    const featureNames = Object.keys(recommendationData[recommendation]);
    featureNames.forEach(featureName => {
      recommendationDistance += calculateHammingDistance(
        recommendationData[recommendation][featureName],
        decodedFeatureValue[featureName]
      );
    });
    recommendationsDistance[recommendation] = recommendationDistance;
  });
  return recommendationsDistance;
};

/**
 * retrun object containing reacommendation as a key and it's distance
 * from the hypothetical data as a value
 *
 * @param {object} decodedValueOfRecommendations
 */
export const distanceForEachRecommendation2 = decodedValueOfRecommendations => {
  const recommendations = Object.keys(decodedValueOfRecommendations);
  const hypotheticalValue = decodedValueOfRecommendations[
    recommendations[0]
  ].map(() => 1);
  const recommendationsDistance = {};
  recommendations.forEach(recommendation => {
    const recommendationDistance = calculateHammingDistance(
      hypotheticalValue,
      decodedValueOfRecommendations[recommendation]
    );
    recommendationsDistance[recommendation] = recommendationDistance;
  });
  return recommendationsDistance;
};

/**
 *
 * get the recommendations with smallest distanace
 *
 * returns array of strings
 *
 * @param {Object} recommendationsDistance
 */
export const getRecommendations = recommendationsDistance => {
  const possibleRecommendations = Object.keys(recommendationsDistance);
  let smallValue = Infinity;
  let recommendations = [];
  possibleRecommendations.forEach(recommendation => {
    if (recommendationsDistance[recommendation] < smallValue) {
      recommendations = [recommendation];
      smallValue = recommendationsDistance[recommendation];
    } else if (recommendationsDistance[recommendation] === smallValue) {
      recommendations.push(recommendation);
      smallValue = recommendationsDistance[recommendation];
    }
  });
  return recommendations;
};

/**
 * formats the data to an object with value and label,
 * to make it easy to display in the view
 *
 * @param {object} data , soil property data at a given latlong
 */
export const formatSolilPropertyData = data => {
  return {
    agro_climatic_zone: {
      value:
        data.agro_climatic_zone === noData
          ? unknownData
          : data.agro_climatic_zone || unknownData,
      label: 'Agro climatic zone'
    },
    elevation: {
      value:
        data.elevation === noData ? unknownData : data.elevation || unknownData,
      label: 'Elevation'
    },
    land_form: {
      value:
        getLandFormTypeName(data.land_form) === noData
          ? unknownData
          : getLandFormTypeName(data.land_form) || unknownData,
      label: 'Land form'
    },
    precipitation: {
      value:
        data.precipitation === noData
          ? unknownData
          : data.precipitation || unknownData,
      label: 'Precipitation'
    },
    slope_shape: {
      value: getSlopeShapeName(data.slope_shape) || unknownData,
      label: 'Slope shape'
    },
    soil_depth: {
      value:
        data.soil_depth === noData
          ? unknownData
          : data.soil_depth || unknownData,
      label: 'Soil depth'
    },
    soil_permeability: {
      value:
        data.soil_permeability === noData
          ? unknownData
          : data.soil_permeability || unknownData,
      label: 'Soil permeability'
    },
    soil_texture: {
      value:
        data.soil_texture === noData
          ? unknownData
          : data.soil_texture || unknownData,
      label: 'Soil texture'
    },
    topographic_slope: {
      value:
        data.topographic_slope === noData
          ? unknownData
          : data.topographic_slope || unknownData,
      label: 'Topographic slope'
    }
  };
};

export const getForestationMonitoringDate = offset => {
  const date = new Date('Jan 01, 2004');
  date.setDate(date.getDate() + offset * 16);
  return date;
};
