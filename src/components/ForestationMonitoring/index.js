/* eslint-disable no-nested-ternary */
import React, { useEffect, useRef, useState } from 'react';
import { Map, View, Overlay } from 'ol';
import { Point } from 'ol/geom';
import { Tile, VectorImage, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector, XYZ, TileJSON } from 'ol/source';
import { GeoJSON } from 'ol/format';
import { Style, Fill, Stroke, Circle } from 'ol/style';
import { defaults } from 'ol/control';

import * as olProj from 'ol/proj';

import '../Map/CustomMap.css';
import '../Map/ol.css';
import './style.css';

import { Typography } from '@material-ui/core';
import { zoomIn, zoomOut } from '../../utils/map';

import MapControls from '../MapControls/MapControls';
// import LayerTypeSwicher from '../LayerTypeSwicher/LayerTypeSwicher';
import ForestMonitoringSwitcher from '../ForestMonitoringSwitcher';
import { getForestationMonitoringDate } from '../../utils/helper';

const forestationDetectionResults = [
  'Forestation',
  'Deforestation',
  'Flood',
];

const ForestationMonitoring = props => {
  const { map, onSetMap, onLayerTypeChange } = props;
  const [offset, setOffset] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedForestationDetectionResultIndex, setSelectedForestationDetectionResultIndex] = useState(0);
  const popup = useRef();
  let selected = null;

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

  const googleHybrid = new Tile({
    source: new XYZ({
      url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}'
    }),
    visible: true,
    title: 'Google Hybrid'
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

  const getColor = year =>
    year > 2018
      ? '#800026'
      : year > 2016
        ? '#BD0026'
        : year > 2014
          ? '#E31A1C'
          : year > 2012
            ? '#FC4E2A'
            : year > 2010
              ? '#FD8D3C'
              : year > 2008
                ? '#FEB24C'
                : year > 2006
                  ? '#FED976'
                  : '#FFEDA0';

  const getStyle = feature =>
    new Style({
      stroke: new Stroke({
        color: 'white',
        width: 2
      }),
      fill: new Fill({
        color: getColor(feature && getForestationMonitoringDate(feature.values_.DN).getFullYear())
      })
    });


  const highlightStyle = new Style({
    fill: new Fill({
      color: 'rgba(255,255,255,0.1)'
    }),
    stroke: new Stroke({
      color: 'red',
      width: 3
    })
  });

  // vector layer
  const DeforestationLayer = new VectorImage({
    source: new Vector({
      url: 'assets/data/deforestation.geojson',
      format: new GeoJSON()
    }),
    visible: true,
    title: 'DeforestationLayer',
    style: getStyle
  });

  const FloodsLayer = new VectorImage({
    source: new Vector({
      url: 'assets/data/floods.geojson',
      format: new GeoJSON()
    }),
    visible: false,
    title: 'Flood',
    style: getStyle
  });

  const IncreaseLayer = new VectorImage({
    source: new Vector({
      url: 'assets/data/increase.geojson',
      format: new GeoJSON()
    }),
    visible: true,
    title: 'Forestation',
    style: getStyle
  });

  const DecreaseLayer = new VectorImage({
    source: new Vector({
      url: 'assets/data/decrease.geojson',
      format: new GeoJSON()
    }),
    visible: false,
    title: 'Deforestation',
    style: getStyle
  });

  const PopupLayer = new Overlay({
    element: document.getElementById('popup'),
    offset: [9, 9],
  });

  const showPopup = (coordinate) => {
    if (!popup.current) return;
    PopupLayer.setPosition(coordinate);
  };

  const handleForestMonitoringSwitcher = (selectedDetection) => {
    if (props.map) {
      map.getLayers().forEach(element => {
        const title = element.get('title');
        element.setVisible(title === selectedDetection || title === props.selectedRasterLayer);
      });
    }
  };

  useEffect(() => {
    const tempMap = new Map({
      controls: defaults({
        attribution: false,
        zoom: false
      }),
      target: 'map',
      view: new View({
        center: [3982926.3789193425, 946474.0930061139],
        zoom: 11,
        minZoom: 5,
        maxZoom: 400
      }),
      layers: [
        OSMStandardLayer,
        OSMHumanitarianLayer,
        stamenLayer,
        googleSatellite,
        googleHybrid,
        terrianTile3D,
        // DeforestationLayer,
        IncreaseLayer,
        DecreaseLayer,
        FloodsLayer
      ]
    });
    onSetMap(tempMap);
  }, []);

  useEffect(() => {
    map.addOverlay(PopupLayer);
    map.on('pointermove', (e) => {
      if (selected !== null) {
        selected.setStyle(undefined);
        setSelectedFeature(null);
        selected = null;
      }
      map.forEachFeatureAtPixel(e.pixel, (f) => {
        selected = f;
        f.setStyle(highlightStyle);
        showPopup(e.coordinate);
        return true;
      });
      setSelectedFeature(selected);
    });
  }, [map]);

  return (
    <>
      <div id="map">
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
          {/* <LayerTypeSwicher onLayerTypeChange={onLayerTypeChange} /> */}
        </div>
        <div
          style={{
            position: 'absolute',
            top: 20,
            right: 10,
            zIndex: 30,
            background: '#5bb75b',
            padding: 10,
            borderRadius: 20
          }}
        >
          <ForestMonitoringSwitcher
            selectedDetection={selectedForestationDetectionResultIndex}
            setSelectedDetection={setSelectedForestationDetectionResultIndex}
            onLayerTypeChange={handleForestMonitoringSwitcher}
            detections={forestationDetectionResults} />
        </div>
        {selectedFeature && <div
          style={{
            position: 'absolute',
            top: 120,
            right: 10,
            zIndex: 30,
            background: '#5bb75b',
            padding: 20,
            borderRadius: 20,
            width: 200,
          }}
        >
          <Typography variant="subtitle1">
            {forestationDetectionResults[selectedForestationDetectionResultIndex]} detected on
          </Typography>
          <Typography variant="body1">
            {getForestationMonitoringDate(selectedFeature && selectedFeature.values_.DN || 0).toDateString()}
          </Typography>
        </div>
        }
      </div>

      <MapControls
        onZoomIn={() => zoomIn(map)}
        onZoomOut={() => zoomOut(map)}
      />
    </>
  );
};

export default ForestationMonitoring;
