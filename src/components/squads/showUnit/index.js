import React, { Fragment, useState } from 'react'
import { Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@mui/material';

import { SquadsHeader, BottomNav } from 'components/squads'
import { AddStat, DeleteStat, EditStat, DeleteUnit, EditUnit } from './modify'
import AddStatModal from './addStatModal'
import EditStatModal from './editStatModal'
import SaveSquadChanges from 'components/squads/saveSquadChanges'
import UnitModal from 'components/squads/unitModal'
import UnitImage from './unitImage'
import UpdateSquads from 'components/squads/updateSquads'

export default function ShowUnit(opts = {}){
  const { server, setUnit, squad, unit, unitList, webProfile, setWebProfile } = opts;

  const [ addStatOpen, setAddStatOpen ] = useState(false);
  const [ baseOpen, setBaseOpen ] = useState(false);
  const [ editStatOpen, setEditStatOpen ] = useState(false);
  const [ uInfo ] = useState(unitList.find(x=>x.baseId === unit.baseId));
  const [ unitStat, setUnitStat ] = useState(null);

  const menuItems = [
    {
      nameKey: webProfile?.showPortrait? 'Hide Unit Portrait':'Show Unit Portrait',
      newValue: { showPortrait: webProfile?.showPortrait ? false:true}
    }
  ]
  function addStat(data){
    if(data?.nameKey) AddStat(opts, data)
  }
  function deleteStat(data, statIndex){
    if(data) DeleteStat(opts, data)
  }
  function deleteUnit(){
    if(server?.admin) DeleteUnit(opts)
  }
  function editStat(data, statIndex){
    if(data) EditStat(opts, data, statIndex)
  }
  function handleEditStat(stat, statIndex){
    setUnitStat({stat: stat, statIndex: statIndex})
    setEditStatOpen(true)
  }
  function handleLeader( leader ){
    if(server.admin){
      let tempSquad = JSON.parse(JSON.stringify(squad))
      let tempUnit = JSON.parse(JSON.stringify(unit))
      let tempUnits = tempSquad?.units?.map(s=>({...s, leader: false}))
      tempUnit.leader = leader
      if(tempUnit.leader){
        tempUnits = tempUnits.filter(x=>x.id !== tempUnit.id)
        tempUnits.unshift(tempUnit)
      }
      tempSquad.units = tempUnits
      tempSquad.change = {type: 'order'}
      UpdateSquads(opts, tempSquad)
      setUnit(tempUnit)
    }
  }
  function saveEdit(data){
    if(data) EditUnit(opts, data)
  }
  function saveSquadChanges(){
    if(server?.admin) SaveSquadChanges(opts)
  }
  return (
    <TableContainer>
      <SquadsHeader opts={opts} menuItems={menuItems} menuOnSubmit={setWebProfile}/>
      {server.admin && <UnitModal open={baseOpen} setOpen={setBaseOpen} saveEdit={saveEdit} unit={unit} uInfo={uInfo} />}
      {server.admin && editStatOpen && <EditStatModal open={editStatOpen} setOpen={setEditStatOpen} editStat={editStat} deleteStat={deleteStat} unit={unit} unitStat={unitStat} />}
      {server.admin && addStatOpen && <AddStatModal open={addStatOpen} setOpen={setAddStatOpen} addStat={addStat} unit={unit}/>}
      <Table>
        <TableBody>
          {!webProfile?.showPortrait &&
            <Fragment>
            <TableRow><TableCell onClick={server.admin ? ()=>setBaseOpen(true):null}><Typography>{unit.nameKey}</Typography></TableCell><TableCell rowSpan="2"><Typography><Checkbox checked={unit.leader} onClick={server.admin ? ()=>handleLeader(unit.leader ? false:true):null}/> Leader</Typography></TableCell></TableRow>
            <TableRow><TableCell onClick={server.admin ? ()=>setBaseOpen(true):null}><Typography>Rarity {unit.rarity} {unit.gear ? 'Gear/Relic '+unit.gear.nameKey:''}</Typography></TableCell></TableRow>
            </Fragment>
          }
          {webProfile?.showPortrait && <TableRow><TableCell width="95" onClick={()=>setBaseOpen(true)}><UnitImage unit={unit} uInfo={uInfo} /></TableCell><TableCell><Typography><Checkbox checked={unit.leader} onClick={server.admin ? ()=>handleLeader(unit.leader ? false:true):null}/> Leader</Typography></TableCell></TableRow>}
          <TableRow><TableCell colSpan="2" onClick={server.admin ? ()=>setBaseOpen(true):null}><Typography>{'GP : '+(unit.gp || 0)}</Typography></TableCell></TableRow>
        </TableBody>
      </Table>
      <Table>
        <TableHead><TableRow><TableCell colSpan="3" ><Typography onClick={()=>setAddStatOpen(true)}>Stats</Typography></TableCell></TableRow></TableHead>
        <TableBody>
        <TableRow>
          <TableCell><Typography>Stat</Typography></TableCell>
          <TableCell><Typography>Min</Typography></TableCell>
          <TableCell><Typography>Max</Typography></TableCell>
        </TableRow>
          {unit?.stats?.length > 0 && unit.stats.map((stat, statIndex)=>(
            <TableRow key={stat.id}>
              <TableCell onClick={()=>handleEditStat(stat, statIndex)}><Typography>{stat.nameKey}</Typography></TableCell>
              <TableCell><Typography>{stat.min}</Typography></TableCell>
              <TableCell><Typography>{stat.max}</Typography></TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableBody><TableRow><TableCell sx={{height: '60px', border: 0}}>&nbsp;</TableCell></TableRow></TableBody>
      </Table>
      <BottomNav saveClick={server?.admin ? saveSquadChanges:null} deleteClick={server?.admin ? deleteUnit:null} deleteLabel="Delete Unit" />
    </TableContainer>
  )
}
