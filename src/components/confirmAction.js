import React, {Fragment} from 'react';
import { Dialog, DialogTitle, List, ListItem , ListItemText } from '@mui/material';

export default function SimpleDialog (props) {

  const { onClose, open } = props;

  return (
    <Dialog onClose={()=>onClose()} open={open}>
    {props.msg &&
      <Fragment>
      <DialogTitle>{props.msg}</DialogTitle>
      <List>
        <ListItem button onClick={() => onClose(true) }>
          <ListItemText>Yes</ListItemText>
        </ListItem>
        <ListItem button onClick={() => onClose(false)}>
          <ListItemText>No</ListItemText>
        </ListItem>
      </List>
      </Fragment>
    }
    </Dialog>
  )
}
