import React, { Fragment, useEffect, useState } from 'react'
import { Table, TableBody, TableRow, TableCell, Button, Typography } from '@mui/material';

import ApiRequest from 'components/apiRequest'
import DB from 'components/db'
import useLocalStorage from 'components/useLocalStorage'

import mapZones from './mapZones'

import DaySelector from '../daySelector'
import ShowDay from './showDay'
import calcPoints from './calcPoints'

export default function Stars({ opts = {}, tb, guild = {}, guildMembers = [], guildMemberLevel, allyCode }){
  const { discordId, setAlert, setSpinner } = opts;
  const [ tbDef, setTBDef ] = useState()
  const [ zoneMap, setZoneMap ] = useState()
  const [ pointsMap, setPointsMap ] = useState(null)
  const [ tbDay, setTBDay ] = useLocalStorage('tbStar-day', 1)
  const [ zoneConfig, setZoneConfig ] = useState()
  const [ showSave, setShowSave ] = useState(true)
  useEffect(()=>{
    if(tb.value) GetTBDef()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tb])

  useEffect(()=>{
    if(tbDef) getZoneData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tbDef])
  useEffect(()=>{
    if(zoneMap) getStarConfig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoneMap])
  useEffect(()=>{
    if(zoneConfig) mapStars()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoneConfig, tbDay])
  async function getZoneData(){
    setSpinner(true)
    let tempObj = await DB.get('tbzonemap-'+tb.value)
    if(!tempObj){
      tempObj = await mapZones(tbDef)
      if(tempObj) await DB.set('tbzonemap-'+tb.value, tempObj)
    }
    setZoneMap(tempObj)
    setSpinner(false)
  }
  async function GetTBDef(){
    setSpinner(true)
    let tempObj = await DB.get('tbDef-'+tb.value)
    if(!tempObj){
      const apiData = await ApiRequest({method: 'mongo', dId: discordId, data: { method: 'get', collection: 'tbDefinition', query: {_id: tb.value}}})
      if(apiData[0]?.id === tb.value){
        await DB.set('tbDef-'+tb.value, apiData[0])
        tempObj = apiData[0]
      }
    }
    setSpinner(false)
    if(tempObj.id){
      setTBDef(tempObj)
    }else{
      setAlert({type: 'error', msg: 'Error getting TB info for '+tb.name+' from server'})
    }
  }
  async function fetchStarConfig(){
    const apiData = await ApiRequest({method: 'tb', dId: discordId, data: { method: 'get', collection: 'tbStarConfig', tbId: tb.value, guildId: guild?.id}})
    if(apiData?.data){
      await DB.set('tbstarconfig-'+tb.value, apiData?.data)
    }
  }
  async function getStarConfig(){
    setSpinner(true)
    let tempObj = await DB.get('tbstarconfig-'+tb.value)
    await fetchStarConfig()
    if(!tempObj) tempObj = await DB.get('tbstarconfig-'+tb.value)
    if(tempObj){
      setZoneConfig(tempObj)
    }else{
      setZoneConfig({})
    }
    setSpinner(false)
  }
  async function mapStars(){
    const tempObj = await calcPoints(zoneMap, guild, zoneConfig)
    //await DB.set('tbstarmap-'+tb.value, tempObj)
    if(tempObj?.roundMap) setPointsMap(tempObj)
  }
  async function SaveConfig(){
    setSpinner(true)
    const tempObj = await DB.get('tbstarconfig-'+tb.value)
    if(tempObj){
      const apiData = await ApiRequest({method: 'tb', dId: discordId, data: {method: 'save', collection: 'tbStarConfig', data: tempObj, tbId: tb.value, guildId: guild?.id, allyCode: allyCode}})
      if(apiData?.data){
        await DB.set('tbstarconfig-'+tb.value, apiData?.data)
        setAlert({type: 'success', msg: 'Config saved successfully'})
      }else{
        if(apiData?.msg){
          setAlert(apiData)
        }else{
          setAlert({type: 'error', msg: 'Error saving config'})
        }
      }
    }
    setSpinner(false)
  }
  async function updateZoneConfig(data = {}, method = 'add'){
    setSpinner(true)
    const tempConfig = JSON.parse(JSON.stringify(zoneConfig))
    if(method === 'add'){
      if(!tempConfig[data.roundNum]) tempConfig[data.roundNum] = {}
      let array = Object.values(tempConfig[data.roundNum])
      if(array?.length > 0){
        let oldData = array.find(x=>x.id?.includes(data.id?.split('-')[1]))
        if(oldData?.id) delete tempConfig[data.roundNum][oldData.id]
      }
      tempConfig[data.roundNum][data.id] = data
    }
    if(method === 'edit'){
      if(!tempConfig[data.roundNum]) tempConfig[data.roundNum] = {}
      if(data.oldId && data.id){
        delete tempConfig[data.roundNum][data.oldId]
        delete data.oldId
        tempConfig[data.roundNum][data.id] = data
      }
    }
    await DB.set('tbstarconfig-'+tb.value, tempConfig)
    setSpinner(false)
    setZoneConfig(tempConfig)
  }

  if(!pointsMap || !pointsMap?.roundMap ) return (
    <Typography>{"Getting TB info from the server"}</Typography>
  )
  return (
    <Fragment>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell><DaySelector sx={{display: 'inline'}} opts={opts} tbDay={tbDay} setTBDay={setTBDay} numDays={tbDef?.roundCount}/></TableCell>
            <TableCell><Typography>{pointsMap.stars+'*'}</Typography></TableCell>
            {guildMemberLevel > 2 && showSave && <TableCell><Button variant="contained" onClick={SaveConfig}>Save</Button></TableCell>}
          </TableRow>
        </TableBody>
      </Table>
      {pointsMap?.roundMap && pointsMap?.roundMap[tbDay] &&
        <ShowDay opts={opts} zoneMap={zoneMap} tbDay={tbDay} guild={guild} roundMap={pointsMap?.roundMap[tbDay]} totalStars={pointsMap.stars} setShowSave={setShowSave} updateZoneConfig={updateZoneConfig}/>}
    </Fragment>
  )
}
//{roundMap?.roundMap && roundMap?.roundMap[tbDay] && <ShowDay opts={opts} tbDef={tbDef} tbDay={tbDay} guild={guild} roundMap={roundMap?.roundMap[tbDay]} totalStars={roundMap.stars} />}
