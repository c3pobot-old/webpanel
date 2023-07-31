import React, { Fragment, useState } from 'react'
import { Grid, Table, TableBody, TableRow, TableCell, Typography } from '@mui/material';

import DB from 'components/db'

import EditSquad from './editSquad'
import EditPlatoon from './editPlatoon'
import EditUnit from './editUnit'
const conflictSx = {
  bgcolor: 'white',
  color: 'black'
}
const squadSx = {
  bgcolor: 'gray'
}
const unitFilled = {
  //bgcolor: '#00b3ff'
  bgcolor: '#91d4ff'
}
const unitFilledText = {
  color: 'black',
  fontWeight: 'bolder'
}
const unitNotFilled = {
  bgcolor: '#e90e0e'

}
const unitNotFilledText = {
  color: 'white',
  fontWeight: 'bolder'
}
export default function ShowPlatoons({ opts = {}, platoonMap = [], tbId, pDef = [], platoonIds = [], setPlatoonIds, tbDay, member = []}){
  const { setSpinner } = opts;
  const [ openSquadEdit, setSquadEditOpen ] = useState(false)
  const [ editSquad, setEditSquad ] = useState(null)
  const [ openPlatoonEdit, setPlatoonEditOpen ] = useState(false)
  const [ editPlatoon, setEditPlatoon ] = useState(null)
  const [ openUnitEdit, setUnitEditOpen ] = useState(false)
  const [ editUnit, setEditUnit ] = useState(null)
  function updateSquad(data = {}){
    if(data?.platoonId && data.squad.num){
      setEditSquad(data)
      setSquadEditOpen(true)
    }
  }
  function updatePlatoon(platoon = {}){
    if(platoon.id){
      setEditPlatoon(platoon)
      setPlatoonEditOpen(true)
    }
  }
  function updateUnit(data = {}){
    if(data.platoonId){
      setEditUnit(data)
      setUnitEditOpen(true)
    }
  }
  async function updatePlatoonDb(key, data = []){
    let tempObj = await DB.get(key)
    if(tempObj?.data){
      tempObj.data = data
      await DB.set(key, tempObj)
    }
  }
  async function changeSquad(opt = null, platoonId, num){
    setSpinner(true)
    setSquadEditOpen(false)
    setEditSquad(false)
    let tempPlatoonIds = JSON.parse(JSON.stringify(platoonIds))
    let platoonIndex = tempPlatoonIds?.findIndex(x=>x.id === platoonId)
    if(platoonIndex >= 0){
      if(!tempPlatoonIds[platoonIndex].squads) tempPlatoonIds[platoonIndex].squads = []
      let squad = { num: num, unitConfig: [] }
      let squadIndex = tempPlatoonIds[platoonIndex].squads?.findIndex(x=>x?.num === num)
      if(squadIndex >= 0) squad = tempPlatoonIds[platoonIndex].squads[squadIndex]
      if(!squad?.unitConfig) squad.unitConfig = []
      if(!opt){
        squad.exclude = false
        squad.prefilled = false
      }else{
        if(opt === 'exclude'){
          squad.exclude = true
          squad.prefilled = false
        }
        if(opt === 'prefilled'){
          squad.exclude = false
          squad.prefilled = true
        }
      }

      if(squadIndex >= 0){
        tempPlatoonIds[platoonIndex].squads[squadIndex] = squad
      }else{
        tempPlatoonIds[platoonIndex].squads.push(squad)
      }
      await updatePlatoonDb('tbPlatoonIds-'+tbDay+'-'+tbId, tempPlatoonIds)
      setPlatoonIds(tempPlatoonIds)
    }
    setSpinner(false)
  }
  async function changePlatoon(opt = null, oldId, newId){
    setSpinner(true)
    setPlatoonEditOpen(false)
    setEditPlatoon(false)
    let tempPlatoonIds = JSON.parse(JSON.stringify(platoonIds))
    let index = tempPlatoonIds?.findIndex(x=>x.id === oldId)
    if(index >= 0){
      if(!opt){
        tempPlatoonIds[index].exclude = false
        tempPlatoonIds[index].prefilled = false
      }else{
        if(opt === 'exclude'){
          tempPlatoonIds[index].exclude = true
          tempPlatoonIds[index].prefilled = false
        }
        if(opt === 'prefilled'){
          tempPlatoonIds[index].exclude = false
          tempPlatoonIds[index].prefilled = true
        }
      }
      if(newId){
        tempPlatoonIds[index].id = newId
        tempPlatoonIds[index].squads = []
      }
      await updatePlatoonDb('tbPlatoonIds-'+tbDay+'-'+tbId, tempPlatoonIds)
      setPlatoonIds(tempPlatoonIds)
    }
    setSpinner(false)
  }
  async function changeUnit(prefilled = false, data = {}){
    setSpinner(true)
    setUnitEditOpen(false)
    setEditUnit(null)
    let tempPlatoonIds = JSON.parse(JSON.stringify(platoonIds))
    const pIndex = tempPlatoonIds?.findIndex(x=>x.id === data.platoonId)
    if(pIndex >= 0){
      if(!tempPlatoonIds[pIndex].squads) tempPlatoonIds[pIndex].squads = []
      let squad = {num: data.squadNum, unitConfig: []}, unit = { baseId: data.baseId, prefilled: 0, players: [] }
      const sIndex = tempPlatoonIds[pIndex]?.squads?.findIndex(x=>x.num === data.squadNum)
      if(sIndex >= 0) squad = tempPlatoonIds[pIndex].squads[sIndex]
      if(!squad?.unitConfig) squad.unitConfig = []
      const uIndex = squad?.unitConfig?.findIndex(x=>x.baseId === data.baseId)
      if(uIndex >= 0) unit = squad.unitConfig[uIndex]
      if(prefilled){
        unit.prefilled++
      }else{
        unit.prefilled--
        if(unit.prefilled < 0) unit.prefilled = 0
      }
      if(uIndex >= 0){
        squad.unitConfig[uIndex] = unit
      }else{
        squad.unitConfig.push(unit)
      }
      if(sIndex >= 0){
        tempPlatoonIds[pIndex].squads[sIndex] = squad
      }else{
        tempPlatoonIds[pIndex].squads.push(squad)
      }
      await updatePlatoonDb('tbPlatoonIds-'+tbDay+'-'+tbId, tempPlatoonIds)
      setPlatoonIds(tempPlatoonIds)
    }
    setSpinner(false)
  }
  if(platoonMap?.length === 0) return null
  return (
    <Table>
    <TableBody>
    {openSquadEdit && <EditSquad open={openSquadEdit} setOpen={setSquadEditOpen} data={editSquad} changeSquad={changeSquad}/>}
    {openPlatoonEdit && <EditPlatoon open={openPlatoonEdit} setOpen={setPlatoonEditOpen} platoon={editPlatoon} pDef={pDef} changePlatoon={changePlatoon}/>}
    {openUnitEdit && <EditUnit open={openUnitEdit} setOpen={setUnitEditOpen} data={editUnit} changeUnit={changeUnit} member={member}/>}
    {platoonMap.map((platoon, pIndex)=>(
      <Fragment key={pIndex}>
      <TableRow><TableCell sx={conflictSx} onClick={()=>updatePlatoon(platoon)}><Typography>{platoon.id+' '+platoon.type+' '+platoon.nameKey+' ('+platoon.points?.toLocaleString()+'/'+platoon.totalPoints?.toLocaleString()+')'+(platoon.exclude ? ' Excluded':(platoon.prefilled ? ' Prefilled':''))}</Typography></TableCell></TableRow>
      {platoon.squads.map((squad, sIndex)=>(
        <Fragment key={sIndex}>
          <TableRow><TableCell sx={squadSx} onClick={()=>updateSquad({platoonId: platoon.id, squad: squad})}>
            <Typography>{platoon.type+' '+platoon.nameKey+' Squad '+squad.num+(platoon?.rarity ? ' '+platoon.rarity+'*':'')+(platoon?.relicTier > 3 ? ' R'+(platoon.relicTier - 2):'')+' ('+squad.points?.toLocaleString()+') '+(squad.exclude ? ' Excluded':(squad.prefilled ? ' Prefilled':''))}</Typography>
          </TableCell></TableRow>
          {squad?.units?.length > 0 &&
            <TableRow><TableCell>
            <Grid container spacing={1}>
              {squad.units.map((unit, uIndex)=>(
                <Grid item xs={12} md={4} key={uIndex} onClick={()=>updateUnit({platoonId: platoon.id, squad: squad, unit: unit})}>
                  <Table>
                    <TableBody>
                      <TableRow><TableCell sx={unit.player ? unitFilled:unitNotFilled}><Typography sx={unit.player ? unitFilledText:unitNotFilledText}>{unit.nameKey+' - '+(unit.player ? unit.player:'NONE - ('+unit.available+'/'+(unit.count || 0)+')')}</Typography></TableCell></TableRow>
                    </TableBody>
                  </Table>
                </Grid>
              ))}
            </Grid>
            </TableCell></TableRow>
          }
        </Fragment>
      ))}
      </Fragment>
    ))}
    </TableBody>
    </Table>
  )
}
/*
<Table key={uIndex}>
  <TableBody>
    <TableRow><TableCell><Typography>{unit.nameKey}</Typography></TableCell></TableRow>
    <TableRow><TableCell sx={unit.player ? unitFilled:unitNotFilled}><Typography>{unit.player ? unit.player:'NONE'}</Typography></TableCell></TableRow>
  </TableBody>
</Table>
*/
