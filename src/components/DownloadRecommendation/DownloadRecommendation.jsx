import React from 'react';
import {
  ListItem,
  ListItemText,
  makeStyles,
  List,
  Avatar,
  Divider,
  ListItemSecondaryAction
} from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FileIcon from '@material-ui/icons/InsertDriveFile';
import ApiConstants from '../../Api/ApiConstants';
import './index.css';

require('dotenv').config(); // load .env file

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  listContent: {
    margin: theme.spacing(0, 2),
  },
  pointer: {
    cursor: 'pointer'
  },
  listItem: {
    margin: theme.spacing(1, 0)
  }
}));

const DownloadRecommendation = ({ classes }) => {

  const styles = useStyles();

  const handleDownloadFile = (file) => {
    const link = document.createElement('a');
    link.href = `${process.env.PUBLIC_URL}${ApiConstants.STATIC_PATH}${file}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="download-container">
      <CloudDownloadIcon className="download-icon" fontSize="large" />

      <List className={styles.root}>
        <ListItem className={[styles.pointer, styles.listItem]}
          onClick={() => handleDownloadFile('Ethiopian_Land_Restoration_Recommendation.tif')}>
          <Avatar>
            <FileIcon />
          </Avatar>
          <ListItemText className={styles.listContent} primary="Land restoration recommendation (.tiff)"
            secondary=" The file contains the land restoration recomendation data for every
        points in ethiopia as a tiff format."/>
          <ListItemSecondaryAction className={styles.pointer}
            onClick={() => handleDownloadFile('Ethiopian_Land_Restoration_Recommendation.tif')} >
            <CloudDownloadIcon />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem className={[styles.pointer, styles.listItem]}
          onClick={() => handleDownloadFile('Southern_Ethiopia_Forestation_Monitoring_2004_01_01_to_2020_05_08.asc')}>
          <Avatar>
            <FileIcon />
          </Avatar>
          <ListItemText className={styles.listContent} primary="Forestation monitoring detection (.asc)"
            secondary=" The file contains forestation monitoring detection in the southern ethiopia portion  as a asc format." />
          <ListItemSecondaryAction className={styles.pointer}
            onClick={() => handleDownloadFile('Southern_Ethiopia_Forestation_Monitoring_2004_01_01_to_2020_05_08.asc')}>
            <CloudDownloadIcon />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
      </List>
    </div >
  );
};

export default DownloadRecommendation;
