import React, { useState, useEffect, useRef } from 'react';
import { Grid, LinearProgress, makeStyles, Typography, Paper, Chip, Popover, Button, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import { Image, VectorImage, Vector as VectorLayer } from 'ol/layer';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Vector, ImageWMS } from 'ol/source';
import { Draw } from 'ol/interaction';
import * as olProj from 'ol/proj';
import { Link } from 'react-router-dom';
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from 'ol/style';
import LayerGroup from 'ol/layer/Group';
import { GeoJSON } from 'ol/format';
// import LocalHospital from '@mui/icons-material/LocalHospital';
import { LinearScale, Room, CloudUpload, Map, LocalHospital, CheckBox } from '@material-ui/icons';
import { zoomIn, zoomOut } from '../../utils/map';
import { Image as ImageLayer } from "ol/layer";
import { MapContent } from '../../components/common';
import Sidebar from '../../components/landscape-diagnosis/side-bar';
import { fetchSdgData } from '../../Api/services';
import { AreaPicker } from '../../components';
import MapControls from '../../components/MapControls/MapControls';
import FormHelperText from '@mui/material/FormHelperText';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { tr } from '@faker-js/faker';
import { FormControlLabel, FormGroup } from '@mui/material';
const shp = require('shpjs');




const image = new CircleStyle({
  radius: 5,
  fill: null,
  stroke: new Stroke({ color: 'red', width: 1 }),
});

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
  },
  button: {
    margin: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const DRAW_TYPES = [
  { label: 'Polygon', icon: <LinearScale /> },
  { label: 'Upload', icon: <CloudUpload /> },
  { label: 'Adminstrative Area', icon: <Map /> },
  { label: 'Refresh', icon: <Map /> }
];

export default function LandscapeDiagnosis(props) {
  const [selectedModels, setModelsSelected] = useState();


  const [hasData, setHasData] = useState(false);
  const [clippedOrMasked, setClipedOrMasked] = useState(false);
  const [copyData, setCopyData] = useState(false);
  const [hasErrorShape, setHasErrorShape] = useState(false);
  const [selectedLayers, setSelectedLayers] = useState([]);
  const [onRender, setOnRender] = useState(false);
  const SdgValues = ['degraded', 'improvement', 'stable'];
  const classes = useStyles();
  const [map, setMap] = useState(null);
  const [what_finished, setwhat_finished] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState({});
  const [selected, setSelected] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drawType, setDrawType] = useState(DRAW_TYPES[0].label);
  const [draw, setDraw] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [adminstrativeArea, setAdminstrativeArea] = useState(null);
  const [adminstrativeAreaGeojson, setAdminstrativeAreaGeojson] = useState(null);
  const elementRef = useRef();
  const fileInput = useRef();
  const [adminAreaSelections, setAdminAreaSelections] = useState({
    admin0: '',
    admin1: '',
    admin2: ''
  });
  const [responseData, setResponseData] = useState(false);
  const [shp_, setshp] = useState(false);
  const [loader, setLoader] = useState(false);
  const [dbf, setdbf] = useState(false);
  const [prj, setprj] = useState(false);
  const [shx, setshx] = useState(false);
  const [models_, setModels] = React.useState([]);
  const latestFeature = useRef(null);// store latest point feature on draw layer 
  const openPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  const getProjectedGeojson = (geojsonSource) => {
    // convert geojson 'EPSG:4326' projection to 'EPSG:3857'
    const geom = [];
    geojsonSource.forEachFeature((feature) => {
      const { geometry, ...otherProperties } = feature.getProperties();
      geom.push(new Feature({
        geometry: feature.getGeometry().clone().transform('EPSG:4326', 'EPSG:3857'),
        ...otherProperties
      }));
    });
    const writer = new GeoJSON();
    const geoJsonStr = writer.writeFeatures(geom);
    return geoJsonStr;
  };

  const vectorSource = new Vector({ wrapX: false });

  const polygonLayer = new VectorLayer({
    source: vectorSource,
    title: 'polygon'
  });



  const removeLayerByName = (mapRef, layerName) => {
    mapRef.getLayers().getArray()
      .filter(layerItem => layerItem.get('title') === layerName)
      .forEach(item => map.removeLayer(item));
  };

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

  const handleSelectLayer = (name, url, params) => {
    // check if the selected layer is already selected
    // if it is selected remove it
    if (selectedLayers.indexOf(name) !== -1 && map) {
      setSelectedLayers(selectedLayers.filter(item => item !== name));
      removeLayerByName(map, name); // remove layer
      const legend = document.getElementById(name);
      legend && legend.remove();
      return;
    }
    // if name not exist on selected list, add to the list
    setSelectedLayers(selectedLayers.concat(name));
    const layerSource = new ImageWMS({
      url,
      params: { ...params },
      serverType: 'geoserver'
    });
    const overlayLayer = new Image({
      source: layerSource,
      title: name
    });
    if (map) {
      // layer.setOpacity(0.5);
      map.addLayer(overlayLayer);
      const resolution = map.getView().getResolution();
      updateLegend(resolution, layerSource, name);
      // map.getView().on('change:resolution', function (event) {
      //   const mapResolution = event.target.getResolution();
      //   updateLegend(mapResolution, layerSource, name);
      // });
    }
  };



  const handleMapClicked = (event) => {
    const lonLat = olProj.toLonLat(event.coordinate);
    setLoading(true);
    fetchSdgData(lonLat[0], lonLat[1])
      .then(res => {
        if (res.result) {
          setSelectedLocation({ coord: { lon: lonLat[0], lat: lonLat[1] }, result: res.result });
        }
        setLoading(false);
      })
      .catch(_ => {
        setLoading(false);
      });
  };

  const fitMapToExtent = (map, extent) => {
    if (map) map.getView().fit(extent, map.getSize());
  };
 

  const handlePloygonDrawFinished = (event) => {
    setLoader(true)
    const extent = event.feature.getGeometry().getExtent();
    if (drawType !== 'Point') {
      fitMapToExtent(map, extent);

      //  35.231689453125 7.516845703125  40.417236328125 10.549072265625
      const selectedModel = new FormData();
      var polygonSelectionUrl = "http://localhost:8000/by-clip/" + extent[0] + "/" + extent[1] + "/" + extent[2] + "/" + extent[3];
      selectedModel.append("modelSelection", models_);

      const settings = {
        method: "POST",
        body: selectedModel
      };
      try {
        fetch(polygonSelectionUrl, settings)
          .then(response => response.json())
          .then(data => {
            setCopyData(data.pixelData)
            setHasData(true)
            setLoader(false)
            setClipedOrMasked("clipped")
          });
      } catch (e) {
        return e;
      }


    }

  };

  const addInteraction = (map) => {
    const tempDraw = new Draw({
      source: vectorSource,
      type: drawType
    });
    setDraw(tempDraw);
    tempDraw.on('drawstart', (e) => {
      if (drawType !== 'Point') {
        vectorSource.clear();  // clear previous features
      }
    });
    tempDraw.on('drawend', (e) => handlePloygonDrawFinished(e));
    map.removeInteraction(draw);
    map.addInteraction(tempDraw);

  };

  const renderLegend = () => {
    return (
      <div style={{ margin: "1em", position: 'absolute', bottom: 0, display: 'flex' }} id="legends" />);
  };


  // Geojson style 
  const styles = {


    'Polygon': new Style({
      stroke: new Stroke({
        color: 'blue',
        lineDash: [0],
        width: 3,
      }),
      fill: new Fill({
        color: 'rgba(255, 255, 0, 0.1)',
      }),
    }),

  };

  const styleAdminAreaLayer = (feature, layerTitle) => {
    const data = feature.getProperties();
    const areaCode0 = data.ADM0_CODE;
    const areaCode1 = data.ADM1_CODE;
    const areaCode2 = data.ADM2_CODE;
    if (layerTitle === 'Admin0' && areaCode0 === adminAreaSelections.admin0 && adminAreaSelections.admin1 === '') {
      fitMapToExtent(map, feature.getGeometry().getExtent());
    }
    if (layerTitle === 'Admin1' && areaCode1 === adminAreaSelections.admin1 && adminAreaSelections.admin2 === '') {
      fitMapToExtent(map, feature.getGeometry().getExtent());
    }
    if (layerTitle === 'Admin2' && areaCode2 === adminAreaSelections.admin2) {
      fitMapToExtent(map, feature.getGeometry().getExtent());
    }
    if (layerTitle === 'Admin0') {
      return (areaCode0 === adminAreaSelections.admin0 && adminAreaSelections.admin1 === '') ? styles[feature.getGeometry().getType()] : null;
    }
    if (layerTitle === 'Admin1') {
      return (areaCode1 === adminAreaSelections.admin1 && adminAreaSelections.admin2 === '') ? styles[feature.getGeometry().getType()] : null;
    }
    if (layerTitle === 'Admin2') {
      return areaCode2 === adminAreaSelections.admin2 ? styles[feature.getGeometry().getType()] : null;
    }
    return null;
  };


  const getAnalysis: React.FormEvent<HTMLFormElement> = e => {
    e.preventDefault();
    e.stopPropagation()
    setLoader(true)
    const bBox = [];
    var modelsSelected = [];
    if (!!shp_ && !!shx && !!dbf && prj) {
      const modelsToBackend = {
        'carbon': 'Soil Carbon',
        'erosion': 'Erosion',
        'moisture': 'Moisture',
        'productivity': 'Productivity'
      }
      for (let key of Object.keys(modelsToBackend)) {
        if (models_.includes(modelsToBackend[key])) {
          modelsSelected.push(key)
        }
      }
      setModelsSelected(modelsSelected)
      const uploadshp = new FormData();
      uploadshp.append("shp", shp_, shp_.name);
      uploadshp.append("shx", shx, shx.name);
      uploadshp.append("dbf", dbf, dbf.name);
      uploadshp.append("prj", prj, prj.name);
      uploadshp.append("selected", JSON.stringify(modelsSelected));

      const location = "http://localhost:8000/file-upload";
      const settings = {
        method: "POST",
        body: uploadshp
      };
      try {
        fetch(location, settings)
          .then(response => response.json())
          .then(data => {
            setCopyData(data.pixelData)
            setHasData(true)
            setLoader(false)
            setClipedOrMasked("masked")
          });
      } catch (e) {
        return e;
      }
    } else {
      setHasErrorShape(true)
      // setError(true);
    }
  };

  /**
   * 
   * @param {Array} adminAreaGeojson [admin0Geojson, admin1Geojson, admin2Geojson]
   */
  const addAdminstrativeMapAreaLayer = (adminAreaGeojson, map) => {

    // remove previously added layer
    if (map) {
      map.getLayers().forEach(item => {
        if (item && (item.get('title') === 'Admin0' || item.get('title') === 'Admin1' || item.get('title') === 'Admin2')) {
          map.removeLayer(item);
        }
      });
    }

    // Admin level 0 layer
    const AdminAreaLayers = adminAreaGeojson.map((geojson, index) => {
      return new VectorLayer({
        source: new Vector({
          features: new GeoJSON().readFeatures(geojson)
        }),
        title: `Admin${index}`,
        style: feature => styleAdminAreaLayer(feature, `Admin${index}`),
      });
    });
    if (map) {
      // AdminAreaLayers.forEach(layerItem => overlays.addLayer(layerItem));
      // map.addLayer(overlays)
    }
  };
  const getShape = e => {

    for (let i = 0; i < e.length; i++) {
      let file = e.item(i);
      if (file.name.split(".")[1] == "dbf") {
        setdbf(file);
      }
      if (file.name.split(".")[1] == "shp") {
        setshp(file);
      }
      if (file.name.split(".")[1] == "shx") {
        setshx(file);
      }
      if (file.name.split(".")[1] == "prj") {
        setprj(file);
      }
    }
  };
  const renderPopover = () => {
    return <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      {drawType === DRAW_TYPES[1].label && <>
        <form onSubmit={getAnalysis} className="form">
          <Button
            variant="contained"

          >
            <input id="shapeFileInput"
              type="file"
              ref={fileInput}
              multiple
              accept=".shp, .dbf, .shx, .prj"
              ref={elementRef}
              onChange={evt => getShape(evt.target.files)} />
            {hasErrorShape && <FormHelperText>please select a valid shape file(.dbf,.shp,.shx,.prj) </FormHelperText>}

          </Button>
          <button type="submit" >submit</button>

          {/* <Button
               type="submit" 
          variant="contained"
          color="default"
          className={classes.button}
          endIcon={<LocalHospital />}
        >
          Diagnose
  </Button> */}

        </form>
      </>
      }

      {drawType === DRAW_TYPES[2].label && <div>
        <FormControl className={classes.formControl}>
          <p style={{ margin: 0, padding: 0, color: 'rgb(175 170 170)', fontSize: '.5em' }}>Admin 0</p>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            placeholder='Admin 0'
            value={adminAreaSelections.admin0}
            onChange={event => {
              setAdminAreaSelections({ ...adminAreaSelections, admin0: event.target.value, admin1: '', admin2: '' });
            }}
          >
            {adminstrativeArea && adminstrativeArea[0]?.features.map(feature => <MenuItem value={feature.properties.ADM0_CODE}>{feature.properties.ADM0_NAME}</MenuItem>)}

          </Select>
          <p style={{ margin: 0, padding: 0, color: 'rgb(175 170 170)', fontSize: '.5em' }}>Admin 1</p>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            placeholder="Admin 1"
            value={adminAreaSelections.admin1}
            onChange={event => {
              setAdminAreaSelections({ ...adminAreaSelections, admin1: event.target.value, admin2: '' });
            }}
          >
            {adminstrativeArea && adminstrativeArea[1]?.features.filter(feature => adminAreaSelections.admin0 !== '' ? feature.properties.ADM0_CODE === adminAreaSelections.admin0 : false)?.map(feature => <MenuItem value={feature.properties.ADM1_CODE}>{feature.properties.ADM1_NAME}</MenuItem>)}

          </Select>
          <p style={{ margin: 0, padding: 0, color: 'rgb(175 170 170)', fontSize: '.5em' }}>Admin 2</p>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            placeholder="Admin 2"
            value={adminAreaSelections.admin2}
            onChange={event => {
              setAdminAreaSelections({ ...adminAreaSelections, admin2: event.target.value });
            }}
          >
            {adminstrativeArea && adminstrativeArea[2]?.features.filter(feature => adminAreaSelections.admin1 !== '' ? feature.properties.ADM1_CODE === adminAreaSelections.admin1 : false)?.map(feature => <MenuItem value={feature.properties.ADM2_CODE}>{feature.properties.ADM2_NAME}</MenuItem>)}

          </Select>
        </FormControl></div>}

    </Popover>;
  };

  const clearPreviouslyDrawnFeatures = () => {
    vectorSource.clear(); // clear draw interaction layer source
    latestFeature.current = null;
    // remove privously added  shape layer
    if (map) {
      map.getLayers().forEach(item => {
        if (item && item.get('title') === 'shape') {
          map.removeLayer(item);
        }
      });
    }
    // clear adminstrative area selections
    setAdminAreaSelections({
      admin0: "",
      admin1: "",
      admin2: ""
    });
  };

  const handleDrawTypeSelected = (type, event) => {
    clearPreviouslyDrawnFeatures();

    if (type === DRAW_TYPES[0].label) {
      setwhat_finished(DRAW_TYPES[0].label)
      map.addLayer(polygonLayer);
      addInteraction(map);
      setOnRender(true)
      setDrawType(type);
    }
    if (type === DRAW_TYPES[1].label) {
      setwhat_finished(DRAW_TYPES[1].label)
      openPopover(event);
      setOnRender(true)
      setDrawType(type);
    }
    if (type === DRAW_TYPES[2].label) {
      setwhat_finished(DRAW_TYPES[2].label)
      openPopover(event);
      setOnRender(true)
      setDrawType(type);
    }
    if (type === DRAW_TYPES[3].label) {
      window.location.reload()

    }


  };

  const loadAdminstrativeLayers = (map) => {
    shp("assets/data/shapes.zip").then((geojson) => {
      const admin0GeojsonSource = new Vector({
        features: new GeoJSON().readFeatures(geojson[0])
      });
      const admin0Geojson = JSON.parse(getProjectedGeojson(admin0GeojsonSource));
      const admin1GeojsonSource = new Vector({
        features: new GeoJSON().readFeatures(geojson[1])
      });
      const admin1Geojson = JSON.parse(getProjectedGeojson(admin1GeojsonSource));
      const admin2GeojsonSource = new Vector({
        features: new GeoJSON().readFeatures(geojson[2])
      });
      const admin2Geojson = JSON.parse(getProjectedGeojson(admin2GeojsonSource));


      addAdminstrativeMapAreaLayer([admin0Geojson, admin1Geojson, admin2Geojson], map);
      setAdminstrativeAreaGeojson([admin0Geojson, admin1Geojson, admin2Geojson]);
      setAdminstrativeArea(geojson);
    })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (map) {
      map.on('click', handleMapClicked);
      // initializeLayer();
      loadAdminstrativeLayers(map);
    }
  }, [map]);
  const [disableNext, setDisableNext] = React.useState(false);
 

  const prepareSelection = (e) => {
    if (models_.length !== 0) {
      setDisableNext(true)
      e.target.disabled = true
      setOnRender(true)
      setSelected(true)
      setHasError(false)
      if (map) {
        map.getLayers().forEach(item => {
          if (item && item.get('title') === 'polygon') {
            map.removeLayer(item);
          }
        });
      }
    }
    else {
      setSelected(false)
      setHasError(true)
      if (map) {
        map.getLayers().forEach(item => {
          if (item && item.get('title') === 'polygon') {
            map.removeLayer(item);
          }
        });

      }
    }
  }

  useEffect(() => {
    adminstrativeAreaGeojson &&
      addAdminstrativeMapAreaLayer(adminstrativeAreaGeojson, map);
  }, [JSON.stringify(adminAreaSelections)]);

  const renderRestorationLink = (value) => {
    return value === SdgValues[0] &&
      <Link to={
        {
          pathname: '/landscape-restoration',
          state: {
            lat: selectedLocation.coord.lat,
            lon: selectedLocation.coord.lon,
          }
        }
      } className={classes.link}>
        Please find possible restoration methods
      </Link>;
  };

  const renderSdgInfo = () => {
    return (selectedLocation.coord && !loading ?
      <div style={{ position: 'absolute', bottom: 80, right: 20 }}>
        <Paper elevation={3} className={`${classes.card} ${classes.primaryColor}`} >
          {
            <Typography variant="h5" className={classes.texWhite} gutterBottom>
              {parseInt(selectedLocation.coord.lat).toFixed(2)}° N, {parseInt(selectedLocation.coord.lon).toFixed(2)}° E
            </Typography>

          }
          {selectedLocation.result ? <Chip
            label={selectedLocation.result}
          /> : null}
          {renderRestorationLink(selectedLocation.result)}
        </Paper>
      </div>
      : null);
  };

  return (

    <div className="diagnosis-container">


      <div>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loader}
        // onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
      {/* <Loader loader={loader}/> */}
      <Grid container spacing={0}>
        <Grid item xs={3} style={{ height: '90vh', overflow: 'auto' }}>

          <Sidebar 
          
          // // setClipedOrMasked={setClipedOrMasked}
          clippedOrMasked={clippedOrMasked}
          copyData={copyData}
          setCopyData={setCopyData}
          responseData={responseData}  
           selectedModels={selectedModels} 
           setSelected={setSelected} hasData={hasData} 
           disableNext={disableNext} prepareSelection={prepareSelection} 
           models_={models_} setModels={setModels} hasError={hasError} 
           setHasError={setHasError}
            selected={selected}
             onSelectLayer={handleSelectLayer}
           
            selectedLayers={selectedLayers}
            map={map} />

        </Grid>
        <Grid item xs={9}>
          <div style={{ position: 'relative' }}>
            {loading && <LinearProgress className={classes.primaryColor} />}
            <MapContent map={map} onSetMap={setMap} selectedLocation={selectedLocation} />
            <MapControls
              onZoomIn={() => zoomIn(map)}
              onZoomOut={() => zoomOut(map)}
            />
            {renderSdgInfo()}
            {renderRestorationLink()}
            {renderLegend()}
            <div>
              <AreaPicker onRender={onRender} selected={selected} drawTypes={DRAW_TYPES} what_finished={what_finished} onDrawTypeSelected={handleDrawTypeSelected} drawType={drawType} />
              {renderPopover()}
            </div>
          </div>
        </Grid>
      </Grid>
    </div >
  );
}