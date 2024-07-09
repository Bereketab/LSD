import React, { useState, useRef, useEffect } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
  Paper,
  Typography, makeStyles, IconButton,
  Menu, MenuItem
} from '@material-ui/core';
import { Image as ImageLayer } from "ol/layer";
import { Vector, ImageWMS } from 'ol/source';

import { MoreVert } from '@material-ui/icons';
import Proptypes from 'prop-types';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import AnalysisCard from './AnalysisCard'
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import { fa, tr } from '@faker-js/faker';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const useStyle = makeStyles((theme) => ({
  title: {
    textAlign: 'center',
    fontSize: '1.1em',
    border: '1px solid #e3e3e3',
    paddingBottom: '1em',
    paddingTop: '1em',
  },
  header: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: '#00953b'
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "flex-end"
  }
}));




function Sidebar(props) {
  const formRef = useRef(null);
  // const [checkedValues,setLastCheckedValues]=useState(null);
  const [selectedModelss, setselectedModelss] = React.useState([
    'carbon',
    'erosion',
    'moisture',
    'productivity',
  ]);
  useEffect(() => {
    if(props.clippedOrMasked){
      console.log(props.clippedOrMasked)
    }
    
    // props.setClipedOrMasked(props.clippedOrMasked)

    let lastAreaElement = setLastAreaData(props.copyData)[setLastAreaData(props.copyData).length - 1];
    let lastHistogramElement = lastHistogramData(props.copyData)[lastHistogramData(props.copyData).length - 1];
    if (lastHistogramElement) {
      setSummaryData(Object.keys(lastHistogramElement)[0])
      showProperMap(Object.keys(lastHistogramElement)[0], true, props.clippedOrMasked)
    }
    setAreaData(lastAreaElement)
    setHistogramData(lastHistogramElement)
  

  }, [props.copyData,props.clippedOrMasked]);
  const theme = useTheme();
  const { models_, hasData, setModels, prepareSelection, hasError } = props;
  const [histogramData, setHistogramData] = useState(false);
  const [areaData, setAreaData] = useState(false);
  const [summaryData, setSummaryData] = useState(false);
  const e = (event) => {
    var updatedList = [...models_];
    if (event.target.checked) {
      updatedList = [...models_, event.target.value];
    } else {
      updatedList.splice(models_.indexOf(event.target.value), 1);
    }
    setModels(updatedList);



  };

  const models = [
    'Soil Carbon',
    'Erosion',
    'Moisture',
    'Productivity',
  ];
  const classes = useStyle();

  const menuOptions = ['Download'];
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };




  const setSelectedModelAnalysis = (selectedModelss, pixelData) => {

    return (
      <>
        <AnalysisCard clippedOrMasked={props.clippedOrMasked} summaryData={summaryData} histogramData={histogramData} map={props.map} areaData={areaData} />

      </>
    );


  }


  const showProperMap = (n, visible, rtype) => {
    // console.log(n)
    if (rtype == 'clipped') {

      if (visible) {
        const maskedImageSource = new ImageWMS({
          url: "http://localhost:8080/geoserver/clipped/wms",
          params: { LAYERS: "clipped:" + n + "_clipped" },
          ratio: 1,
          serverType: "geoserver"
        });
        const maskedImageLayer = new ImageLayer({
          source: maskedImageSource,
          visible: true,
          // type: "overlay",
          title: "Clipped " + n
        });
        var layersToRemove = [];
        props.map.getLayers().forEach(function (layer) {
          if (layer.get('title') != undefined && layer.get('title') === 'Clipped '+n)  { 
            layersToRemove.push(layer);
          }
          if (layer.get('title') != undefined && layer.get('title') === 'Masked '+n)  { 
            layersToRemove.push(layer);
          }
          
        });
        var len = layersToRemove.length;
        for (var i = 0; i < len; i++) {
          props.map.removeLayer(layersToRemove[i]);
        }

        props.map.addLayer(maskedImageLayer)

      }

    }
    if (rtype == 'masked') {
      if (visible) {
        const maskedImageSource = new ImageWMS({
          url: "http://localhost:8080/geoserver/masked/wms",
          params: { LAYERS: "masked:" + n + "_mask" },
          ratio: 1,
          serverType: "geoserver"
        });
        const maskedImageLayer = new ImageLayer({
          source: maskedImageSource,
          visible: true,
          // type: "overlay",
          title: "Masked " + n
        });
        props.map.addLayer(maskedImageLayer)

      }

    }


  }
  const lastHistogramData = (data) => {
    const histogramsArray = []
    // const 
    for (var key in data) {
      Object.values(data[key]).forEach((obj) => {

        histogramsArray.push({ [key]: [{ 'value': Object.values(obj.histograms) }] })

      })

    }
    return histogramsArray;


  }
  const setLastAreaData = (data) => {
    const areaArray = []
    for (var key in data) {
      Object.values(data[key]).forEach((obj) => {
        areaArray.push({ [key]: [{ 'category': Object.keys(obj.area), 'value': Object.values(obj.area), "isVisible": Object.values(obj.isVisible) }] })
      })

    }
    return areaArray;
  }

  const handleChangee = () => {
    const checkboxes = checkboxElement.current.querySelectorAll('input[type="checkbox"]');
    const checkboxData = [];

    checkboxes.forEach((checkbox) => {
      const checkboxId = checkbox.id;
      const isChecked = checkbox.checked;
      checkboxData.push({ key: checkboxId, value: isChecked })
      checkboxData[checkboxId] = isChecked;
    });
    var last = []
    Object.keys(props.copyData).forEach((model) => {

      if (checkboxData.filter(x => x.value == true).length !== 0) {
        let lastAreaElement = checkboxData.filter(x => x.value == true)[checkboxData.filter(x => x.value == true).length - 1];
        if (lastAreaElement.key == model) {
          last.push({ [model]: props.copyData[model] })
        }

      }

    })
    if (last.length!==0) {
      let lastAreaElement = setLastAreaData(last[0]);
      let lastHistogramElement = lastHistogramData(last[0]);
      setSummaryData(Object.keys(lastAreaElement[0])[0])
      showProperMap(Object.keys(lastAreaElement[0])[0], true, props.clippedOrMasked)
      setAreaData(lastAreaElement[0])
      setHistogramData(lastHistogramElement[0])
    }

  };
  const checkboxElement = useRef(false)
  const renderModelCheckBoxes = () => {

    return (<>
      <FormGroup ref={checkboxElement} >
        {Object.keys(props.copyData).map((name) => (

          <FormControlLabel control={<Checkbox id={name} key={name} onChange={(e) => handleChangee({ target: { checked: false } }, name)} defaultChecked={props.copyData[name][0].isVisible} />} label={name} />

        ))}

      </FormGroup>
    </>)
  }



  return (
    <>

      <Grid container >

        {!props.hasData ? <Grid sx={{
          display: 'flex',
          justifyContent: 'center'
        }} mt={1} xs={12}>
          <FormControl ref={formRef} error={hasError}>
            <Typography sx={{
              fontWeight: 600,
              fontSize: '9px'
            }}>
              Please Select Models To Diagnose
            </Typography>

            <Grid sx={{
              display: 'flex',
              justifyContent: 'center'
            }} mt={2} xs={12}>

              <FormGroup>
                {models.map((name) => (
                  <FormControlLabel control={<Checkbox key={name} value={name} onChange={e} />} label={name} />

                ))}

              </FormGroup>

              {hasError && <FormHelperText>Please Select Atleast One Model! </FormHelperText>}
            </Grid>


            <Grid sx={{
              display: 'flex',
              justifyContent: 'center'
            }} mt={2} xs={12}>
              <Button disabled={props.disableNext} onClick={(e) => prepareSelection(e)} variant="outlined">Next</Button>

            </Grid>


          </FormControl>

        </Grid> : <Grid sx={{
          display: 'flex',
          justifyContent: 'center'
        }} mt={1} xs={12}>



          {renderModelCheckBoxes()}
        </Grid>}

        <Grid sx={{
          display: 'display: flow-root;',
          justifyContent: 'center'
        }} mt={2} xs={12}>

          <div id='analysis'>

            {hasData ? setSelectedModelAnalysis(selectedModelss, props.pixelData) : ''}



          </div>


        </Grid>
      </Grid>


    </>
  );
}

Sidebar.propTypes = {
  onSelectLayer: Proptypes.func,
  prepareSelection: Proptypes.func,
  // renderModelCheckBoxes: Proptypes.func
};

export default Sidebar;

