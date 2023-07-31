import React, { Fragment, useEffect, useState } from 'react'
import { Box } from '@mui/material';
import queryString from 'query-string';

import ApiRequest from 'components/apiRequest'
import DB from 'components/db'
import useLocalStorage from 'components/useLocalStorage'
import AutoTextField from './autoTextField'
import Chart from 'chart.js/auto';
import GetDataSet from './getDataSet'

export default function TW({opts = {}}){
  let urlParms = queryString.parse(window.location.search), myChart

  const { discordId, setSpinner } = opts
  const [ twDate, setTwDate ] = useLocalStorage('twDate', urlParms?.date);
  const [ chartType, setChartType ] = useLocalStorage('twChartType', urlParms?.type || 'Banners');

  const [ dataSet, setDataSet ] = useState(null)
  const [ twStats, setTWStats ] = useState(null)
  const [ dateKeys, setDateKeys ] = useState(null);

  
  useEffect(()=>{
    if(!twStats) getTWStats()
    if(twStats?.length > 0 && twDate) getDataSet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twStats, twDate, chartType])
  useEffect(()=>{
    if(dataSet) createChart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSet])

  async function createChart (){
    if(myChart) await myChart.destroy()
    document.getElementById("chartCanvas").innerHTML = '<canvas id="myChart" width="1200" height="600"></canvas>'
    myChart = new Chart( document.getElementById('myChart'), dataSet)
  }
  async function getDataSet(){
    GetDataSet({...opts, setDataSet: setDataSet}, twStats, twDate, chartType)
  }

  async function getTWStats(force){
    let obj = await DB.get('twStats')
    if(!obj){
      setSpinner(true)
      const tempObj = await ApiRequest({method: 'twStats', dId: discordId, data: {guildId: urlParms?.guildId}})
      if(tempObj?.data?.length > 0){
        await DB.set('twStats', tempObj?.data)
        obj = tempObj.data
      }
      setSpinner(false)
    }
    if(obj?.length > 0){
      setDateKeys(obj.map(x=>x.date))
      setTWStats(obj)
    }
  }
  const chartTypes = ['Banners', 'Efficency', 'Home Defense', 'Away Defense']
  return (
    <Fragment>
      <AutoTextField array={chartTypes} onSelect={setChartType} desc={'Chart Type'}/>
      {dateKeys?.length > 0 && <AutoTextField array={dateKeys} onSelect={setTwDate} desc={'TW Date'}/>}
      <Box id="chartCanvas" style={{margin: '25px'}}/>
    </Fragment>
  )
}
