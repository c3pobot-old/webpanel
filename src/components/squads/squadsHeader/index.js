import React, { useEffect, useState } from 'react';
import { Breadcrumbs, Table, TableCell, TableHead, TableRow, Typography} from '@mui/material';

import ConfirmServerChange from './confirmServerChange'
import MenuButton from './menuButton'
import StepBack from './stepBack'

export default function SquadsHeader ({opts = {}, menuItems = [], menuOnSubmit}){
  const { prefix, group, server, squad, unit } = opts;

  const [ breadcrumbs, setBreadCrumbs ] = useState([]);
  const [ confirmObj, setConfirm ] = useState({ open: false, setOpen: '', msg:'' });

  useEffect(()=>{
    updateBreadCrumbs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[server])

  function stepBack(type){
    if(type) StepBack({...opts,...{ confirmObj: confirmObj, setConfirm: setConfirm }}, type)
  }
  function updateBreadCrumbs(){
    let array = []
    if(server?.id){
      array.push(<Typography variant="h6" onClick={()=>stepBack('server')} key='1'>{prefix === 's' ? 'Squads':'Groups'}</Typography>)
      array.push(<Typography variant="h6" onClick={()=>stepBack('group')} key='2'>{server.name}</Typography>)
      if(group?.nameKey) array.push(<Typography variant="h6"  onClick={()=>stepBack('squad')} key='3'>{group.nameKey}</Typography>)
      if(squad?.nameKey) array.push(<Typography variant="h6" onClick={()=>stepBack('unit')} key='4'>{squad.nameKey}</Typography>)
      if(unit?.nameKey) array.push(<Typography variant="h6" key='5'>{unit.nameKey}</Typography>)
    }else{
      array.push(<Typography variant="h6" key='1'>{prefix === 's' ? 'Squads':'Groups'}</Typography>)
      array.push(<Typography variant="h6" key='2'>Please select a server</Typography>)
    }
    setBreadCrumbs(array)
  }
  return (
    <Table style={{ padding: 0, margin: 0, border: 0 }}>
      <ConfirmServerChange {...{...opts,...{confirmObj: confirmObj}}}/>
      <TableHead>
        <TableRow>
          <MenuButton menuItems={menuItems} onSubmit={menuOnSubmit}/>
          <TableCell><Breadcrumbs separator="›" aria-label="breadcrumb" align="left">{breadcrumbs}</Breadcrumbs></TableCell>
        </TableRow>
      </TableHead>
    </Table>
  )
}
/*

*/
