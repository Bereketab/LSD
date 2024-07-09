import React, { useEffect,useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker, it } from '@faker-js/faker';
import LayerGroup from 'ol/layer/Group';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  
};



export function Histograms(props) {
  

  
  const [areaData, setAreaData] = useState(false)
  const data = {}
  useEffect(() => {
    // console.log(props.histogramData)
    
    if (props.histogramData) {
      // console.log("inside histo")
      const dataset = []
      const label_c = [];
      
      for (const k in props.histogramData) {
        
        if (k == 'carbon') {
          label_c.push(props.histogramData[k][0].value.map(x=>x.pixel))
          dataset.push(
            {
              label: k,
              data: props.histogramData[k][0].value.map(x=>x.frequent),
             
            }
          )
        }
        if (k == 'erosion') {
          label_c.push(props.histogramData[k][0].value.map(x=>x.pixel))
          dataset.push(
            {
              label: k,
              data: props.histogramData[k][0].value.map(x=>x.frequent),
             
            }
          )
        }
        if (k == 'moisture') {
          label_c.push(props.histogramData[k][0].value.map(x=>x.pixel))
          dataset.push(
            {
              label: k,
              data: props.histogramData[k][0].value.map(x=>x.frequent),
             
            }
          )
        }
        if (k == 'productivity') {
          label_c.push(props.histogramData[k][0].value.map(x=>x.pixel))
          dataset.push(
            {
              label: k,
              data: props.histogramData[k][0].value.map(x=>x.frequent),
             
            }
          )
        }



      }
      var k = Object.keys(props.histogramData)

      data['labels'] = label_c[0]
      data['datasets'] = dataset
      
      setAreaData(data)
    }
    // console.log(data)
  }, [props.histogramData]);

if(data && areaData){
  // console.log(areaData)
  return <Line options={options} data={areaData} />;
}
  
  
}
