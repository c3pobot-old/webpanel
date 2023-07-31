import React, { useState } from 'react'
import { Box, Button, Table, TableBody, TableCell, TableRow, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import ApiRequest from 'components/apiRequest'
import ButtonNav from 'components/buttonNav'
import DB from 'components/db'

export default function CheckCode({ opts = {}, allyCode, setCode, setEmail }){
  const { discordId } = opts;
  const [ tempCode, setTempCode ] = useState('')
  const [ sendStatus, setSendStatus ] = useState(false);

  async function checkCode(){
    setSendStatus(true)
    const res = await ApiRequest({method: 'codeAuth', dId: discordId, data: {method: 'code_check', allyCode: allyCode, code: tempCode }})
    if(res.status === 'success'){
      let tempAllyCodes = await DB.get('allyCodes')
      if(tempAllyCodes?.length > 0){
        let index = tempAllyCodes.findIndex(x=>+x.allyCode === +allyCode)
        if(index >= 0){
          tempAllyCodes[index].type = 'codeAuth'
          await DB.set('allyCodes', tempAllyCodes)
        }
      }
    }
    if(res?.status) setCode(res.status)
    if(res?.status === 'nocache') setEmail(false)
    setSendStatus(false)
  }
  return (
    <Table>
    <TableBody>
      <TableRow><TableCell sx={{textAlign: 'center'}}>
        <Typography>By using the "Check Code" Button below</Typography>
        <Typography>you will be allowing a discord bot to login to your</Typography>
        <Typography>Star Wars Galaxy of Heroes Account on your behalf for</Typography>
        <Typography>allyCode {allyCode}.</Typography>
        <Typography>This may be in violation of the EA TOS (Terms of Service) </Typography>
        <Box textAlign="center" pt={2} pb={2}><Button variant="contained" onClick={()=>ButtonNav('https://tos.ea.com/legalapp/WEBTERMS/US/en/PC/', true)}>EA TOS</Button></Box>
        <Typography>If you do not wish to allow this access than close this webpage now</Typography>
        <Typography>If you continuine you do so at your own risk.</Typography>
        <Typography>Note: This will break/log you out of your current game session to check the code and link to the bot.</Typography>
      </TableCell></TableRow>
      <TableRow>
        <TableCell sx={{textAlign: 'center'}}><TextField onChange={(e)=>setTempCode(e.currentTarget.value)} value={tempCode} label="EA Connect Code" variant="outlined" /></TableCell>
      </TableRow>
      <TableRow><TableCell sx={{textAlign: 'center'}}><LoadingButton loadingPosition="center" loading={sendStatus} variant="contained"  onClick={checkCode}><Typography>Check Code</Typography></LoadingButton></TableCell></TableRow>
    </TableBody>
    </Table>
  )
}
