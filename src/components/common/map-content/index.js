import React, { useEffect } from 'react';
import { Map, View, Feature } from 'ol';
import { Point } from 'ol/geom';
import { Tile, VectorImage, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector, XYZ, TileJSON } from 'ol/source';
import { GeoJSON } from 'ol/format';
import { Style, Fill, Stroke, Circle, Icon } from 'ol/style';
import { defaults } from 'ol/control';
import LayerGroup from 'ol/layer/Group';
import LayerSwitcher from 'ol-layerswitcher';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';

import './index.css';

export default function MapContent(props) {
  const { onSetMap, map } = props;
  const OSMHumanitarianLayer = new Tile({
    source: new OSM({
      url: 'http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png'
    }),
    visible: false,
    title: 'OSMHumaniterian'
  });


  const OSMStandardLayer = new Tile({
    source: new OSM({
      url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    }),
    visible: false,
    title: 'OSMStandard'
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


 
  const geoSpatialLayers = new LayerGroup({
    title: 'GeoSpatial Layers',
    
  } );
  const modelLayers = new LayerGroup({
    title: 'Model Layers',
    
  } );
  const baseMaps = new LayerGroup({
    title: 'Base maps',
    layers: [ googleHybrid,
      OSMStandardLayer,
      OSMHumanitarianLayer,
      stamenLayer,
      googleSatellite,
      
    ],
    fold:"open"
  } );
  useEffect(() => {
   
    const tempMap = new Map({
      controls: defaults({
        attribution: false,
        zoom: false
      }),
      target: 'landscape-diagnosis-map',
      view: new View({
        center: [39, 9],
        zoom: 6,
        minZoom: 1,
        maxZoom: 400,
        projection:'EPSG:4326'
      }),
      layers: [
        baseMaps,

      ]
    });
    const layerSwitcher = new LayerSwitcher({
      reverse: false,
      groupSelectStyle: 'children',
      name:'layer'
    });
    tempMap.addControl(layerSwitcher);
    onSetMap(tempMap);
   
  //  tempMap.on('change',function(e){
  //   console.log(true)
  //  })

   
   

  }, []);
 
  return (
    <div id="landscape-diagnosis-map" >
    </div>

  );
}
