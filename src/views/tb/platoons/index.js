import React, { Fragment, useEffect, useState } from 'react'
import { Table, TableBody, TableRow, TableCell, Button, Typography } from '@mui/material';

import ApiRequest from 'components/apiRequest'
import DB from 'components/db'
import useLocalStorage from 'components/useLocalStorage'
import MapPlatoons from './mapPlatoons'

import DaySelector from '../daySelector'
import ShowPlatoons from './showPlatoons'

const getRound = (id)=>{
  try{
    let array = id.split('-')
    for(let i in array){
      if(+array[i] >= 1) return +array[i]
    }
  }catch(e){
    console.error(e);
  }
}
export default function Platoons({opts = {}, tb = {}, guild = {}, guildMembers = [], allyCode, guildMemberLevel = 0}){
  const { discordId, setAlert, setSpinner } = opts
  //const [ tbDef, setTBDef ] = useState()
  const [ platoons, setPlatoons ] = useState()
  const [ tbDay, setTBDay ] = useLocalStorage('tbPlatoon-day', 1)
  const [ numDays, setNumDays ] = useState(1)
  const [ platoonMap, setPlatoonMap ] = useState([])
  const [ platoonIds, setPlatoonIds ] = useState([])
  useEffect(()=>{
    if(tb.value) GetTBDef()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tb])
  useEffect(()=>{
    if(platoons?.length > 0 && platoonIds?.length > 0) GetPlatoonMap()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platoons])
  useEffect(()=>{
    if(tbDay) GetPlatoonIds()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tbDay])
  useEffect(()=>{
    if(platoonIds) GetPlatoonMap()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platoonIds])
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
    if(tempObj?.roundCount >= 0){
      setNumDays(+tempObj.roundCount)
      //setTBDef(tempObj)
      GetPlatoons()
    }else{
      setAlert({type: 'error', msg: 'Error getting TB info for '+tb.name+' from server'})
    }
  }
  async function fetchPlatoonIds(){
    const apiData = await ApiRequest({method: 'tb', dId: discordId, data: { method: 'get', collection: 'tbPlatoonConfig', tbId: tb.value, guildId: guild.id}})
    if(apiData?.data?.length > 0){
      for(let i in apiData?.data){
        if(!apiData.data[i].round) apiData.data[i].round = await getRound(apiData.data[i].id)
        if(!apiData.data[i].tbId) apiData.data[i].tbId = tb.value
        if(apiData.data[i].id && !apiData.data[i].id.includes('-'+tb.value)) apiData.data[i].id = apiData.data[i].id+'-'+tb.value
        await DB.set(apiData.data[i].id, apiData.data[i])
      }
    }
  }
  async function GetPlatoonIds(){
    setSpinner(true)
    setPlatoonMap([])
    let tempObj = await DB.get('tbPlatoonIds-'+tbDay+'-'+tb.value)
    if(!tempObj){
      await fetchPlatoonIds()
      tempObj = await DB.get('tbPlatoonIds-'+tbDay+'-'+tb.value)
    }
    if(!tempObj){
      tempObj = {id: 'tbPlatoonIds-'+tbDay+'-'+tb.value, round: +tbDay, data: [{id: 'P'+tbDay+'-C1'}, {id: 'P'+tbDay+'-C2'}, {id: 'P'+tbDay+'-C3'}]}
      await DB.set('tbPlatoonIds-'+tbDay+'-'+tb.value, tempObj)
    }
    if(tempObj?.data) setPlatoonIds(tempObj.data)
    setSpinner(false)
  }
  async function GetPlatoons(){
    setSpinner(true)
    let tempObj = await DB.get('tbPlatoons-'+tb.value)
    if(!tempObj){
      const apiData = await ApiRequest({method: 'mongo', dId: discordId, data: { method: 'get', collection: 'tbPlatoons', query: {_id: tb.value}}})

      if(apiData[0]?.id === tb.value && apiData[0]?.platoons?.length > 0){
        await DB.set('tbPlatoons-'+tb.value, apiData[0].platoons)
        tempObj = apiData[0].platoons
      }
    }
    setSpinner(false)
    if(tempObj){
      setPlatoons(tempObj)
    }else{
      setAlert({ type: 'error', msg: 'Error getting platoons for '+tb.name+' from the server'})
    }
  }
  async function GetPlatoonMap(){
    setSpinner(true)
    const tempPlatoonMap = await MapPlatoons(platoons, guildMembers, platoonIds, tbDay)
    if(tempPlatoonMap?.length > 0){
      await DB.set('tb-platoonsMap-'+tbDay, tempPlatoonMap)
      setPlatoonMap(tempPlatoonMap)
    }
    setSpinner(false)
  }
  async function SaveConfig(){
    setSpinner(true)
    let data = []
    for(let i = 0;i< +numDays;i++){
      let tempObj = await DB.get('tbPlatoonIds-'+i+'-'+tb.value)
      if(tempObj?.id) data.push(tempObj)
    }
    if(data.length > 0){
      const apiData = await ApiRequest({method: 'tb', dId: discordId, data: {method: 'save', collection: 'tbPlatoonConfig', data: data, tbId: tb.value, guildId: guild.id, allyCode: allyCode}})
      if(apiData?.data.length > 0){
        for(let i in apiData?.data) await DB.set(apiData?.data[i].id, apiData?.data[i])
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
  if(!platoons || platoons.length === 0) return (
    <Typography>{"Getting platoon info from the server"}</Typography>
  )
  return (
    <Fragment>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell><DaySelector sx={{display: 'inline'}} opts={opts} tbDay={tbDay} setTBDay={setTBDay} numDays={numDays}/></TableCell>
            {guildMemberLevel > 2 && <TableCell><Button variant="contained" onClick={SaveConfig}>Save</Button></TableCell>}
          </TableRow>
        </TableBody>
      </Table>
    {platoonMap?.length > 0 && <ShowPlatoons opts={opts} platoonMap={platoonMap} pDef={platoons} platoonIds={platoonIds} tbId={tb.value} setPlatoonIds={setPlatoonIds} tbDay={tbDay} member={guildMembers}/>}
    </Fragment>
  )
}
