/* eslint-disable no-nested-ternary */
import React, { useEffect, useState, useCallback } from 'react';
import { Map, View, Feature } from 'ol';
import { Point } from 'ol/geom';
import { Tile, VectorImage, Vector as VectorLayer, Image } from 'ol/layer';
import { OSM, Vector, XYZ, TileJSON, ImageWMS } from 'ol/source';
import { GeoJSON } from 'ol/format';
import { Style, Fill, Stroke, Circle, Icon } from 'ol/style';
import { defaults } from 'ol/control';

import Select from 'ol/interaction/Select';
import { click } from 'ol/events/condition';
import * as olProj from 'ol/proj';
import LayerGroup from 'ol/layer/Group';

import './CustomMap.css';
import './ol.css';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';

import { BaseLayerOptions, GroupLayerOptions } from 'ol-layerswitcher';

import { zoomIn, zoomOut } from '../../utils/map';
import LayerSwitcher from 'ol-layerswitcher';
import LocationInfo from '../LocationInfo/LocationInfo';
import MapControls from '../MapControls/MapControls';
import LayerTypeSwicher from '../LayerTypeSwicher/LayerTypeSwicher';

const CustomMap = props => {
  const { map, onSetMap, onLayerTypeChange, coordinates } = props;
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const DownloadLinkBase = "https://geoserver.landscapedoctor.icog-labs.com/geoserver/landscape_doctor/csw?service=CSW&version=2.0.2&request=DirectDownload&resourceId=landscape_doctor:";

  const googleHybrid = new Tile({
    source: new XYZ({
      url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}'
    }),
    visible: true,
    title: 'Google Hybrid'
  });
  const OSMStandardLayer = new Tile({
    source: new OSM({
      url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    }),
    visible: false,
    title: 'OSMStandard'
  });

  const OSMHumanitarianLayer = new Tile({
    source: new OSM({
      url: 'http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
    }),
    visible: false,
    title: 'OSMHumaniterian'
  });

  const stamenLayer = new Tile({
    source: new OSM({
      url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.png',
      attributions:
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    }),
    visible: false,
    title: 'Stamen'
  });

  const googleSatellite = new Tile({
    source: new XYZ({
      url: 'http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}'
    }),
    visible: false,
    title: 'Google Satellite'
  });

 

  const terrianTile3D = new Tile({
    source: new TileJSON({
      url:
        'https://api.maptiler.com/tiles/terrain-quantized-mesh/tiles.json?key=VC8iwHDoiRxwVexzfwP7',
      attributions:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
    }),
    visible: true,
    title: 'Terrian Tile 3D'
  });

  const handleMapClicked = event => {
    const lonLat = olProj.toLonLat(event.coordinate);
    setSelectedLocation(lonLat);
    setSelectedFeature(null);
  };

  const layer = new VectorLayer({
    source: new Vector({
      features: [new Feature({
        geometry: new Point(olProj.fromLonLat(selectedLocation || [38.746912, 9.011146])),
        name: 'marker',
      })],
    }),
    title: 'marker',
    style: new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'https://img.icons8.com/ultraviolet/40/000000/marker.png'
      })
    })
  });

  const updateLegend = (resolution, source, name) => {
    const graphicUrl = source.getLegendUrl(resolution);
    const img = document.getElementById(name);
    if (img) {
      img.src = graphicUrl;
    } else {
      const legendsContainer = document.getElementById('legends');
      const legend = document.createElement('img');
      legend.src = graphicUrl;
      legend.id = name;
      legend.style.width = '80%';
      legend.style.marginRight = '1em';
      legendsContainer.appendChild(legend);
    }
  };

  const addSlmLayer = (map) => {
    const data = {
      url: 'https://geoserver.landscapedoctor.icog-labs.com/geoserver/landscape_doctor/wms',
      params: { 'LAYERS': 'RecommendationMap-June30.tif' },
      serverType: 'geoserver',
      name: 'SLM',
      description: 'Description about SLM practices layer.',
      downloadLink: `${DownloadLinkBase}RecommendationMap-June30.tif`
    };
    const layerSource = new ImageWMS({
      url: data.url,
      params: { ...data.params },
      serverType: data.serverType
    });
    const overlayLayer = new Image({
      source: layerSource,
      title: data.name
    });
    if (map) {
      map.addLayer(overlayLayer);
      const resolution = map.getView().getResolution();
      updateLegend(resolution, layerSource, data.name);
    }
  };

  const getColor = d =>
    d > 1000
      ? '#800026'
      : d > 500
        ? '#BD0026'
        : d > 200
          ? '#E31A1C'
          : d > 100
            ? '#FC4E2A'
            : d > 50
              ? '#FD8D3C'
              : d > 20
                ? '#FEB24C'
                : d > 10
                  ? '#FED976'
                  : '#FFEDA0';

  const getStyle = feature =>
    new Style({
      stroke: new Stroke({
        color: 'white',
        lineDash: [1],
        width: 1
      }),
      fill: new Fill({
        color: getColor(feature.values_.density)
      })
    });

  // vector layer
  const Colorpleth = new VectorImage({
    source: new Vector({
      url: 'assets/data/data.geojson',
      format: new GeoJSON()
    }),
    visible: false,
    title: 'Colorpleth',
    style: getStyle
  });

  useEffect(() => {
    const baseMaps = new LayerGroup({
      title: 'Base maps',
      layers: [ googleHybrid,
        OSMStandardLayer,
        OSMHumanitarianLayer,
        stamenLayer,
        googleSatellite,
        
        terrianTile3D,
        Colorpleth,
        layer]
    } );

    const tempMap = new Map({
      controls: defaults({
        attribution: false,
        zoom: false
      }),
      target: 'map',
      view: new View({
        center: [37, 40],
        zoom: 6,
        minZoom: 1,
        maxZoom: 400,
        projection: "EPSG:4326"
      }),
      layers: [
      //  baseMaps
      ]
    });

const layerSwitcher = new LayerSwitcher({
  reverse: true,
  groupSelectStyle: 'group'
});

tempMap.addControl(layerSwitcher);
    addSlmLayer(tempMap);
    onSetMap(tempMap);
   
    layerSwitcher.on('change', (evt) => {
      console.log('show', evt);
    });

  }, []);

  useEffect(() => {
    if (map) {
      map.getLayers().forEach(item => {
        if (item && item.get('title') === 'marker') {
          map.removeLayer(item);
        }
      });
      map.addLayer(layer);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (!coordinates) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setSelectedLocation([
            position.coords.longitude,
            position.coords.latitude
          ]);
        },
        err => console.log(err)
      );
    } else {
      setSelectedLocation([
        coordinates.lon,
        coordinates.lat,
      ]);
    }
  }, []);

  const showColorPlethLayer = () => {
    map.getLayers().forEach(element => {
      const title = element.get('title');
      if (title === 'Colorpleth') {
        element.setVisible(true);
      }
    });
  };

  useEffect(() => {
    // interaction
    const select = new Select({
      condition: click
    });

    if (map) {
      map.addInteraction(select);
      select.on('select', event => {
        setSelectedFeature(
          event.selected.length > 0 ? event.selected[0].values_ : null
        );
        setSelectedLocation(null);
      });
      map.on('click', handleMapClicked);
    }
  }, [map]);

  const renderLegend = () => {
    return (
      <div style={{
        margin: "1em", position: 'absolute', bottom: 20,
        left: 10, display: 'flex'
      }} id="legends" />);
  };

  return (
    <>
      <div id="map">
        {selectedLocation && (
          <div elevation={2} className="info">
            <LocationInfo
              onShowColorPlethLayer={showColorPlethLayer}
              selectedFeature={selectedFeature}
              selectedLocation={selectedLocation}
            />
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 10,
            zIndex: 30,
            background: '#5bb75b',
            padding: 10,
            borderRadius: 20
          }}
        >
          <MapControls
        onZoomIn={() => zoomIn(map)}
        onZoomOut={() => zoomOut(map)}
      />
          {/* <LayerTypeSwicher onLayerTypeChange={onLayerTypeChange} /> */}
        </div>
      </div>
      {renderLegend()}
      
    </>
  );
};

export default CustomMap;
