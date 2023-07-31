import React from 'react';
import { Box, Button, Container, Typography} from '@mui/material';

import ButtonNav from 'components/buttonNav'
import RandomString from 'components/randomString'

function getAuthUrl () {
  const url = new URL('https://discord.com/api/oauth2/authorize')
  url.searchParams.append('client_id', process.env.REACT_APP_DISCORD_CLIENT_ID)
  url.searchParams.append('redirect_uri', process.env.REACT_APP_DISCORD_REDIRECT_URL)
  url.searchParams.append('response_type', 'code')
  url.searchParams.append('scope', 'identify')
  return url.href
}

export default function Login(opts = {}) {
  const { discordId } = opts;
  let authUrl = getAuthUrl()

  if(discordId) return (
    <Container>
      <Box textAlign="center" pt={5} pb={5}>
        <Typography>You are logged in</Typography>
      </Box>
    </Container>
  )
  let stateParam = localStorage.getItem('discordStateParam')
  if(!stateParam){
    stateParam = RandomString()
    localStorage.setItem('discordStateParam', stateParam)
  }
  let loginRequired = localStorage.getItem('startUrl')
  return (
    <Container>
      <Box textAlign="center" pt={5} pb={5}>
        {loginRequired && <Typography>You are required to login to discord</Typography>}
        <Typography>Login to your Discord account below</Typography>
        <Box textAlign="center" pt={5} pb={5}><Button variant="contained" onClick={()=>ButtonNav(authUrl+'&state='+stateParam)}>Login with Discord</Button></Box>
      </Box>
    </Container>
  )
}
