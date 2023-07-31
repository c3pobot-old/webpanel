import React, { forwardRef, useEffect, useState } from 'react';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ShowAlert ({ alert }){
  const [ open, setOpen ] = useState(false);

  useEffect(()=>{
    if(alert.msg && alert.type) setOpen(true)
  }, [alert] )

  return (
    <Snackbar open={open} autoHideDuration={5000} onClose={()=>setOpen(false)}>
      <Alert onClose={()=>setOpen(false)} severity={alert?.type} sx={{ width: '100%' }}>
        {alert?.msg}
      </Alert>
    </Snackbar>
  )
}
