import React from 'react';
import { Typography} from '@mui/material';
import { Dialog, DialogTitle, List, ListItem , ListItemText } from '@mui/material';

export default function ShowMenu ({opt}) {

  const { onClose, open } = opt;
  const handleListItemClick = (value) => {
    onClose(value);
  };
  return (
    <Dialog onClose={()=>onClose()} open={open}>
      <DialogTitle><Typography>{opt.title}</Typography></DialogTitle>
      <List>
        {opt.array.map(({name, value}, index)=>(
          <ListItem button onClick={()=>handleListItemClick(value)} key={index}>
            <ListItemText><Typography>{name}</Typography></ListItemText>
          </ListItem>
        ))}
      </List>
    </Dialog>
  )
}
