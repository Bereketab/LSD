import React, { useState, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
// import Loading from './Map'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);



export default function Area(props) {
  const xminVal = useRef()
  const yminVal = useRef()
  const xmaxVal = useRef()
  const ymaxVal = useRef()
  const [carbonminMax, setCarbonMinMax] = useState([{x:[{xmin:'0',xmax:'2000'}],y:[{ymin:'0',ymax:'60000'}]}])
  const [moistureminMax, setMoistureMinMax] = useState([{x:[{xmin:'0',xmax:'2000'}],y:[{ymin:'0',ymax:'60000'}]}])
  const [productivityminMax, setProductivityMinMax] = useState([{x:[{xmin:'0',xmax:'2000'}],y:[{ymin:'0',ymax:'60000'}]}])
  const [erosionminMax, setErosionMinMax] = useState([{x:[{xmin:'0',xmax:'2000'}],y:[{ymin:'0',ymax:'200000'}]}])


  const setScaler=(e,modelType)=>{
    const minmaxval=[]
switch (modelType) {
  case 'carbon':
    
    minmaxval.push({x:[{xmin:xminVal.current.value,xmax:xmaxVal.current.value}],y:[{ymin:yminVal.current.value,ymax:ymaxVal.current.value}]})
    setCarbonMinMax(minmaxval)    
    break;
    case 'erosion':
    minmaxval.push({x:[{xmin:xminVal.current.value,xmax:xmaxVal.current.value}],y:[{ymin:yminVal.current.value,ymax:ymaxVal.current.value}]})
    setErosionMinMax(minmaxval);
    case 'moisture':
    minmaxval.push({x:[{xmin:xminVal.current.value,xmax:xmaxVal.current.value}],y:[{ymin:yminVal.current.value,ymax:ymaxVal.current.value}]})
    setMoistureMinMax(minmaxval);
    case 'productivity':
    minmaxval.push({x:[{xmin:xminVal.current.value,xmax:xmaxVal.current.value}],y:[{ymin:yminVal.current.value,ymax:ymaxVal.current.value}]})
    setProductivityMinMax(minmaxval);


  default:
    break;
}
  }

  const SetXYscaler = (prop)=>{
    console.log(prop.modelType)
    return (<>
    <p>set min max scaler for x or y</p>
    <div className='scaler'>
      <label for="x_axis_min">x-min:</label>
      <input ref={xminVal} className="scalerInputs" type="text" id="x_axis_min" name="x_axis_min"/>
      <label for="x_axis_max">x-max:</label>
      <input ref={xmaxVal} className="scalerInputs" type="text" id="x_axis_max" name="x_axis_max"/>

      <label for="y_axis_max">y-min:</label>
      <input ref={yminVal} className="scalerInputs" type="text" id="y_axis_max" name="y_axis_max"/>

      <label for="y_axis_min">y-max:</label>
      <input ref={ymaxVal} className="scalerInputs" type="text" id="y_axis_min" name="y_axis_min"/>
      <button onClick={e => setScaler(e,prop.modelType)}  >set</button>
      </div>
      </>)
    }

  var areaLabel = [];
  var areaValue = [];
  var areaDataset=[]

  const getMax = e => {
    var result = "";
    for (var p in props.data["pixelData"]) {
      if (p === "carbon") {
        result = 90000;
      }
      if (p === "erosion") {
        result = 300000;
      }
      if (p === "moisture") {
        result = 1000000;
      }
      if (p === "productivity") {
        result = 100000;
      }
      // console.log(p)
      return result;
    }
  };
  
  const dataset = [];
  if (props.data) {
    for (var pixels in props.data["pixelData"]) {
      dataset.push({
        label: pixels,
        data: props.data["pixelData"][pixels],
        backgroundColor: "rgba(255, 99, 132, 0.5)"
      });
    }

 
    const getFrequency = array => {
      const map = {};
      array.forEach(item => {
        if (map[item]) {
          map[item]++;
        } else {
          map[item] = 1;
        }
      });

      return map;
    };

    const area_array = [];
    const getRange = array => {
      var range = 0;
      array.forEach(function(e) {
        range = e.value + range;
      });
      // console.log(range)
      return range;
    };
    const calculateArea = list => {
      const map = {};
      for (const [key, value] of Object.entries(list)) {
        for (const [k, v] of Object.entries(props.data["area"])) {
          if (k === props.modelType) {
            const area_cell = value * v;
            area_array.push({
              key: key,
              value: area_cell,
              modelType: props.modelType
            });
          }
        }
      }
      getSummary(area_array);
    };
    const getSummary = area => {
      // console.log(areaLabel)
      // console.log(props.modelType)
      if (props.modelType === "carbon") {
        var carbonClass1 = area.filter(function(o) {
          return o.key <= 10;
        });
        var carbonClass2 = area.filter(function(o) {
          return o.key >= 10 && o.key <= 20;
        });
        var carbonClass3 = area.filter(function(o) {
          return o.key >= 20 && o.key <= 50;
        });
        var carbonClass4 = area.filter(function(o) {
          return o.key >= 50;
        });
        // console.log(carbonClass1)
        if (getRange(carbonClass1) !== 0) {
          areaLabel.push("<=10");
          
          areaValue.push(getRange(carbonClass1));
          // areaDataset
          // console.log(areaLabel)
        }
        if (getRange(carbonClass2) !== 0) {
          areaLabel.push("10-20");
          areaValue.push(getRange(carbonClass2));
           
        }
        if (getRange(carbonClass3) !== 0) {
          areaLabel.push("20-50");
          areaValue.push(getRange(carbonClass3));
           
        }
        if (getRange(carbonClass4) !== 0) {
          areaLabel.push(">50");
          var h=[]
          h.push(getRange(carbonClass4));
           areaDataset.push( {
            label: props.modelType,
            data: h,
            backgroundColor: "red"
          })
        }
      }
      if (props.modelType === "moisture") {
        var erosionClass1 = area.filter(function(o) {
          return o.key <= 29;
        });
        var erosionClass2 = area.filter(function(o) {
          return o.key >= 30 && o.key <= 59;
        });
        var erosionClass3 = area.filter(function(o) {
          return o.key >= 60 && o.key <= 100;
        });
        var erosionClass4 = area.filter(function(o) {
          return o.key >= 100;
        });
        if (getRange(erosionClass1) !== 0) {
          areaLabel.push("0-29");
          areaValue.push(getRange(erosionClass1));
        }
        if (getRange(erosionClass2) !== 0) {
          areaLabel.push("30-59");
          areaValue.push(getRange(erosionClass2));
        }
        if (getRange(erosionClass3) !== 0) {
          areaLabel.push("60-100");
          areaValue.push(getRange(erosionClass3));
        }
        if (getRange(erosionClass4) !== 0) {
          areaLabel.push(">100");
          areaValue.push(getRange(erosionClass4));
        }
      }
      if (props.modelType === "erosion") {
        var moistureClass1 = area.filter(function(o) {
          return o.key < 2;
        });
        var moistureClass2 = area.filter(function(o) {
          return o.key >= 2 && o.key <= 10;
        });
        var moistureClass3 = area.filter(function(o) {
          return o.key >= 11 && o.key <= 20;
        });
        var moistureClass4 = area.filter(function(o) {
          return o.key >= 21 && o.key <= 50;
        });
        var moistureClass5 = area.filter(function(o) {
          return o.key > 50;
        });
        if (getRange(moistureClass1) !== 0) {
          areaLabel.push("<2");
          areaValue.push(getRange(moistureClass1));
        }
        if (getRange(moistureClass2) !== 0) {
          areaLabel.push("2-10");
          areaValue.push(getRange(moistureClass2));
        }
        if (getRange(moistureClass3) !== 0) {
          areaLabel.push("10-20");
          areaValue.push(getRange(moistureClass3));
        }
        if (getRange(moistureClass4) !== 0) {
          areaLabel.push("20-50");
          areaValue.push(getRange(moistureClass4));
        }
        if (getRange(moistureClass5) !== 0) {
          areaLabel.push(">50");
          areaValue.push(getRange(moistureClass5));
        }
      }
      if (props.modelType === "productivity") {
        var propductivityClass1 = area.filter(function(o) {
          return o.key < 0.2;
        });
        var propductivityClass2 = area.filter(function(o) {
          return o.key >= 0.2 && o.key <= 0.4;
        });
        var propductivityClass3 = area.filter(function(o) {
          return o.key > 0.4 && o.key <= 0.6;
        });
        var propductivityClass4 = area.filter(function(o) {
          return o.key > 0.6 && o.key <= 0.8;
        });
        var propductivityClass5 = area.filter(function(o) {
          return o.key > 0.8 && o.key <= 1;
        });
        if (getRange(propductivityClass1) !== 0) {
          areaLabel.push("<0.2");
          areaValue.push(getRange(propductivityClass1));
        }
        if (getRange(propductivityClass2) !== 0) {
          areaLabel.push("0.2-0.4");
          areaValue.push(getRange(propductivityClass2));
        }
        if (getRange(propductivityClass3) !== 0) {
          areaLabel.push("0.4-0.6");
          areaValue.push(getRange(propductivityClass3));
        }
        if (getRange(propductivityClass4) !== 0) {
          areaLabel.push("0.6-0.8");
          areaValue.push(getRange(propductivityClass4));
        }
        if (getRange(propductivityClass5) !== 0) {
          areaLabel.push("0.8-1");
          areaValue.push(getRange(propductivityClass5));
        }
      }
    };

    if (props.graphType == "area") {
      calculateArea(
        getFrequency(
          dataset.filter(x => x.label === props.modelType)[0]["data"]
        )
      );
      if (props.modelType === "carbon") {
        const labels = areaLabel;
        const value_f = areaValue;
        const data = {
          labels,
          datasets:
          //  areaDataset 
          [{
            label: props.modelType,
            data: value_f,
            backgroundColor:    [
              "red",
              "#ffffc0",
              "#a6d96a",
              "green",
              
            ]
          }]
        };
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
              text: props.graphType
            }
          },

          scales: {
        
            y: {
              beginAtZero: true,

              title: {
                display: true,
                text: "Hectar(Ha)"
              },
              ticks: {
                tickLength: 20,
                min: 0,
                max: 100000
              }
            },
            x: {
              stacked: false,
              beginAtZero: true,
              title: {
                display: true,
                text: "Soil organic category (g/kg)",
                interlacedColor: "#F8F1E4"
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 20,
                min: 0
              }
            }
          }
        };
        return <Bar options={options} data={data} />;
      }
      if (props.modelType === "moisture") {
        const labels = areaLabel;
        const value_f = areaValue;
        const data = {
          labels,
          datasets: [
            {
              label: props.modelType,
              data: value_f,
              backgroundColor:   [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)"
              ]
            }
          ]
        };
        const options = {
          // indexAxis: "x",
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
              text: props.graphType
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "Hector(Ha)"
              },
              ticks: {
                tickLength: 10,

                  // callback: (label) => `${label/100000000}`,
              }
            },
            x: {
              stacked: false,
              beginAtZero: true,
              title: {
                display: true,
                text: "Soil moisture range (%)",
                interlacedColor: "#F8F1E4"
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 10
              }
            }
          }
        };
        return <Bar options={options} data={data} />;
      }
      if (props.modelType === "erosion") {
        const labels = areaLabel;
        const value_f = areaValue;
        const data = {
          labels,
          datasets: [
            {
              label: props.modelType,
              data: value_f,
              backgroundColor: [
                "#0c8a43",
                "#20ff50",
                "#fffb06",
                "#fc9b07",
                "#ff230f",
                
              ]
            }
          ]
        };
        const options = {
          indexAxis: "x",
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
              text: props.graphType
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "Hector(Ha)"
              },
              ticks: {
                tickLength: 10

                //   callback: (label) => `${label}`,
              }
            },
            x: {
              stacked: false,
              beginAtZero: true,
              title: {
                display: true,
                text: "Soil loss rate (t/ha/yr)",
                interlacedColor: "#F8F1E4"
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 10
              }
            }
          }
        };

        return <Bar options={options} data={data} />;
      }
      if (props.modelType === "productivity") {
        const labels = areaLabel;
        const value_f = areaValue;
        const data = {
          labels,
          datasets: [
            {
              label: props.modelType,
              data: value_f,
              backgroundColor: "violet"
            }
          ]
        };
        const options = {
          indexAxis: "x",
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
              text: props.graphType
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "Hector(Ha)"
              },
              ticks: {
                tickLength: 10

                //   callback: (label) => `${label}`,
              }
            },
            x: {
              stacked: false,
              beginAtZero: true,
              title: {
                display: true,
                text: "Unit less",
                interlacedColor: "#F8F1E4"
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 10
              }
            }
          }
        };

        return <Bar options={options} data={data} />;
      }
    }
    if (props.graphType == "histograms") {
      if (props.modelType === "carbon") {
        const labels = Object.keys(
          getFrequency(
            dataset.filter(x => x.label === props.modelType)[0]["data"]
          )
        );
        const value_f = Object.values(
          getFrequency(
            dataset.filter(x => x.label === props.modelType)[0]["data"]
          )
        );
        const xmin= parseInt(carbonminMax[0].x[0].xmin);
        const xmax= parseInt(carbonminMax[0].x[0].xmax);
        const ymin= parseInt(carbonminMax[0].y[0].ymin);
        const ymax= parseInt(carbonminMax[0].y[0].ymax);
        const data = {
          labels,
          datasets: [
            {
              label: props.modelType,
              data: value_f,
              backgroundColor: "green"
            }
          ]
        };
        const options = {
          indexAxis: "x",
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
              text: props.graphType
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "Frequency"
              },
              ticks: {
                tickLength: 10,
              },
              min:e => ymin,
              max: e => ymax
            },
            x: {
              stacked: false,
              beginAtZero: true,
              title: {
                display: true,
                text: "Band Values",
                interlacedColor: "#F8F1E4"
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 10
              },
              min:e => xmin,
              max: e => xmax,
            }
          }
        };

        return (<>
        <Bar options={options} data={data} />
<SetXYscaler modelType={props.modelType}/>
        </>);
      }
      if (props.modelType === "moisture") {
        const labels = Object.keys(
          getFrequency(
            dataset.filter(x => x.label === props.modelType)[0]["data"]
          )
        );
        const value_f = Object.values(
          getFrequency(
            dataset.filter(x => x.label === props.modelType)[0]["data"]
          )
        );

        const data = {
          labels,
          datasets: [
            {
              label: props.modelType,
              data: value_f,
              backgroundColor: "blue"
            }
          ]
        };
        const xmin= parseInt(moistureminMax[0].x[0].xmin);
        const xmax= parseInt(moistureminMax[0].x[0].xmax);
        const ymin= parseInt(moistureminMax[0].y[0].ymin);
        const ymax= parseInt(moistureminMax[0].y[0].ymax);
        const options = {
          indexAxis: "x",
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
              text: props.graphType
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "Frequency"
              },
              ticks: {
                tickLength: 10,
              },
              max: e => ymax,
              min: e => ymin
            },
            x: {
              stacked: false,
              beginAtZero: true,
              title: {
                display: true,
                text: "Band Values",
                interlacedColor: "#F8F1E4"
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 10
              },
              max:e=>xmax,
              min:e=>xmin,
            }
          }
        };


        return <Bar options={options} data={data} />;
        // <SetXYscaler modelType={props.modelType}/>

      }
      if (props.modelType === "erosion") {
        const xmin= parseInt(erosionminMax[0].x[0].xmin);
        const xmax= parseInt(erosionminMax[0].x[0].xmax);
        const ymin= parseInt(erosionminMax[0].y[0].ymin);
        const ymax= parseInt(erosionminMax[0].y[0].ymax);
        const labels = Object.keys(
          getFrequency(
            dataset.filter(x => x.label === props.modelType)[0]["data"]
          )
        );
        const value_f = Object.values(
          getFrequency(
            dataset.filter(x => x.label === props.modelType)[0]["data"]
          )
        );
        const data = {
          labels,
          datasets: [
            {
              label: props.modelType,
              data: value_f,
              backgroundColor: "purple"
            }
          ]
        };
        const options = {
          indexAxis: "x",
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
              text: props.graphType
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "Frequency"
              },
              ticks: {
                tickLength: 10,
              },
              max: e => ymax,
              min: e=> ymin,
            },
            x: {
              stacked: false,
              beginAtZero: true,
              title: {
                display: true,
                text: "Band Values",
                interlacedColor: "#F8F1E4"
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 10
              },
              max:e=>xmax,
              min:e=>xmin
            }
          }
        };


        return (<><Bar options={options} data={data} />;
        <SetXYscaler modelType={props.modelType}/></>)

      }
      if (props.modelType === "productivity") {
        const xmin= parseInt(productivityminMax[0].x[0].xmin);
        const xmax= parseInt(productivityminMax[0].x[0].xmax);
        const ymin= parseInt(productivityminMax[0].y[0].ymin);
        const ymax= parseInt(productivityminMax[0].y[0].ymax);
        const labels = Object.keys(
          getFrequency(
            dataset.filter(x => x.label === props.modelType)[0]["data"]
          )
        );
        const value_f = Object.values(
          getFrequency(
            dataset.filter(x => x.label === props.modelType)[0]["data"]
          )
        );
        const data = {
          labels,
          datasets: [
            {
              label: props.modelType,
              data: value_f,
              backgroundColor: "violet"
            }
          ]
        };
        const options = {
          indexAxis: "x",
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
              text: props.graphType
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "Frequency"
              },
              ticks: {
                tickLength: 10,
              },
              max: e => ymax,
              min: e=> xmin,
            },
            x: {
              stacked: false,
              beginAtZero: true,
              title: {
                display: true,
                text: "Band Values",
                interlacedColor: "#F8F1E4"
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 10
              },
              min: e=>xmin,
              max:e=>xmax
            }
          }
        };


        return (<><Bar options={options} data={data} />;
        <SetXYscaler modelType={props.modelType}/></>)


      }
    }
    if (props.graphType == "summary") {
      if (props.modelType === "carbon") {
        const labels = Object.keys(
          getFrequency(
            dataset.filter(x => x.label === props.modelType)[0]["data"]
          )
        );
        const value_f = Object.values(
          getFrequency(
            dataset.filter(x => x.label === props.modelType)[0]["data"]
          )
        );

        const data = {
          labels,
          datasets: [
            {
              label: props.modelType,
              data: value_f,
              backgroundColor: "green"
            }
          ]
        };
        const options = {
          indexAxis: "x",
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
              text: props.graphType
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "Frequency"
              },
              ticks: {
                tickLength: 10
    
                //   callback: (label) => `${label}`,
              },
              max: e => getMax(e)
            },
            x: {
              stacked: false,
              beginAtZero: true,
              title: {
                display: true,
                text: "Band Values",
                interlacedColor: "#F8F1E4"
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 10
              }
            }
          }
        };
    

        return <Bar options={options} data={data} />;
      }
      if (props.modelType === "moisture") {
        const labels = Object.keys(
          getFrequency(
            dataset.filter(x => x.label === props.modelType)[0]["data"]
          )
        );
        const value_f = Object.values(
          getFrequency(
            dataset.filter(x => x.label === props.modelType)[0]["data"]
          )
        );

        const data = {
          labels,
          datasets: [
            {
              label: props.modelType,
              data: value_f,
              backgroundColor: "blue"
            }
          ]
        };
        const options = {
          indexAxis: "x",
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
              text: props.graphType
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "Frequency"
              },
              ticks: {
                tickLength: 10
    
                //   callback: (label) => `${label}`,
              },
              max: e => getMax(e)
            },
            x: {
              stacked: false,
              beginAtZero: true,
              title: {
                display: true,
                text: "Band Values",
                interlacedColor: "#F8F1E4"
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 10
              }
            }
          }
        };
    
        return <Bar options={options} data={data} />;
      }
      if (props.modelType === "erosion") {
        const labels = Object.keys(
          getFrequency(
            dataset.filter(x => x.label === props.modelType)[0]["data"]
          )
        );
        const value_f = Object.values(
          getFrequency(
            dataset.filter(x => x.label === props.modelType)[0]["data"]
          )
        );
        const data = {
          labels,
          datasets: [
            {
              label: props.modelType,
              data: value_f,
              backgroundColor: "purple"
            }
          ]
        };
        const options = {
          indexAxis: "x",
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
              text: props.graphType
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "Frequency"
              },
              ticks: {
                tickLength: 10
    
                //   callback: (label) => `${label}`,
              },
              max: e => getMax(e)
            },
            x: {
              stacked: false,
              beginAtZero: true,
              title: {
                display: true,
                text: "Band Values",
                interlacedColor: "#F8F1E4"
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 10
              }
            }
          }
        };
    

        return <Bar options={options} data={data} />;
      }
      if (props.modelType === "productivity") {
        const labels = Object.keys(
          getFrequency(
            dataset.filter(x => x.label === props.modelType)[0]["data"]
          )
        );
        const value_f = Object.values(
          getFrequency(
            dataset.filter(x => x.label === props.modelType)[0]["data"]
          )
        );
        const data = {
          labels,
          datasets: [
            {
              label: props.modelType,
              data: value_f,
              backgroundColor: "violet"
            }
          ]
        };
        const options = {
          indexAxis: "x",
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
              text: props.graphType
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "Frequency"
              },
              ticks: {
                tickLength: 10
    
                //   callback: (label) => `${label}`,
              },
              max: e => getMax(e)
            },
            x: {
              stacked: false,
              beginAtZero: true,
              title: {
                display: true,
                text: "Band Values",
                interlacedColor: "#F8F1E4"
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 10
              }
            }
          }
        };
    

        return <Bar options={options} data={data} />;
      }
    }
  } else {
    // console.log(props.modelType)
    return (
    
      <div className='spinner'>
      <div class="spinner-border" role="status">
      </div>
      </div>
   
    );
  }
}
