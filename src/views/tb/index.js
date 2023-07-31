import React, { Fragment, useEffect, useState } from 'react'
import io from "socket.io-client";
import { Button, Box, Tab, Tabs, Typography } from '@mui/material';

import useLocalStorage from 'components/useLocalStorage'
import ApiRequest from 'components/apiRequest'
import DB from 'components/db'

import ButtonNav from 'components/buttonNav'
import AllyCodeSelector from './allyCodeSelector'

import TBSelector from './tbSelector'
import Platoons from './platoons'
import Stars from './stars'

const socket = io( {transports: ['websocket']})

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (<Box sx={{ p: 0 }}>{children}</Box>)}
    </div>
  );
}

function tabProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function TB(opts = {}){
  const { discordId, setSpinner } = opts;
  const [ tb, setTB ] = useLocalStorage('tb-selection', null);
  const [ value, setValue ] = useLocalStorage('tb-home', 0);
  const [ allyCode, setAllyCode ] = useLocalStorage('tb-allyCode')
  const [ guildMemberLevel, setGuildMemberLevel ] = useLocalStorage('tb-memberLevel')
  const [ guildId, setGuildId ] = useState()
  const [ guild, setGuild ] = useState()
  const [ guildMembers, setGuildMembers ] = useState([])
  if(!discordId){
    localStorage.setItem('startUrl', window.location.href)
    ButtonNav('/discord/login')
  }
  useEffect(()=>{
    socket.on('guildMember', (data={})=>{
      setGuildMembers(oldArray=>[...oldArray, data])
    })
    socket.on('guild', async(data={})=>{
      await setGuild(data)
      fetchGuildMembers(data.id)
    })
    return()=>{
      socket.off('guildMember')
      socket.off('guild')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(()=>{
    if(allyCode) getGuildId()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[allyCode])
  useEffect(()=>{
    if(guildId) getGuild()
  }, [guildId])
  useEffect(()=>{
    if(guildMembers?.length > 0 && guildMembers?.length === guild?.member?.length) updateGuild()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guildMembers])
  function changeGuild(){
    setGuildMemberLevel(null)
    setGuildId(null)
    setGuild(null)
    setAllyCode(null)
  }
  async function updateGuild(){
    let tempGuild = JSON.parse(JSON.stringify(guild))
    tempGuild.member = guildMembers
    tempGuild.gp = await guildMembers?.reduce((acc, a)=>{
      return acc + +(a?.gp || 0)
    }, 0)
    tempGuild.gpChar = await guildMembers?.reduce((acc, a)=>{
      return acc + +(a?.gpChar || 0)
    }, 0)
    tempGuild.gpShip = await guildMembers?.reduce((acc, a)=>{
      return acc + +(a?.gpShip || 0)
    }, 0)
    await DB.set('guild-'+guildId, tempGuild)
    setGuild(tempGuild)
  }
  async function getGuildId(){
    let tempId = localStorage.getItem('guildId-'+allyCode)
    if(!tempId){
      setSpinner(true)
      const apiData = await ApiRequest({method: 'getGuildId', dId: discordId, data: {allyCode: allyCode}})
      if(apiData?.guildId) tempId = apiData.guildId
      setSpinner(false)
    }
    if(tempId){
      localStorage.setItem('guildId-'+allyCode, tempId)
      setGuildId(tempId)
      setGuildMemberLevel(null)
    }
  }
  async function fetchGuild(){
    await setGuildMembers([])
    socket.emit('cmd', 'getGuild', { discordId: discordId, guildId: guildId })
  }
  async function fetchGuildMembers(guildId){
    socket.emit('cmd', 'getGuildMembers', {discordId: discordId, guildId: guildId, projection: {name: 1, playerId: 1, gp: 1, gpChar: 1, gpShip: 1, zetaCount: 1, sixModCount: 1, omiCount: 1, guildName: 1, rosterUnit: {sort: 1, definitionId: 1, currentLevel: 1, currentRarity: 1, currentTier: 1, relic: 1, gp: 1, combatType: 1}}})
  }
  async function getGuild(force = false){
    setSpinner(true)
    setGuild(null)
    let tempObj
    if(!force) tempObj = await DB.get('guild-'+guildId)
    if(!tempObj?.name) fetchGuild()
    if(!guildMemberLevel){
      const member = await ApiRequest({method: 'client', dId: discordId, data: {query: 'getGuildMemberLevel', payload: {allyCode: allyCode}}})
      if(member?.level) setGuildMemberLevel(member.level)
    }
    setSpinner(false)
    if(tempObj?.name){
      setGuildMembers(tempObj.member)
      setGuild(tempObj)
    }
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  if(!allyCode) return(
    <AllyCodeSelector opts={opts} allyCode={allyCode} setAllyCode={setAllyCode}/>
  )
  if(!guild) return (
    <Typography>{'Getting guild data from the server... '}</Typography>
  )
  if(guildMembers?.length >= 0 && guildMembers.length !== guild?.member?.length) return (
    <Typography>{'Getting guild members from server...'+guildMembers?.length+'/'+guild?.member?.length}</Typography>
  )
  if(!tb) return (
    <TBSelector opts={opts} setTB={setTB}/>
  )
  return (
    <Fragment>
    <Box>&nbsp;</Box>
    <Box sx={{textAlign: 'center'}}>
      <Button variant="contained" sx={{display: 'inline'}} onClick={()=>getGuild(true)}>{'Guild Data as of '+(new Date(guild?.updated))+' Click to refresh'}</Button>
    </Box>
    <Box>&nbsp;</Box>
    <Box sx={{textAlign: 'center'}}>
      <Button variant="contained" sx={{display: 'inline'}} onClick={changeGuild}>{guild?.name}</Button>
      <Typography sx={{display: 'inline'}} >{'>'}</Typography>
      <Button variant="contained" sx={{display: 'inline'}} onClick={()=>setTB(null)}>{tb.name}</Button>
    </Box>
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Platoons" {...tabProps(0)} />
          <Tab label="Stars" {...tabProps(1)} />

        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Platoons opts={opts} tb={tb} guild={guild} allyCode={allyCode} guildMemberLevel={guildMemberLevel}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Stars opts={opts} tb={tb} guild={guild} allyCode={allyCode} guildMemberLevel={guildMemberLevel}/>
      </TabPanel>
    </Box>
    </Fragment>
  )
}
