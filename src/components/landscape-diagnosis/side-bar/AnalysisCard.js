import React, { useEffect,useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';
import InfoTabs from './InfoTabs'
import Area from './Areas';
import FullWidthTabs from './Graphs';
import { Histograms } from './Histograms';
import SummaryTable from './Summary';

import LayerGroup from 'ol/layer/Group';
import { Button } from '@mui/material';
import {
  BrowserRouter as Router,
  Switch,
  Route,
Routes,
  Redirect
} from "react-router-dom";
import {Link } from "react-router-dom";
import BasicDocument from './toPdf';
export default function AnalysisCard(props) {
 
  
const downloadTiff=(modelName)=>{

  if(props.clippedOrMasked=="masked"){
    const win = window.open("http://localhost:8080/geoserver/wcs?SERVICE=WCS&REQUEST=GetCoverage&VERSION=2.0.1&CoverageId="+modelName+'_'+props.clippedOrMasked+"&format=image/tiff", '_blank');
    if (win != null) {
      win.focus();
    }

  }
  if(props.clippedOrMasked=="clipped"){
    const win = window.open("http://localhost:8080/geoserver/wcs?SERVICE=WCS&REQUEST=GetCoverage&VERSION=2.0.1&CoverageId="+modelName+'_'+props.clippedOrMasked+"&format=image/tiff", '_blank');
    if (win != null) {
      win.focus();
    }
  }

}
  



  return (

    <>
    
      <Card sx={{ minWidth: '100%' }} >
        <Button onClick={(e)=>(downloadTiff(props.summaryData))}>Download tiff</Button>    
        <Button >
        <Router>
    <Switch>
      <Route path="/" element={<BasicDocument />}>
      </Route>
    </Switch>
  </Router>
        <Link target="_blank" to="/report"><button>
              Go to Page 2 
            </button>
            </Link>
              </Button>
        <Area  areaData={props.areaData} />
        <Histograms  histogramData={props.histogramData} />
        <SummaryTable summaryData={props.summaryData} />
      </Card></> 
  );
}

