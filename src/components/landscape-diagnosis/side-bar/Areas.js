
import React, { useEffect, useState } from 'react';
import LayerGroup from 'ol/layer/Group';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);



export const getOption = (name) => {
  if (name == "carbon") {
    const options = {
      layout: {
        padding: {
          right: 0
        }
      },
      responsive: true,
      plugins: {
        legend: {
          position: "top"
        },
        title: {
          display: true,
          text: 'area per heactor'
        }
      },

      scales: {
        y: {
          beginAtZero: true,

          title: {
            display: true,
            text: "Hectar(Ha)"
          },

        },
        x: {
          stacked: false,
          beginAtZero: true,
          title: {
            display: true,
            text: "Soil organic category (g/kg)",
            interlacedColor: "#F8F1E4"
          },

        }
      }
    }
    return options

  }
  if (name == "erosion") {
    const options = {
      layout: {
        padding: {
          right: 0
        }
      },
      responsive: true,
      plugins: {
        legend: {
          position: "top"
        },
        title: {
          display: true,
          text: 'area per heactor'
        }
      },

      scales: {
        y: {
          beginAtZero: true,

          title: {
            display: true,
            text: "Hectar(Ha)"
          },

        },
        x: {
          stacked: false,
          beginAtZero: true,
          title: {
            display: true,
            text: "Soil loss rate (t/ha/yr)",
            interlacedColor: "#F8F1E4"
          },

        }
      }
    }
    return options
  }
  if (name == "moisture") {
    const options = {
      layout: {
        padding: {
          right: 0
        }
      },
      responsive: true,
      plugins: {
        legend: {
          position: "top"
        },
        title: {
          display: true,
          text: 'area per heactor'
        }
      },

      scales: {
        y: {
          beginAtZero: true,

          title: {
            display: true,
            text: "Hectar(Ha)"
          },

        },
        x: {
          stacked: false,
          beginAtZero: true,
          title: {
            display: true,
            text: "Soil moisture range (%)",
            interlacedColor: "#F8F1E4"
          },

        }
      }
    }
    return options
  }
  if (name == "productivity") {
    const options = {
      layout: {
        padding: {
          right: 0
        }
      },
      responsive: true,
      plugins: {
        legend: {
          position: "top"
        },
        title: {
          display: true,
          text: 'area per heactor'
        }
      },

      scales: {
        y: {
          beginAtZero: true,

          title: {
            display: true,
            text: "Hectar(Ha)"
          },

        },
        x: {
          stacked: false,
          beginAtZero: true,
          title: {
            display: true,
            text: "Land productivity (unit less)",
            interlacedColor: "#F8F1E4"
          },

        }
      }
    }
    return options
  }

}



export default function Area(props) {
  const dataset = []
  const label_c = [];
  const [areaData, setAreaData] = useState(false)
  const data = {

  }
  useEffect(() => {
    if (props.areaData) {
      for (const k in props.areaData) {

        if (k == 'carbon') {
          label_c.push(props.areaData[k][0].category)
          dataset.push(
            {
              label: k,
              data: props.areaData[k][0].value,
              backgroundColor: [
                "#d7191c",
                "#ffffc0",
                "#a6d96a",
                "#1a9641",

              ],
            }
          )
        }
        if (k == 'erosion') {
          label_c.push(props.areaData[k][0].category)
          dataset.push(
            {
              label: k,
              data: props.areaData[k][0].value,
              backgroundColor: [
                "#0c8a43",
                "#20ff50",
                "#fffb06",
                "#fd9f11",
                "#ff230f"

              ],
            }
          )
        }
        if (k == 'moisture') {
          label_c.push(props.areaData[k][0].category)
          dataset.push(
            {
              label: k,
              data: props.areaData[k][0].value,
              backgroundColor: [
                "red",
                "#ffffc0",
                "#a6d96a",
                "green",

              ],
            }
          )
        }
        if (k == 'productivity') {
          label_c.push(props.areaData[k][0].category)
          dataset.push(
            {
              label: k,
              data: props.areaData[k][0].value,
              backgroundColor: [
                "red",
                "#ffffc0",
                "#a6d96a",
                "green",

              ],
            }
          )
        }



      }

      data['labels'] = label_c[0]
      data['datasets'] = dataset
      setAreaData(data)
    }
    
  }, [props.areaData]);


if(data && areaData){
  console.log(areaData)
  
  return <Bar options={getOption(areaData.datasets.map(x=>x.label)[0])} data={areaData} />; 
}

  
}