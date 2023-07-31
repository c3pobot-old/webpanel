import React, { useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';

import ApiRequest from 'components/apiRequest'
import ButtonNav from 'components/buttonNav'
import DB from 'components/db'
import queryString from 'query-string';

export default function Auth (opts = {}) {
  const { discordId, setSpinner } = opts;
  useEffect (()=>{
    async function CheckAuth(){
      const stateParam = localStorage.getItem('googleStateParam')
      const urlParms = queryString.parse(window.location.search)
      const allyCode = localStorage.getItem('allyCode')
      localStorage.removeItem('googleStateParam')
      if(urlParms?.code && urlParms?.state === stateParam){
        setSpinner(true)
        const pObj = await ApiRequest({method: 'linkGoogle', dId: discordId, data: {allyCode: allyCode, code: urlParms.code}})
        if(pObj?.status){
          if(pObj.allyCodes?.length > 0) await DB.set('allyCodes', pObj.allyCodes)
          setSpinner(false)
          ButtonNav('/google/'+pObj.status)
        }else{
          setSpinner(false)
          ButtonNav('/google/errorOccured')
        }
      }else{
        setSpinner(false)
        ButtonNav('/google/errorOccured')
      }
    }
    CheckAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Container>
      <Box textAlign="center" pt={5} pb={5}>
        <Typography>Please Wait. Checking Credentials ...</Typography>
      </Box>
    </Container>
  )
}
