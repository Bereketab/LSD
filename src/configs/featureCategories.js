/**
 * value divisions of each property
 */
export default {
  agro_climatic_zone: [
    'Dry Berha',
    'Moist Berha',
    'Dry Kolla',
    'Moist Kolla',
    'Wet Kolla',
    'Dry Woyna Dega',
    'Moist Woyna Dega',
    'Wet Woyna Dega',
    'Dry Dega',
    'Moist Dega',
    'Wet Dega',
    'Moist High Dega',
    'Wet High Dega',
    'Moist Wurch',
    'Wet Wurch'
  ],
  elevation: [100, 500, 1000, 1500, 2000, 2500, 3000, 4000, Infinity],
  land_form: [
    'Plain/Flat',
    'Ridge',
    'Mountain slope',
    'Hill slope',
    'Foot slope',
    'Valley'
  ],
  precipitation: [250, 500, 750, 1000, 1500, 2000, 3000, 4000, Infinity],
  // Todo: change the values of the array
  slope_shape: ['Concave', 'Uniform', 'Convex'],
  // Todo: change the values of the array
  soil_depth: [0, 0, 0, 0, 0],
  // Todo: change the values of the array
  soil_permeability: [0, 0, 0, 1, 1, 1, 1],
  // Todo: change the values of the array
  soil_texture: ['sandy', 'silty', 'clay'],
  topographic_slope: [2, 5, 10, 15, 30, 60, Infinity]
};

export const landFormTypes = [
  {
    value: 1,
    name: 'Plain/Flat'
  },
  {
    value: 3,
    name: 'Ridge'
  },
  {
    value: 4,
    name: 'Mountain slope'
  },
  {
    value: 6,
    name: 'Hill slope'
  },
  {
    value: 8,
    name: 'Foot slope'
  },
  {
    value: 9,
    name: 'Valley'
  }
];

export const unknownData = 'Unknown';
export const noData = 'nodata';
