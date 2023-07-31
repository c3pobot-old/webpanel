//react
import React, { Fragment, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';


import { ShowServers, ShowSquads, ShowSquad, ShowUnit } from 'components/squads'
import ButtonNav from 'components/buttonNav'
import DB from 'components/db'
import RefreshSquads from 'components/squads/refreshSquads'
import RefreshUnits from 'components/squads/refreshUnits'

import useLocalStorage from 'components/useLocalStorage'

export default function Squads (opts = {}) {
  const { discordId, setAlert } = opts;

  const [ changes, setChanges ] = useLocalStorage('s-changes', false)
  const [ groupServer ] = useLocalStorage('g-server')
  const [ server, setServer ] = useLocalStorage('s-server')
  const [ squad, setSquad ] = useState(null)
  const [ squadList, setSquadList ] = useState(null)
  const [ squadName, setSquadName ] = useLocalStorage('s-squad')
  const [ unit, setUnit ] = useLocalStorage('s-unit')
  const [ unitList, setUnitList ] = useState([])

  if(!discordId){
    localStorage.setItem('startUrl', window.location.href)
    ButtonNav('/discord/login')
  }
  useEffect(()=>{
    if(discordId && unitList?.length === 0) RefreshUnits({...opts, setUnitList: setUnitList})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(()=>{
    if(server?.id && !squadList) RefreshSquads({...opts, setSquadList: setSquadList, server: server})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [server, squadList])
  useEffect(()=>{
    if(squadName && !squad && squadList?.length > 0){
      setSquad(squadList?.find(x=>x.nameKey === squadName && x.units && !x.deleteMe))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [squadName, squadList])
  function refreshSquads(){
    if(!changes){
      RefreshSquads({...opts, setSquadList: setSquadList, server: server}, true)
    }else{
      setAlert({type: 'error', msg: 'There are unsaved changes pending'})
    }
  }
  function selectServer(obj){
    if(obj?.id && groupServer?.id === obj?.id){
      setAlert({type: 'error', msg: 'You can not work on the same server in Squads and groups'})
    }else{
      if(server?.id && !obj){
        DB.set(server?.id, null)
        setSquadList(null)
      }
      setServer(obj)
    }
  }
  function selectSquad(tempSquad){
    if(tempSquad?.units?.filter(x=>!x.id).length > 0){
      for(let i in tempSquad.units){
        if(!tempSquad.units[i].id) tempSquad.units[i].id = uuidv4()
      }
    }
    setSquad(tempSquad)
    setSquadName(tempSquad?.nameKey || null)
  }
  const squadOpts = {
    changes: changes,
    prefix: 's',
    refreshSquads: refreshSquads,
    refreshUnits: RefreshUnits,
    server: server,
    setChanges: setChanges,
    setServer: selectServer,
    setSquad: selectSquad,
    setSquadList: setSquadList,
    setUnit: setUnit,
    squad: squad,
    squadList: squadList,
    squadNameKeys: squadList?.filter(x=>x.units && !x.deleteMe)?.map(x=>x.nameKey),
    squads: squadList?.filter(x=>x.units && !x.deleteMe),
    unit: unit,
    unitList: unitList,
    setUnitList: setUnitList,
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
  return (
    <Fragment>
      <ShowSquads {...{...opts,...squadOpts}}/>
    </Fragment>
  )
}
