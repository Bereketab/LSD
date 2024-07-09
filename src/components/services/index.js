import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid } from '@material-ui/core';

import ImageCard from '../image-card';
import Images from '../../configs/images';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh'
  },
  header: {
    margin: '50px 0'
  },
  center: {
    display: 'flex',
    justifyContent: 'center'
  },
  verticalSpacing: {
    margin: '20px 0'
  }
}));

const services = [
  {
    title: 'Geospetial Layers',
    image: Images.geospatialLayersImage,
    description: 'Contains geospatial dataset that are essential for landscape analysis. It has crop and download functionalities to area of interest.'
  },
  {
    title: 'Landscape Diagnosis',
    image: Images.landscapeDiagnosisImage,
    description: 'Provides products that enables users to identifythe state of landscape degradation and forest status.'
  },
  {
    title: 'Landscape Restoration',
    image: Images.landscapeRestorationImage,
    description: 'Provides restoration technologies/practices/species recommendations that are considerate of the biophysical attributes of specific landscapes under diagnosis.'
  },
  {
    title: 'Landscape Impact Assesment',
    image: Images.landscapeImpactAssessmentImage,
    description: 'Provides ex- and post-ante impacts of land restoration technologies and practices on key landecosystem services.'
  },
  {
    title: 'Tradeoff Analysis & Optimization',
    image: Images.tradeOfAnalysis,
    description: 'Examines trade-offs and synergies between major land ecosystem services due to implemented and planned land managements and restorations.'
  }
];


export default function Services() {
  const classes = useStyles();
  return (
    <div className={classes.root} >
      <div className={classes.header}>
        <Typography variant="h3" component="h3" align="center" gutterBottom className={`${classes.whiteText}`}>
          Features
        </Typography>
        <Grid container xs={12} alignItems='center' alignContent='center'>
          {
            services.map(service => <Grid item xs={12} md={4} alignContent='center' alignItems='center' className={classes.verticalSpacing}>
              <div className={`${classes.center}`}>
                <ImageCard service={service} />
              </div> </Grid>)
          }
        </Grid>

      </div>
    </div>
  );
}
