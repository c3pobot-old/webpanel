import React, { useEffect } from 'react';
import { Container, Box, Typography, useMediaQuery } from '@mui/material';

import ApiRequest from 'components/apiRequest'
import ButtonNav from 'components/buttonNav'
import queryString from 'query-string';
import SetAuth from 'components/setAuth'

export default function Auth(opts = {}) {
  const { setSpinner, setWebProfile } = opts;
  const systemTheme = (useMediaQuery('(prefers-color-scheme: dark)') ? 'dark':'light');

  async function CheckAuth () {
    setSpinner(true)
    const stateParam = localStorage.getItem('discordStateParam')
    const urlParms = queryString.parse(window.location.search)
    let startUrl = localStorage.getItem('startUrl')
    if(!startUrl) startUrl = '/'
    localStorage.removeItem('startUrl')
    localStorage.removeItem('discordStateParam')
    if(urlParms?.code && urlParms?.state && stateParam === urlParms.state){
      const dObj = await ApiRequest({method: 'discordAuth', data: {code: urlParms?.code, theme: (systemTheme ? systemTheme:'light')}})
      if(dObj?.encryptedId){
        if(dObj.data?.webProfile) await setWebProfile(dObj.data.webProfile)
        await SetAuth(dObj)
        ButtonNav(startUrl)
      }else{
        localStorage.removeItem('startUrl')
        ButtonNav('/discord/error')
      }
    }
    setSpinner(false)
  }
  useEffect(()=>{
    CheckAuth()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Container>
      <Box textAlign="center" pt={5} pb={5}>
        <Typography>Please Wait. Checking Credentials now ...</Typography>
      </Box>
    </Container>
  )
}
