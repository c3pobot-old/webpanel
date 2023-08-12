import React, { Fragment, useEffect, useState } from 'react'

import { Button, Box, Tab, Tabs, Typography } from '@mui/material';

import useLocalStorage from 'components/useLocalStorage'
import ApiRequest from 'components/apiRequest'
import DB from 'components/db'

import ButtonNav from 'components/buttonNav'
import AllyCodeSelector from './allyCodeSelector'

import TBSelector from './tbSelector'
import Platoons from './platoons'
import Stars from './stars'

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
  const { discordId, setAlert, setSpinner } = opts;
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
    tempGuild.gp = +(tempGuild.profile?.guildGalacticPower || 0)
    tempGuild.gpChar = tempGuild?.member?.reduce((acc, a)=>{
      return acc + +(a?.characterGalacticPower || 0)
    }, 0)
    tempGuild.gpShip = tempGuild?.member?.reduce((acc, a)=>{
      return acc + +(a?.shipGalacticPower || 0)
    }, 0)
    await DB.set('guild-'+guildId, tempGuild)
    await DB.set('guildMember-'+guildId, guildMembers)
    setGuild(tempGuild)
  }
  async function getGuildId(){
    let tempId = localStorage.getItem('guildId-'+allyCode)
    if(!tempId){
      setSpinner(true)
      let apiData = await ApiRequest({method: 'getGuildId', dId: discordId, data: {allyCode: allyCode}})

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
    let apiData = await ApiRequest({method: 'client', dId: discordId, data: {query: 'guild', payload: { guildId: guildId, includeRecentGuildActivityInfo: true } }})
    if(apiData?.guild){
      apiData.guild.id = apiData.guild.profile.id
      apiData.guild.name = apiData.guild.profile.name
      apiData.guild.updated = Date.now()
      await setGuild(apiData?.guild)
      fetchGuildMembers(apiData?.guild?.member)
    }
  }
  async function fetchGuildMember(playerId){
    let player = await ApiRequest({method: 'client', dId: discordId, data: { query: 'player', payload: {playerId: playerId }}})
    if(player?.allyCode) setGuildMembers(oldArray=>[...oldArray, player])
  }
  function fetchGuildMembers(member){
    for(let i in member) fetchGuildMember(member[i].playerId)
  }
  async function getGuild(force = false){
    setSpinner(true)
    setGuild(null)
    let tempGuild, tempGuildMembers
    if(!force){
      tempGuild = await DB.get('guild-'+guildId)
      tempGuildMembers = await DB.get('guildMember-'+guildId,)
    }
    if(!tempGuild?.profile?.name || !tempGuildMembers) await fetchGuild()
    if(!guildMemberLevel){
      let member = await ApiRequest({method: 'getGuildMemberLevel', dId: discordId, data: {allyCode: allyCode}})
      if(member?.level) setGuildMemberLevel(member.level)
    }
    if(tempGuild?.profile?.name && tempGuildMembers){
      setGuild(tempGuild)
      setGuildMembers(tempGuildMembers)
    }
    setSpinner(false)
  }
  function refreshGuild(){
    let timeDiff = Date.now() - guild.updated
    if(timeDiff > 600000){
      getGuild(true)
    }else{
      setAlert({type: 'error', msg: 'There is a 20 minute cooldown between refreshs'})
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
      <Button variant="contained" sx={{display: 'inline'}} onClick={refreshGuild}>{'Guild Data as of '+(new Date(guild?.updated))+' Click to refresh'}</Button>
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
        <Platoons opts={opts} tb={tb} guild={guild} guildMembers={guildMembers} allyCode={allyCode} guildMemberLevel={guildMemberLevel}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Stars opts={opts} tb={tb} guild={guild} guildMembers={guildMembers} allyCode={allyCode} guildMemberLevel={guildMemberLevel}/>
      </TabPanel>
    </Box>
    </Fragment>
  )
}
