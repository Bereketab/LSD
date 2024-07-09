import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import './App.css';
import Sponsors from './components/Sponsors/Sponsors';
import Header from './components/Header/Header';
import { LandRestoration, LandScapeDiagnosis, GeoSpatialLayers, LandingPage } from './screens';
import Loader from './components/common/backdrop';
import BasicDocument from './components/landscape-diagnosis/side-bar/toPdf'
import Grid from '@mui/material/Grid';

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Nunito',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
  },
  palette: {
    primary: {
      main: '#188c4f'
    },
    secondary: {
      main: '#FF5722'
    },
  }
});


function App() {

  return (
    <>
   
    <ThemeProvider theme={theme}>
      
      <div className="App">
        <div className='app-content'>
         
          <Router>
         
            <Header />
            <Switch>
              <Route path="/landscape-restoration">
                <LandRestoration />
              </Route>
              <Route path="/tools" >
                <Redirect to="/geospatial-layers" />
              </Route>
              <Route path="/landscape-diagnosis">
                <LandScapeDiagnosis />
              </Route>
              <Route path="/geospatial-layers">
                <GeoSpatialLayers />
              </Route>
              
              <Route path="/">
                <LandingPage />
              </Route>
            </Switch>
          </Router>
        </div>
        <div className="footer">
          <Sponsors />
        </div>
      </div>
    </ThemeProvider>
    </>
  );
}

export default App;
