import React, { useState } from 'react'

import useLocalStorage from 'components/useLocalStorage'
import ButtonNav from 'components/buttonNav'

import SetEmail from './setEmail'
import SetCode from './setCode'
import SelectAllyCode from './selectAllyCode'
import ShowError from './showError'

export default function CodeAuth(opts = {}){
  const { discordId } = opts;
  const [ allyCode, setAllyCode ] = useLocalStorage('allyCode', null);
  const [ email, setEmail ] = useState(false)
  const [ code, setCode ] = useState(null)
  if(!discordId){
    localStorage.setItem('startUrl', window.location.href)
    ButtonNav('/discord/login')
  }
  function updateAllyCode(tempAllyCode){
    setEmail(false)
    setCode(null)
    setAllyCode(tempAllyCode)
  }
  if(!allyCode) return <SelectAllyCode opts={opts} setAllyCode={updateAllyCode} />
  if(!email) return <SetEmail opts={opts} allyCode={allyCode} setEmail={setEmail} code={code} setCode={setCode}/>
  if(!code) return <SetCode opts={opts} allyCode={allyCode} setEmail={setEmail} setCode={setCode} />
  return <ShowError code={code} setCode={setCode} setEmail={setEmail} />
}
