import React, { Fragment } from 'react'
import { Chart } from 'react-chartjs-2';
import {Chart as ChartJS } from 'chart.js/auto';

export default function Charts({ options = {}, data = {} }){
  console.log(data)
  return <Chart options={options} data={data}/>
}
