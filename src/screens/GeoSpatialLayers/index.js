import React, { useState, useEffect } from 'react';
import { Grid, LinearProgress, makeStyles } from '@material-ui/core';
import { Image, Vector as VectorLayer } from 'ol/layer';
import { Style, Fill, Stroke, Circle } from 'ol/style';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Vector, ImageWMS } from 'ol/source';

import * as olProj from 'ol/proj';

import { zoomOut, zoomIn } from '../../utils/map';
import MapControls from '../../components/MapControls/MapControls';
import { Sidebar, MapContent } from '../../components/common';

const useStyles = makeStyles((theme) => ({
  primaryColor: {
    background: "#00953b",
  },
  card: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  texWhite: {
    color: "#fff"
  },
  link: {
    color: '#fff',
    fontSize: theme.spacing(1.5),
    marginTop: theme.spacing(3),
    fontStyle: 'italic'
  }
}));

export default function GeoSpatialLayers() {
  const DownloadLinkBase = "http://localhost:8080/geoserver/wcs?SERVICE=WCS&REQUEST=GetCoverage&VERSION=2.0.1&CoverageId=masked:carbon_mask&format=image/tiff"

  const spatialLayers = [
    {
      name: 'Aspect',
      url: "http://localhost:8080/geoserver/geospatial_layers/wms",
        params: { LAYERS: "geospatial_layers:Aspect"  },
        serverType: 'geoserver',
      description: 'Description about agro ecology layer.',
      downloadLink: "http://localhost:8080/geoserver/wcs?SERVICE=WCS&REQUEST=GetCoverage&VERSION=2.0.1&CoverageId=geospatial_layers:Aspect&format=image/tiff"
    },
    {
      name: 'Elevation',
      url: "http://localhost:8080/geoserver/geospatial_layers/wms",
        params: { LAYERS: "geospatial_layers:Elevation" },
        serverType: 'geoserver',
      description: 'Description about agro precipitation layer.',
      downloadLink: "http://localhost:8080/geoserver/wcs?SERVICE=WCS&REQUEST=GetCoverage&VERSION=2.0.1&CoverageId=geospatial_layers:Elevation&format=image/tiff"

    },
    {

      name: "Landform",
      url: "http://localhost:8080/geoserver/geospatial_layers/wms",
        params: { LAYERS: "geospatial_layers:Landform"  },
        serverType: 'geoserver',
      description: 'Description about elevation layer.',
      downloadLink: "http://localhost:8080/geoserver/wcs?SERVICE=WCS&REQUEST=GetCoverage&VERSION=2.0.1&CoverageId=geospatial_layers:Elevation&format=image/tiff"
    },
    {
      name: 'LGP',
      url: "http://localhost:8080/geoserver/geospatial_layers/wms",
        params: { LAYERS: "geospatial_layers:LGP" },
        serverType: 'geoserver',
      description: 'Description about profile curveture layer.',
      downloadLink: "http://localhost:8080/geoserver/wcs?SERVICE=WCS&REQUEST=GetCoverage&VERSION=2.0.1&CoverageId=geospatial_layers:Elevation&format=image/tiff"
    },
    {
      name: 'Mean Temperature',
      url: "http://localhost:8080/geoserver/geospatial_layers/wms",
        params: { LAYERS: "geospatial_layers:Mean Temperature" },
        serverType: 'geoserver',
      description: 'Description about land form layer.',
      downloadLink: "http://localhost:8080/geoserver/wcs?SERVICE=WCS&REQUEST=GetCoverage&VERSION=2.0.1&CoverageId=geospatial_layers:Elevation&format=image/tiff"
    },
    {
      name: 'Rainfall',
      url: "http://localhost:8080/geoserver/geospatial_layers/wms",
      params: { LAYERS: "geospatial_layers:Rainfall" },
      serverType: 'geoserver',
      description: 'Description about topographic slope layer.',
      downloadLink: "http://localhost:8080/geoserver/wcs?SERVICE=WCS&REQUEST=GetCoverage&VERSION=2.0.1&CoverageId=geospatial_layers:Elevation&format=image/tiff"
    },

    {

      name: 'Slope',
      url: "http://localhost:8080/geoserver/geospatial_layers/wms",
      params: { LAYERS: "geospatial_layers:Slope" },
      serverType: 'geoserver',
      description: 'Description about soil clay layer.',
      downloadLink: "http://localhost:8080/geoserver/wcs?SERVICE=WCS&REQUEST=GetCoverage&VERSION=2.0.1&CoverageId=geospatial_layers:Elevation&format=image/tiff"
    },
    {
      name: 'Temperature',
      url: "http://localhost:8080/geoserver/geospatial_layers/wms",
      params: { LAYERS: "geospatial_layers:Temperature" },
      serverType: 'geoserver',
      description: 'Description about sand composition layer.',
      downloadLink: "http://localhost:8080/geoserver/wcs?SERVICE=WCS&REQUEST=GetCoverage&VERSION=2.0.1&CoverageId=geospatial_layers:Elevation&format=image/tiff"
    },
    
    {
      name: 'Soil',
      url: "http://localhost:8080/geoserver/geospatial_layers/wms",
      params: { LAYERS: "geospatial_layers:Soil" },
      serverType: 'geoserver',
      description: 'Description about sand composition layer.',
      downloadLink: "http://localhost:8080/geoserver/wcs?SERVICE=WCS&REQUEST=GetCoverage&VERSION=2.0.1&CoverageId=geospatial_layers:Elevation&format=image/tiff"
    },
 

  ];

  const [map, setMap] = useState(null);
  const [selectedLocation] = useState({});
  const [selectedLayers, setSelectedLayers] = useState([]);
  const [checked, setChecked] = React.useState(false);


  // const updateLegend = (resolution, source, name) => {
  //   const graphicUrl = source.getLegendUrl(resolution);
  //   const img = document.getElementById(name);
  //   if (img) {
  //     img.src = graphicUrl;
  //   } else {
  //     const legendsContainer = document.getElementById('legends');
  //     const legend = document.createElement('img');
  //     legend.src = graphicUrl;
  //     legend.id = name;
  //     legend.style.width = '80%';
  //     legend.style.marginRight = '1em';
  //     legendsContainer.appendChild(legend);
  //   }
  // };

  const removeLayerByName = (mapRef, layerName) => {
    mapRef.getLayers().forEach(function (e) {
      // if(e.get('title')=="GeoSpatial Layers"){
      //   e.getLayers().forEach(function(ee){
      //   if(ee){
      if (e.get('title') == layerName) {
        mapRef.removeLayer(e)
      }
      // }
      console.log(e.get('title'))
      //   })
      // }
    })
    mapRef.getLayers().getArray()
      .filter(layerItem => layerItem.get('title') === layerName)
      .forEach(function (item) {
        // console.log(layerName)
      });
  };
  const handleChange = (event, item) => {

    if (event.target.checked) {
      console.log(true)
      const layerSource = new ImageWMS({
        url:item.url,
        params:item.params,
        serverType: item.serverType
      });
      const overlayLayer = new Image({
        source: layerSource,
        title: item.name
      });

      map.addLayer(overlayLayer)
      const resolution = map.getView().getResolution();
      // updateLegend(resolution, layerSource, name);
      // map.getLayers().forEach(function(e){
      //   if(e.get('title')=="GeoSpatial Layers"){
      //     // console.log(e)
      //     // e.addLayer(overlayLayer)
      //     e.getLayers().array_.push(overlayLayer)
      //   }
      //   // console.log(e.get('title'))
      // })
      //   var  vv=map.getLayerGroup('GeoSpatial Layers');
      //   console.log(vv.getKeys())
      // vv.addLayer(overlayLayer)
    }
    else {
      removeLayerByName(map,item.name )
    }
    setChecked(event.target.checked);
  };

  const handleSelectLayer = (e, name, url, params) => {
    setChecked(true)

    console.log(name, url, params)
    if (selectedLayers.indexOf(name) !== -1 && map) {

      setSelectedLayers(selectedLayers.filter(item => item !== name));
      removeLayerByName(map, name); // remove layer
      const legend = document.getElementById(name);
      legend && legend.remove();
      return;
    }

    setSelectedLayers(selectedLayers.concat(name));
    const layerSource = new ImageWMS({
      url: "http://localhost:8080/geoserver/elri/wms",
      params: { LAYERS: "geospatial_layers:" + name },
      serverType: 'geoserver'
    });
    const overlayLayer = new Image({
      source: layerSource,
      title: name
    });
    if (map) {
      // layer.setOpacity(0.5);
      map.getLayers().forEach(function (e) {
        if (e.get('title') == "GeoSpatial Layers") {
          console.log(e)
          // e.addLayer(overlayLayer)
          e.getLayers().array_.push(overlayLayer)
        }
        // console.log(e.get('title'))
      })

    }
  };

  useEffect(() => {

    // handleSelectLayer(spatialLayers[0].name, spatialLayers[0].url, spatialLayers[0].params);
  }, []);



  const renderLegend = () => {
    return (
      <div style={{ margin: "1em", position: 'absolute', bottom: 0, display: 'flex' }} id="legends" />);
  };

  return (
    <div className="diagnosis-container">
      <Grid container spacing={0}>
        <Grid item xs={3}>

          <div style={{ height: '100%', width: '100%' }} >
            <Sidebar onSelectLayer={handleSelectLayer}
              handleChange={handleChange}
              checked={checked}
              spatialLayers={spatialLayers}
              selectedLayers={selectedLayers} />

          </div>
        </Grid>
        <Grid item xs={9}>
          <div style={{ position: 'relative' }}>
            <MapContent map={map} onSetMap={setMap} selectedLocation={selectedLocation} />
            <MapControls
              onZoomIn={() => zoomIn(map)}
              onZoomOut={() => zoomOut(map)}
            />
            {/* {renderLegend()} */}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
