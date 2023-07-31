import React, { Fragment, useEffect, useState } from 'react';
import { Checkbox, Button, Table, TableBody, TableContainer, TableCell, TableRow, Typography } from '@mui/material';

import { SquadsHeader, BottomNav } from 'components/squads'
import { AddUnit, DeleteSquad, SetMainSquad } from './functions'
import AutoTextField from 'components/squads/autoTextField'

import NoteModal from 'components/squads/noteModal'
import UnitRows from 'components/squads/unitRows'
import UnitModal from 'components/squads/unitModal'
import SaveSquadChanges from 'components/squads/saveSquadChanges'


export default function ShowSquad(opts = {}){
  const { refreshUnits, server, squad, setUnit, setWebProfile, unitNameKeys, webProfile, prefix } = opts;

  const [ baseOpen, setBaseOpen ] = useState(false)
  const [ noteOpen, setNoteOpen ] = useState(false)
  const [ showAdmin, setShowAdmin] = useState(false)

  useEffect(()=>{
    if(server?.id === 'global' && server?.admin === true){
      setShowAdmin(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [server])
  const menuItems = [
    {
      nameKey: webProfile?.showUnit ? 'Do not show Unit on add':'Show Unit on add',
      newValue: 'showUnit'
    },
    {
      nameKey: 'Add Squad note/link',
      newValue: 'showNote'
    }
  ]

  function addUnit(nameKey){
    if(nameKey) AddUnit(opts, nameKey)
  }
  function deleteSquad(){
    if(server?.admin) DeleteSquad(opts)
  }
  function editBase(obj){
    if(obj) setWebProfile({unitDefault: obj})
  }
  function handleMenuSubmit(value){
    if(value === 'showUnit') setWebProfile({ showUnit: webProfile?.showUnit ? false:true})
    if(value === 'showNote') setNoteOpen(true)
  }
  function saveSquadChanges(){
    if(server?.admin) SaveSquadChanges(opts)
  }
  function setMainSquad(){
    SetMainSquad(opts)
  }
  if(!unitNameKeys || unitNameKeys?.length === 0) return null
  return(
    <TableContainer>
    <SquadsHeader opts={opts} menuItems={menuItems} menuOnSubmit={handleMenuSubmit}/>
    {baseOpen && <UnitModal open={baseOpen} setOpen={setBaseOpen} saveEdit={editBase} unit={{gear: webProfile?.unitDefault?.gear, rarity: webProfile?.unitDefault?.rarity, gp: webProfile?.unitDefault?.gp, nameKey: "New Unit Defaults"}} uInfo={{combatType: 1}}/>}
    {noteOpen && <NoteModal opts={opts} open={noteOpen} setOpen={setNoteOpen} squad={squad} />}
    <Table>
      <TableBody>
      {server?.admin &&
        <Fragment>
        <TableRow>
          <TableCell style={{padding: 0, margin: 0, border: 0}} colSpan="3"><AutoTextField array={unitNameKeys} desc='New Unit' onSubmit={addUnit}/></TableCell>
          <TableCell><Typography onClick={()=>setBaseOpen(true)}>{webProfile?.unitDefault ? webProfile.unitDefault.rarity+'* / '+webProfile.unitDefault.gear.nameKey+' / GP:'+(webProfile.unitDefault.gp || 0):'1* / G1 / GP:0'}</Typography></TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan="4"><Button variant="contained" onClick={()=>refreshUnits(opts, true)}>Refresh Units</Button></TableCell>
        </TableRow>
        {prefix === 'g' && server.id === 'global' &&
          <TableRow>
            <TableCell><Checkbox checked={squad.main} onClick={setMainSquad}/></TableCell>
            <TableCell colSpan="4"><Typography>Main Squad</Typography></TableCell>
          </TableRow>
        }
        </Fragment>
      }
      </TableBody>
      <UnitRows opts={opts} squad={squad} selectUnit={setUnit} showAdmin={showAdmin} col={2} />
    </Table>

    <Table><TableBody><TableRow><TableCell sx={{height: '60px', border: 0}}>&nbsp;</TableCell></TableRow></TableBody></Table>
    <BottomNav saveClick={server?.admin ? saveSquadChanges:null} deleteClick={server?.admin ? deleteSquad:null} deleteLabel="Delete Squad" />
    </TableContainer>
  )
}
