import React, { useEffect } from 'react';
import { Map, View as v, Feature } from 'ol';
import { Tile, VectorImage, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector, XYZ, TileJSON } from 'ol/source';
import { defaults } from 'ol/control';
import LayerGroup from 'ol/layer/Group';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';
// import ReactToPdf from "react-to-pdf";
import Grid from '@mui/material/Grid';
// import { PDFViewer } from '@react-pdf/renderer';
  const ref = React.createRef();
  function BasicDocument(props) {
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
  

    useEffect(() => {
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
      const tempMap = new Map({
        controls: defaults({
          attribution: false,
          zoom: false
        }),
        target: 'report-map',
        view: new v({
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
     
 
     
     
  
    }, []);
    return (
<>
{/* <PDFViewer> */}
  
            <Grid container spacing={0} >
        <Grid item id="report-map" ref={ref} xs={9} style={{height: '90vh',overflow: 'auto'}}>
          
       
        </Grid>
        <Grid item xs={3}>
         
        <Grid item xs={3}>
         
         area
             </Grid>
             <Grid item xs={3}>
         
         sum
             </Grid>
        </Grid>
       
      </Grid>
  </>
    );
  }
  export default BasicDocument;