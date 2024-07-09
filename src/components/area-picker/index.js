import React, { useState } from 'react';
import { ButtonGroup, Button } from '@material-ui/core';
import { Room, LinearScale } from '@material-ui/icons';
import './styles.css';

export default function AreaPicker(props) {
  const { drawTypes, onDrawTypeSelected, drawType,selected,what_finished,onRender } = props;
  return (
    <div className="area-picker-container">
      <ButtonGroup color="primary" aria-label="outlined primary button group">
        {drawTypes.map(
          type => <Button variant={what_finished==type.label?"contained": "outlined"}
           disabled={(selected && (what_finished==type.label||what_finished==null) )|| type.label=='Refresh' ?false:true} 
           key={type.label} 
           onClick={(event) => onDrawTypeSelected(type.label, event)} startIcon={type.icon}>{type.label}</Button>)}
      </ButtonGroup>
    </div>
  );
}
