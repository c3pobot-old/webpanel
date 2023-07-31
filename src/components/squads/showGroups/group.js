import React, { Fragment } from 'react'
import { TableCell, TableRow, Typography} from '@mui/material';

export default function Group({opts = {}, group = {} }){
  const { setGroup, setSquad, webProfile } = opts
  return (
    <Fragment>
      <TableRow sx={{bgcolor: "rowMain.bg"}}><TableCell onClick={()=>setGroup(group)}><Typography>{group.nameKey}</Typography></TableCell><TableCell><Typography>{group?.squads?.length || 0}</Typography></TableCell></TableRow>
      {webProfile?.showGroupSquads && group?.squads?.length > 0 && group.squads.map((squad, squadIndex)=>(
        <TableRow key={squadIndex}><TableCell onClick={()=>setSquad(squad, group)}><Typography>{squad.nameKey}</Typography></TableCell><TableCell><Typography>{squad.units?.length}</Typography></TableCell></TableRow>
      ))}
    </Fragment>
  )
}
