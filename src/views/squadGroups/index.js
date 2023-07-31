//react
import React, { Fragment, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ShowGroups, ShowServers, ShowSquads, ShowSquad, ShowUnit } from 'components/squads'
import ButtonNav from 'components/buttonNav'
import DB from 'components/db'
import RefreshGroups from 'components/squads/refreshSquads'
import RefreshUnits from 'components/squads/refreshUnits'

import useLocalStorage from 'components/useLocalStorage'

export default function Squads (opts = {}) {

  const { discordId, setAlert } = opts;

  const [ changes, setChanges ] = useLocalStorage('g-changes', false)
  const [ group, setGroup ] = useState(null)
  const [ groupName, setGroupName ] = useLocalStorage('g-group')
  const [ server, setServer ] = useLocalStorage('g-server')
  const [ squad, setSquad ] = useState(null)
  const [ squadList, setSquadList ] = useState()
  const [ squadName, setSquadName ] = useLocalStorage('g-squad')
  const [ squadServer ] = useLocalStorage('s-server')
  const [ unit, setUnit ] = useLocalStorage('g-unit')
  const [ unitList, setUnitList ] = useState([])

  useEffect(()=>{
    if(discordId && unitList?.length === 0) RefreshUnits({...opts, setUnitList: setUnitList})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(()=>{
    if(server?.id) RefreshGroups({...opts, setSquadList: setSquadList, server: server})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [server])
  useEffect(()=>{
    if(squadName && !squad && group?.squads?.length > 0){
      setSquad(group.squads?.find(x=>x.nameKey === squadName && x.units && !x.deleteMe))
      console.log(squad)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [squadName, group])
  useEffect(()=>{
    if(groupName && !group && squadList?.length > 0){
      setGroup(squadList?.find(x=>x.nameKey === groupName && x.squads && !x.deleteMe))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupName, squadList])

  if(!discordId){
    localStorage.setItem('startUrl', window.location.href)
    ButtonNav('/discord/login')
  }
  function refreshGroups(){
    if(!changes){
      RefreshGroups({...opts, setSquadList: setSquadList, server: server}, true)
    }else{
      setAlert({type: 'error', msg: 'There are unsaved changes pending'})
    }
  }
  async function refreshSquads(){
    if(!changes){
      await RefreshGroups({...opts, setSquadList: setSquadList, server: server}, true)
      if(groupName) selectGroup(squadList.find(x=>x.nameKey === groupName))
    }else{
      setAlert({type: 'error', msg: 'There are unsaved changes pending'})
    }
  }
  async function selectServer(obj){
    if(obj?.id && squadServer?.id === obj?.id){
      setAlert({type: 'error', msg: 'You can not work on the same server in Squads and groups'})
    }else{
      if(server?.id && !obj){
        DB.set(server?.id, null)
        setSquadList(null)
      }
      setServer(obj)
    }
  }
  function selectGroup(group){
    setGroup(group)
    setGroupName(group?.nameKey || null)
  }
  function selectSquad(tempSquad, group){
    if(tempSquad?.units?.filter(x=>!x.id).length > 0){
      for(let i in tempSquad.units){
        if(!tempSquad.units[i].id) tempSquad.units[i].id = uuidv4()
      }
    }
    setSquad(tempSquad)
    setSquadName(tempSquad?.nameKey || null)
    if(group) selectGroup(group)
  }
  function getStateVariable(stateVar){
    if(stateVar){
      return JSON.parse(JSON.stringify(stateVar))
    }
  }

  const squadOpts = {
    changes: changes,
    group: getStateVariable(group),
    groups: getStateVariable(squadList?.filter(x=>x.squads && !x.deleteMe)),
    groupNameKeys: squadList?.filter(x=>x.squads && !x.deleteMe)?.map(x=>x.nameKey),
    prefix: 'g',
    refreshGroups: refreshGroups,
    refreshSquads: refreshSquads,
    refreshUnits: RefreshUnits,
    server: server,
    setChanges: setChanges,
    setGroup: selectGroup,
    setServer: selectServer,
    setSquad: selectSquad,
    setSquadList: setSquadList,
    setUnit: setUnit,
    squad: getStateVariable(squad),
    squads: getStateVariable(group?.squads),
    squadList: getStateVariable(squadList),
    squadNameKeys: group?.squads?.map(x=>x.nameKey),
    unit: unit,
    unitList: unitList,
    unitNameKeys: unitList?.map(x=>x.nameKey)
  }

  if(!unitList || unitList?.length === 0) return null

  if(!server){
    return (
      <Fragment>
        <ShowServers {...{...opts,...squadOpts}}/>
      </Fragment>
    )
  }
  if(unit) return(
    <Fragment>
      <ShowUnit {...{...opts,...squadOpts}}/>
    </Fragment>
  )
  if(squad) return(
    <Fragment>
      <ShowSquad {...{...opts,...squadOpts}}/>
    </Fragment>
  )
  if(group) return (
    <Fragment>
      <ShowSquads {...{...opts,...squadOpts}}/>
    </Fragment>
  )
  return (
    <Fragment>
      <ShowGroups {...{...opts,...squadOpts}}/>
    </Fragment>
  )
}
