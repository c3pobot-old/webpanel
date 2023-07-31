import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

import queryString from 'query-string'
import useLocalStorage from 'components/useLocalStorage'
import ButtonNav from 'components/buttonNav'
import DB from 'components/db'
import RandomString from 'components/randomString'

function getAuthUrl () {
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  url.searchParams.append('access_type', 'offline')
  url.searchParams.append('prompt', 'consent')
  url.searchParams.append('scope', 'https://www.googleapis.com/auth/games_lite https://www.googleapis.com/auth/userinfo.profile')
  url.searchParams.append('response_type', 'code')
  url.searchParams.append('client_id', process.env.REACT_APP_GOOG_CLIENT_ID)
  url.searchParams.append('redirect_uri', process.env.REACT_APP_GOOG_REDIRECT_URI)
  return url.href
}

export default function GoogleLink(){
  const urlParms = queryString.parse(window.location.search)
  const [ allyCode, setAllyCode ] = useLocalStorage('allyCode', null);
  const [ allyCodes, setAllyCodes ] = useState([])
  const [ fetchStatus, setFetchStatus ] = useState(true)
  if(urlParms?.allyCode) setAllyCode(urlParms.allyCode)
  async function fetchData() {
    setFetchStatus(true)
    const data = await DB.get('allyCodes')
    if(data) setAllyCodes(data)
    setFetchStatus(false)
  }
  useEffect(()=>{
    fetchData()
  }, [])
  function SetAllyCode (obj = {}){
    localStorage.setItem('playerName', obj.name)
    setAllyCode(obj.allyCode)
  }
  if(fetchStatus) return null
  if(allyCode){
    const playerName = localStorage.getItem('playerName')
    const googleAuthUrl = getAuthUrl()
    let stateParam = localStorage.getItem('googleStateParam')
    if(!stateParam){
      stateParam = RandomString()
      localStorage.setItem('googleStateParam', stateParam)
    }
    return (
      <Container>
        <Box textAlign="center" pt={5} pb={5}>
        <Typography>By using the "Log in with Google Play" Button below</Typography>
        <Typography>you will be allowing a discord bot to login to your</Typography>
        <Typography>Star Wars Galaxy of Heroes Account on your behalf for</Typography>
        <Typography>{playerName} with allyCode {allyCode}.</Typography>
        <Typography>This may be in violation of the EA TOS (Terms of Service) </Typography>
        <Box textAlign="center" pt={2} pb={2}><Button variant="contained" onClick={()=>ButtonNav('https://tos.ea.com/legalapp/WEBTERMS/US/en/PC/', true)}>EA TOS</Button></Box>
        <Typography>If you do not wish to allow this access than close this webpage now or click cancel button below</Typography>
        <Typography>If you continuine you do so at your own risk.</Typography>
        <Box textAlign="center" pt={2} pb={2}><Button variant="contained" startIcon={<GoogleIcon />} onClick={()=>ButtonNav(googleAuthUrl+'&state='+stateParam)}>Login with Google</Button></Box>
        <Box textAlign="center" pt={2} pb={2}><Button variant="contained" onClick={()=>setAllyCode(null)}>Cancel</Button></Box>
      </Box>
      </Container>
    )
  }
  if(allyCodes?.length > 0) return (
    <TableContainer>
      <Box>Please select the allyCode below to link</Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>allyCode</TableCell>
            <TableCell colSpan="2">Existing Link</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allyCodes.map(({allyCode, name, type})=>(
            <TableRow key={allyCode}>
              <TableCell>{name}</TableCell>
              <TableCell>{allyCode}</TableCell>
              <TableCell>{type ? (type === 'google' ? 'Google':'Guest'):'None'}</TableCell>
              <TableCell><Button variant="contained" onClick={()=>SetAllyCode({allyCode: allyCode, name: name})}>Link</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
  return (
    <Container>
      <Box textAlign="center" pt={2} pb={2}>You do not have any allyCodes linked</Box>
      <Box textAlign="center"><Button variant="contained" onClick={()=>ButtonNav('/allyCodes')}>Link AllyCodes</Button></Box>
    </Container>
 )
}
