import React, {Fragment} from 'react';
import { Dialog, DialogTitle, List, ListItem , ListItemText } from '@mui/material';

import saveSquadChanges from 'components/squads/saveSquadChanges'
export default function ConfirmServerChange (opts = {}) {
  const { confirmObj, setUnit, setSquad, setGroup, setSquadList, setChanges, setServer } = opts
  const { open, setConfirm, msg } = confirmObj
  async function onClose(value){
    if(value === 'cancel'){
      setConfirm({open: false, msg: '', setConfirm: ''})
      return;
    }
    if(value === 'save') await saveSquadChanges(opts)
    if(setGroup) setGroup(null)
    setSquad(null)
    setUnit(null)
    setSquadList(null)
    setServer(null)
    setChanges(false)
    setConfirm({open: false, msg: '', setConfirm: ''})
  }
  if(!open) return null
  return (
    <Dialog onClose={()=>onClose('cancel')} open={open}>
    {msg &&
      <Fragment>
      <DialogTitle>{msg}</DialogTitle>
      <List>
        <ListItem button onClick={() => onClose('save') }>
          <ListItemText>Save Changes</ListItemText>
        </ListItem>
        <ListItem button onClick={() => onClose('ignore')}>
          <ListItemText>Ignore Changes</ListItemText>
        </ListItem>
        <ListItem button onClick={() => onClose('cancel')}>
          <ListItemText>Cancel Server Change</ListItemText>
        </ListItem>
      </List>
      </Fragment>
    }
    </Dialog>
  )
}
