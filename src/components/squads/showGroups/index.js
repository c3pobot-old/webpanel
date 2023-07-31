import React, { useState } from 'react';
import { Box, Button, Container, Table, TableBody, TableCell, TableContainer, TableRow, Typography} from '@mui/material';

import { SquadsHeader, BottomNav } from 'components/squads'
import AddNewGroup from './addNewGroup'
import AutoTextField from 'components/squads/autoTextField'
import ListGroups from './listGroups'
import PlainTextField from 'components/squads/plainTextField'
import SaveSquadChanges from 'components/squads/saveSquadChanges'

export default function ShowGroups(opts = {}){
  const { groupNameKeys, groups, refreshGroups, server, setGroup, setWebProfile, webProfile } = opts;

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('nameKey');

  const menuItems = [
    {
      nameKey: webProfile?.showGroupSquads ? 'Hide Squads':'Show Squads',
      newValue: { showGroupSquads: webProfile?.showGroupSquads ? false:true }
    },
    {
      nameKey: webProfile?.showGroupSearch ? 'Hide Search':'Show Search',
      newValue: { showGroupSearch: webProfile?.showGroupSearch ? false:true }
    }
  ]

  function addNewGroup (nameKey){
    if(server?.admin) AddNewGroup(opts, nameKey)
  }
  function handleRequestSort (property) {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  function saveSquadChanges(){
    if(server?.admin) SaveSquadChanges(opts)
  }
  function groupSearch(nameKey){
    if(nameKey) setGroup(groups.find(x=>x.nameKey === nameKey.trim()))
  }

  if(!groups) return (
    <Container>
      <Box>Getting Squad Groups from Server ... </Box>
    </Container>
  )
  return(
    <TableContainer style={{overflowX: 'initial'}}>
      <SquadsHeader opts={opts} menuItems={menuItems} menuOnSubmit={setWebProfile}/>
      <Table>
        <TableBody>
          {server?.admin && <TableRow><TableCell colSpan="2" style={{padding: 0, margin: 0, border: 0}}><PlainTextField server={server} desc="New Group" onSubmit={addNewGroup} defaultValues={{nameKey: ''}}/></TableCell></TableRow>}
          {groupNameKeys?.length > 0 && webProfile?.showGroupSearch && <TableRow><TableCell colSpan="3" style={{padding: 0, margin: 0, border: 0}}><AutoTextField array={groupNameKeys} desc='Search Groups' onSelect={groupSearch} buttonName='Select'/></TableCell></TableRow>}
          <TableRow><TableCell colSpan="3"><Button variant="contained" onClick={()=>refreshGroups(opts, true)}>Refresh Groups</Button></TableCell></TableRow>
          <TableRow><TableCell onClick={()=>handleRequestSort("nameKey")}><Typography>Group</Typography></TableCell><TableCell><Typography>Squad Count</Typography></TableCell>
        </TableRow>
          {groups?.length === 0 && <TableRow sx={{bgcolor: "rowMain.bg"}}><TableCell colSpan="2" sx={{color: "rowMain.text"}}><Typography>No Squad Groups</Typography></TableCell></TableRow>}
          {groups?.length > 0 && <ListGroups {...{...opts, order: order, orderBy: orderBy}}/>}
        </TableBody>
        <TableBody><TableRow><TableCell sx={{height: '60px', border: 0}}>&nbsp;</TableCell></TableRow></TableBody>
      </Table>
      <BottomNav saveClick={server?.admin ? saveSquadChanges:null} deleteClick={null} deleteLabel="Delete Group"/>
    </TableContainer>
  )
}
