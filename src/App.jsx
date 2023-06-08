import "./App.css"

import * as d3 from "d3";
import { color, index } from "d3";
import React, { useEffect, useState } from 'react';
import Select from 'react-select';


function Draw({XValue,YValue}) {
  
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://s3-us-west-2.amazonaws.com/s.cdpn.io/2004014/iris.json')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        const array = json.map((data) => (data.species));
        const set = new Set(array);
        const species = Array.from(set);
        setVisibilty(species);
        //console.log(visibilty);
      })
  }, []);


  //console.log(data);

  // return <div>
  //   {data[0].petalLength}
  // </div>


  // async function Data(){
  //   const data = await fetch('https://s3-us-west-2.amazonaws.com/s.cdpn.io/2004014/iris.json')
  //   .then(response => {
  //   return response.json()
  //   })
  // }
  // const data = Data();
  // console.log(data);

  
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  for(const item of data){
    color(item.species);
  }

  const array = data.map((data) => (data.species));
  const set = new Set(array);
  const species = Array.from(set);

  //console.log(species);
  
  
  const [visibilty, setVisibilty] = useState([]);
  //console.log(visibilty);

  // const set = new Set(
  //   data.map(item => item.species)
  // );
  // const species = Array.from(set);

  //console.log(species);

  const w = 600;
  const h = 600;
  const xaxis = 100;
  const yaxis = h - 100;


  

  // const options = [
  //   { value: "sepalLength", label: "Sepal Length" },
  //   { value: "sepalWidth", label: "Sepal Width" },
  //   { value: "petallLength", label: "Petal Length" },
  //   { value: "petalWidth", label: "Petal Width" },
  // ];

  // const [sL,setsL] = useState(options[0]);
  // const [sW,setsW] = useState(options[1]);

  const sL = XValue.value;
  const sW = YValue.value;


  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, item => item[sL]))
    .range([100, w])
    .nice();
  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, item => item[sW]))
    .range([500, 100])
    .nice();


  
  const cc =  color.domain();
  

  return (
      <svg width={w + 100} height={h}>
      {
        //!visibilty.has(item.species)がtrueだったらmapされる
        data.filter(item => visibilty.includes(item.species))
        .map((data, index) => (

          // if((data.speices) === "setosa"){
          //   color = d3.scaleOrdinal(d3.schemeCategory10)
          // } else if((data.speices) === "versicolor"){
          //   color = d3.scaleOrdinal(d3.schemeCategory10)
          // } else {
          //   color = d3.scaleOrdinal(d3.schemeCategory10)
          // }
          <circle key={index} cx={xScale(data.sepalLength)} cy={yScale(data.sepalWidth)} r="5" fill={color(data.species)} />
        ))
      }
      <line x1={xaxis} y1={yaxis} x2={w} y2={yaxis} stroke='black'></line>
      {
        //線形変換してくれるtick()
        xScale.ticks().map((tickValue, index) => {
          return (
            <g transform={`translate(${xScale(tickValue)}, ${yaxis})`} key={index}>
              <line x1="0" y1="0" x2={0} y2={5} stroke="black"></line>
              <text x={0} y={15} textAnchor="middle" dominantBaseline="central" >{tickValue}</text>
            </g>
          );
        })
      }
      <line x1={xaxis} y1={xaxis} x2={xaxis} y2={yaxis} stroke='black'></line>
      {
        yScale.ticks().map((tickValue, index) => {
          return (
            <g transform={`translate(${xaxis},${yScale(tickValue)})`} key={index}>
              <line x1={0} y1={0} x2={-5} y2={0} stroke="black"></line>
              <text x={-10} y={0} textAnchor="end" dominantBaseline="central" >{tickValue}</text>
            </g>
          );
        })
      }
      {
        <g transform={`translate(0,${w / 2})`}>
          <text x="0" y="-10" transform="rotate(-90 50,0)" >
            {sL}
          </text>
        </g>
      }
      {
        <text x={(w) / 2} y={h - 50} >
          {sW}
        </text>
      }

      <g transform={`translate(${w + 10},${xaxis})`}>
        {
          species.map((item, index) => {
            return (
              <g transform={`translate(0,${20 * index})`} key={index}
                style={{cursor: 'pointer'}}
                onClick={() => {
                  // const newVisbility = new Set(visibilty);
                  // if(visibilty.has(item)){
                  //   newVisbility.delete(item);
                  // } else {
                  //   newVisbility.add(item);
                  // }
                  // setVisibilty(newVisbility);

                  
                  if(visibilty.includes(item)){
                  
                    const newVisbility = visibilty.filter(species => 
                      species !== item
                      )
                    setVisibilty(newVisbility);
                  } else {
                    // const newVisibilty = Array.from(visibilty);
                    // newVisibilty.push(item);
                    
                    // setVisibilty(newVisibilty);
                    // console.log(newVisibilty);
                    setVisibilty([item].concat(visibilty));
                  }
                  
                }}
              >
                
                <rect x="0" y="0" width="10" height="10" fill={color(item)} />
                <text x="15" y="5" textAnchor="left" dominantBaseline="central"  fontSize="15" >
                  {item}
                </text>
              </g>
            );
          })
        }

      </g>
      </svg>
  );
}

function App(){
  const options = [
    { value: "sepalLength", label: "Sepal Length" },
    { value: "sepalWidth", label: "Sepal Width" },
    { value: "petallLength", label: "Petal Length" },
    { value: "petalWidth", label: "Petal Width" },
  ];

  const [selectedXValue,setSelectedXValue] = useState(options[0]);
  const [selectedYValue,setSelectedYValue] = useState(options[1]);
  console.log(selectedXValue);
	console.log(selectedYValue);
  return (
    <div style={{ width: "300px", margin: "50px" }} >
        <p>Horizontal Axis</p>
        <Select options={options} defaultValue={selectedXValue} onChange={(value) => {
            if(value){
                setSelectedXValue(value);
            }}}
        />
        <p>Vertical Axis</p>
        <Select options={options} defaultValue={selectedYValue} onChange={(value) => {
                if(value){
                    setSelectedYValue(value);
                }}}
        />
        <Draw XValue={selectedXValue} YValue={selectedYValue} />
        
    </div>
    );
}


export default App;