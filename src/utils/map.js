/* eslint-disable no-unused-expressions */
export const zoomIn = map => {
  Boolean(map) && map.getView().setZoom(map.getView().getZoom() + 1);
};

export const zoomOut = map => {
  Boolean(map) && map.getView().setZoom(map.getView().getZoom() - 1);
};