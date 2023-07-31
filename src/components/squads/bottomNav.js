//React
import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import SaveIcon from '@mui/icons-material/Save';

export default function BottomNav ({saveClick, deleteClick, deleteLabel}){
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={2}>
      <BottomNavigation showLabels>
        {saveClick && <BottomNavigationAction label="Save changes" icon={<SaveIcon />} onClick={saveClick}/>}
        {!saveClick && <BottomNavigationAction label="Disabled" icon={<DisabledByDefaultIcon />}/>}
        {deleteClick && <BottomNavigationAction label={deleteLabel} icon={<DeleteForeverIcon />} onClick={deleteClick}/>}
        {!deleteClick && <BottomNavigationAction label="Disabled" icon={<DisabledByDefaultIcon />}/>}
      </BottomNavigation>
    </Paper>
  )
}
