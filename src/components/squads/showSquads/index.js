import React, { useEffect, useState } from 'react'
import { Box, Button, Container, Table, TableBody, TableCell, TableContainer, TableRow, Typography} from '@mui/material';

import { SquadsHeader, BottomNav } from 'components/squads'
import { AddSquad, DeleteGroup, UpdateSquadOrder } from './functions'
import AutoTextField from 'components/squads/autoTextField'
import SquadRows from './squadRows'
import SquadList from './squadList'
import NoteModal from 'components/squads/noteModal'
import PlainTextField from 'components/squads/plainTextField'
import SaveSquadChanges from 'components/squads/saveSquadChanges'

export default function ShowSquads(opts = {}){
  const { prefix, refreshSquads, server, setSquad, setWebProfile, squads, squadNameKeys, webProfile } = opts;

  const [ noteSquad, setNoteSquad ] = useState({});
  const [ openNote, setNoteOpen ] = useState(false);
  const [ showSort, setShowSort ] = useState(false);
  const menuItems = [
    {
      nameKey: webProfile?.showSquadUnits ? 'Hide Units':'Show Units',
      newValue: { showSquadUnits: webProfile?.showSquadUnits ? false:true }
    },
    {
      nameKey: webProfile?.showSquadSearch ? 'Hide Search':'Show Search',
      newValue: { showSquadSearch: webProfile?.showSquadSearch ? false:true }
    }
  ]
  useEffect(()=>{
    if(server?.admin){
      if(webProfile?.showSquadUnits){
        setShowSort(false)
      }else{
        setShowSort(true)
      }
    }else{
      setShowSort(false)
    }
  }, [webProfile, server, squads])
  function openNoteModal(squad){
    setNoteSquad(squad)
    setNoteOpen(true)
  }
  function saveSquadChanges(){
    if(server?.admin) SaveSquadChanges(opts)
  }
  function searchSquads(nameKey){
    if(nameKey) setSquad(squads.find(x=>x.nameKey === nameKey.trim()))
  }
  function addSquad(nameKey){
    if(nameKey) AddSquad(opts, nameKey)
  }
  function deleteGroup(){
    if(server?.admin) DeleteGroup(opts)
  }
  function updateSquadOrder(list){
    if(server?.admin) UpdateSquadOrder(opts, list)
  }
  function getSquadName(squad){
    let str = squad?.nameKey
    if(prefix === 'g' && server.admin && server.id === 'global' && squad?.main) str += ' (main)'
    return str
  }
  if(!squads) return (
    <Container>
      <Box>Getting Squads from Server ... </Box>
    </Container>
  )
  return (
    <TableContainer>
    {openNote && <NoteModal opts={opts} open={openNote} setOpen={setNoteOpen} squad={noteSquad} />}
    <SquadsHeader opts={opts} menuItems={menuItems} menuOnSubmit={setWebProfile}/>
    <Table>
      <TableBody>
        {server?.admin && <TableRow><TableCell colSpan="4" style={{padding: 0, margin: 0, border: 0}}><PlainTextField desc="New Squad" server={server} onSubmit={addSquad} defaultValues={{nameKey: ''}}/></TableCell></TableRow>}
        {squadNameKeys?.length > 0 && webProfile?.showSquadSearch && <TableRow><TableCell colSpan="4" style={{padding: 0, margin: 0, border: 0}}><AutoTextField array={squadNameKeys} desc='Search Squads' onSelect={searchSquads} buttonName='Select'/></TableCell></TableRow>}
        <TableRow>
          <TableCell colSpan="4"><Button variant="contained" onClick={()=>refreshSquads(opts, true)}>Refresh Squads</Button></TableCell>
        </TableRow>
        <TableRow>
          <TableCell width='56'>&nbsp;</TableCell>
          <TableCell><Typography>Squad</Typography></TableCell>
          <TableCell align="center"><Typography>Unit Count</Typography></TableCell>
          <TableCell align="center">&nbsp;</TableCell>
        </TableRow>
        {squads?.length === 0 && <TableRow sx={{bgcolor: "rowMain.bg"}}><TableCell colSpan="3" sx={{color: "rowMain.text"}}><Typography>No Squads</Typography></TableCell></TableRow>}
      </TableBody>
      {showSort && squads?.length > 0 && <SquadRows opts={opts} squadList={squads} getSquadName={getSquadName} selectSquad={setSquad} updateSquadOrder={updateSquadOrder} openNoteModal={openNoteModal}/>}
      {!showSort && squads?.length > 0 && <SquadList opts={opts} squads={squads} getSquadName={getSquadName} selectSquad={setSquad} openNoteModal={openNoteModal}/>}
      <TableBody><TableRow><TableCell sx={{height: '60px', border: 0}}>&nbsp;</TableCell></TableRow></TableBody>
    </Table>
    <BottomNav saveClick={server?.admin ? saveSquadChanges:null} deleteClick={server?.admin && prefix === 'g' ? deleteGroup:null} deleteLabel="Delete Group"/>
    </TableContainer>
  )
}
