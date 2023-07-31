import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import ArrayToText from './arrayToText'

export default function ShowPopUp (props) {
  const { open } = props;
  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">
        {props.title}
        <IconButton onClick={()=>props.onClose(false)} sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
        ><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent><ArrayToText message={props.msg}/></DialogContent>
    </Dialog>
  )
}
