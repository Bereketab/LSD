import {
  getAllIndexes,
  convertKelvineToCelcius,
  decodedFeatureValue,
  decodeFeatureValues,
  getRecommendations,
  distanceForEachRecommendation2,
  getDecodedValueForAllRecommendations,
  getRecommendationData,
  formatSolilPropertyData,
  getSlopeShapeName,
  getLandFormTypeName
} from '../helper';
import { unknownData, noData } from '../../configs/featureCategories';

test('Returns all occurence indexes of a value in an array ', () => {
  const indexes = getAllIndexes([1, 2, 3, 4, 2, 3, 2], 2);
  expect(indexes).toEqual([1, 4, 6]);
});

test('Converts temprature in kelvine to centegred', () => {
  const weatherInCentegred = convertKelvineToCelcius(300);
  expect(weatherInCentegred).toBe('26.9');
});

test('Returns binarized object of single value based on feature category', () => {
  let decodedData = decodedFeatureValue('elevation', 1010);
  expect(decodedData).toEqual({
    elevation: [0, 0, 0, 1, 0, 0, 0, 0, 0]
  });
  decodedData = decodedFeatureValue('precipitation', 1337.334657650441);
  expect(decodedData).toEqual({
    precipitation: [0, 0, 0, 0, 1, 0, 0, 0, 0]
  });
  decodedData = decodedFeatureValue('slope_shape', 0);
  expect(decodedData).toEqual({
    slope_shape: [0, 1, 0]
  });
  decodedData = decodedFeatureValue('soil_texture', 'silty');
  expect(decodedData).toEqual({
    soil_texture: [0, 1, 0]
  });
});

test('Returns concatnated object of each features binarized array value with corresponding feature name as key', () => {
  const decodedData = decodeFeatureValues({
    agro_climatic_zone: 'Moist Woyna Dega',
    elevation: 2040,
    land_form: 1,
    precipitation: 1337.334657650441,
    slope_shape: -0.0000018399341570329852,
    soil_depth: 'nodata',
    soil_permeability: 'nodata',
    soil_texture: 'clay',
    topographic_slope: 89.9766845703125
  });
  // console.log(decodedData);
  expect(decodedData).toEqual({
    agro_climatic_zone: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    elevation: [0, 0, 0, 0, 0, 1, 0, 0, 0],
    land_form: [1, 0, 0, 0, 0, 0],
    precipitation: [0, 0, 0, 0, 1, 0, 0, 0, 0],
    slope_shape: [1, 0, 0],
    soil_depth: [
      unknownData,
      unknownData,
      unknownData,
      unknownData,
      unknownData
    ],
    soil_permeability: [
      unknownData,
      unknownData,
      unknownData,
      unknownData,
      unknownData,
      unknownData,
      unknownData
    ],
    soil_texture: [0, 0, 1],
    topographic_slope: [0, 0, 0, 0, 0, 0, 1]
  });
});

test('Returns the decoded value for each recommendation', async () => {
  let decodedRecommendations = {};
  const recommendationLookupData = await getRecommendationData();

  decodedRecommendations = getDecodedValueForAllRecommendations(
    {
      agro_climatic_zone: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      elevation: [0, 0, 0, 0, 0, 1, 0, 0, 0],
      land_form: [1, 0, 0, 0, 0, 0],
      precipitation: [0, 0, 0, 0, 1, 0, 0, 0, 0],
      slope_shape: [1, 0, 0],
      soil_depth: [
        unknownData,
        unknownData,
        unknownData,
        unknownData,
        unknownData
      ],
      soil_permeability: [
        unknownData,
        unknownData,
        unknownData,
        unknownData,
        unknownData,
        unknownData,
        unknownData
      ],
      soil_texture: [0, 0, 1],
      topographic_slope: [0, 0, 0, 0, 0, 0, 1]
    },
    recommendationLookupData
  );
  expect(decodedRecommendations).toEqual({
    'Bench terrace': [1, 1, 0, 1, 0, 0, 0, 0, 1],
    'Contour plough': [0, 0, 1, 0, 1, 0, 0, 0, 0],
    'Fanya Juu': [1, 0, 1, 1, 0, 0, 0, 1, 0],
    'Hillside ditches': [1, 0, 0, 0, 1, 0, 0, 0, 0],
    'Hillside terrace': [1, 0, 0, 1, 1, 0, 0, 0, 0],
    'Level soil bund': [0, 0, 1, 1, 1, 0, 0, 1, 0],
    'Micro-basins': [1, 0, 1, 0, 1, 0, 0, 0, 0],
    'Semi-circular bunds': [0, 0, 1, 0, 1, 0, 0, 0, 0],
    'Stone bunds': [0, 0, 0, 1, 1, 0, 0, 0, 0],
    'Stone faced soil bunds': [0, 0, 0, 1, 1, 0, 0, 0, 0],
    'Stone walls': [1, 1, 1, 1, 1, 0, 0, 0, 0],
    'Tie-ridging': [0, 0, 1, 0, 1, 0, 0, 0, 0],
    Trenches: [1, 0, 0, 0, 1, 0, 0, 0, 0]
  });
});

test('Returns distance of each recommendation from the truth value', () => {
  const distanceOfRecommendations = distanceForEachRecommendation2({
    'Bench terrace': [1, 1, 0, 1, 0, 0, 0, 0, 1],
    'Contour plough': [0, 0, 1, 0, 1, 0, 0, 0, 0],
    'Fanya Juu': [1, 0, 1, 1, 0, 0, 0, 1, 0],
    'Hillside ditches': [1, 0, 0, 0, 1, 0, 0, 0, 0],
    'Hillside terrace': [1, 0, 0, 1, 1, 0, 0, 0, 0],
    'Level soil bund': [0, 0, 1, 1, 1, 0, 0, 1, 0],
    'Micro-basins': [1, 0, 1, 0, 1, 0, 0, 0, 0],
    'Semi-circular bunds': [0, 0, 1, 0, 1, 0, 0, 0, 0],
    'Stone bunds': [0, 0, 0, 1, 1, 0, 0, 0, 0],
    'Stone faced soil bunds': [0, 0, 0, 1, 1, 0, 0, 0, 0],
    'Stone walls': [1, 1, 1, 1, 1, 0, 0, 0, 0],
    'Tie-ridging': [0, 0, 1, 0, 1, 0, 0, 0, 0],
    Trenches: [1, 0, 0, 0, 1, 0, 0, 0, 0]
  });
  expect(distanceOfRecommendations).toEqual({
    'Bench terrace': 5,
    'Contour plough': 7,
    'Fanya Juu': 5,
    'Hillside ditches': 7,
    'Hillside terrace': 6,
    'Level soil bund': 5,
    'Micro-basins': 6,
    'Semi-circular bunds': 7,
    'Stone bunds': 7,
    'Stone faced soil bunds': 7,
    'Stone walls': 4,
    'Tie-ridging': 7,
    Trenches: 7
  });
});

test('Return recommenations with shortest distance from the truth value', () => {
  const recommendations = getRecommendations({
    'Bench terrace': 5,
    'Contour plough': 7,
    'Fanya Juu': 5,
    'Hillside ditches': 7,
    'Hillside terrace': 6,
    'Level soil bund': 5,
    'Micro-basins': 6,
    'Semi-circular bunds': 7,
    'Stone bunds': 7,
    'Stone faced soil bunds': 7,
    'Stone walls': 4,
    'Tie-ridging': 7,
    Trenches: 7
  });
  expect(recommendations).toEqual(['Stone walls']);
});

test('Formats soil property data', () => {
  const result = formatSolilPropertyData({
    agro_climatic_zone: 'Moist Woyna Dega',
    elevation: 1711,
    land_form: 1,
    precipitation: 1328.0750031396747,
    slope_shape: 0.000006739708624081686,
    soil_depth: noData,
    soil_permeability: noData,
    soil_texture: 54,
    topographic_slope: 89.9766845703125
  });
  expect(result).toEqual({
    agro_climatic_zone: {
      value: 'Moist Woyna Dega',
      label: 'Agro climatic zone'
    },
    elevation: {
      value: 1711,
      label: 'Elevation'
    },
    land_form: {
      value: 'Plain/Flat',
      label: 'Land form'
    },
    precipitation: {
      value: 1328.0750031396747,
      label: 'Precipitation'
    },
    slope_shape: {
      value: 'Convex',
      label: 'Slope shape'
    },
    soil_depth: {
      value: unknownData,
      label: 'Soil depth'
    },
    soil_permeability: {
      value: unknownData,
      label: 'Soil permeability'
    },
    soil_texture: {
      value: 54,
      label: 'Soil texture'
    },
    topographic_slope: {
      value: 89.9766845703125,
      label: 'Topographic slope'
    }
  });
});

test('Returns slope shape type from value', () => {
  let slopeShapeName = getSlopeShapeName(-0.894535);
  expect(slopeShapeName).toEqual('Concave');
  slopeShapeName = getSlopeShapeName(0);
  expect(slopeShapeName).toEqual('Uniform');
  slopeShapeName = getSlopeShapeName(0.74985);
  expect(slopeShapeName).toEqual('Convex');
  slopeShapeName = getSlopeShapeName('dsfaslfas');
  expect(slopeShapeName).toEqual(noData);
});

test('Returns land form type from value', () => {
  const landformName = getLandFormTypeName(3);
  expect(landformName).toEqual('Ridge');
});
