import React, { Fragment, useState } from 'react'
import { Box, Button, Table, TableBody, TableCell, TableRow, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import ApiRequest from 'components/apiRequest'
import ButtonNav from 'components/buttonNav'

export default function RequestCode({ opts = {}, allyCode, setEmail, code }){
  const { discordId } = opts;
  const [ tempEmail, setTempEmail ] = useState('');
  const [ sendStatus, setSendStatus ] = useState(false);
  async function RequestNewCode(){
    setSendStatus(true)
    const res = await ApiRequest({method: 'codeAuth', dId: discordId, data: {method: 'request_otc', allyCode: allyCode, payload: { email: tempEmail } }})
    console.log(res)
    if(res?.status === 'ok') setEmail(true)
    setSendStatus(false)
  }
  return (
    <Table>
      <TableBody>
        {code === 'nocache' && <TableRow><TableCell sx={{textAlign: 'center'}}><Typography>{'It has been over 10 minutes since you requested the code for security reasons I expired your data'}</Typography></TableCell></TableRow>}
        <TableRow><TableCell sx={{textAlign: 'center'}}>
          <Typography>By using the "Request Code" Button below</Typography>
          <Typography>you will be allowing a discord bot to login to your</Typography>
          <Typography>Star Wars Galaxy of Heroes Account on your behalf for</Typography>
          <Typography>allyCode {allyCode}.</Typography>
          <Typography>This may be in violation of the EA TOS (Terms of Service) </Typography>
          <Box textAlign="center" pt={2} pb={2}><Button variant="contained" onClick={()=>ButtonNav('https://tos.ea.com/legalapp/WEBTERMS/US/en/PC/', true)}>EA TOS</Button></Box>
          <Typography>If you do not wish to allow this access than close this webpage now</Typography>
          <Typography>If you continuine you do so at your own risk.</Typography>
        </TableCell></TableRow>
        <TableRow><TableCell sx={{textAlign: 'center'}}><Typography>Please enter your EA connect email below to recieve a code to link the bot to your game account</Typography></TableCell></TableRow>
        <TableRow>
          <TableCell sx={{textAlign: 'center'}}><TextField onChange={(e)=>setTempEmail(e.currentTarget.value)} value={tempEmail} label="EA Connect Email" variant="outlined" /></TableCell>
        </TableRow>
        <TableRow><TableCell sx={{textAlign: 'center'}}><LoadingButton loadingPosition="center" loading={sendStatus} variant="contained"  onClick={RequestNewCode}><Typography>Request Code</Typography></LoadingButton></TableCell></TableRow>
      </TableBody>
    </Table>
  )
}
