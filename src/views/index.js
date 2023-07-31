import React from 'react'

import AllyCodes from 'views/allyCodes'
import Home from 'views/home'
import Discord from 'views/discord'
import CodeAuth from './codeAuth'
import Google from 'views/google'
import Squads from 'views/squads'
import SquadGroups from './squadGroups'
import TB from './tb'
import TW from './tw'
import Help from 'views/help'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import GetCookie from 'components/cookies'

export default function NavRoutes(props = {}) {
  const opts = {...props,...{ discordId: GetCookie('discordId') }}
  return (
      <Router>
        <Routes>
          <Route path = '/allyCodes/*' element={<AllyCodes {...opts}/>}/>
          <Route path = '/discord/*' element={<Discord {...opts}/>}/>
          <Route path = '/google/*' element={<Google {...opts}/>}/>
          <Route path = '/codeAuth/*' element={<CodeAuth {...opts}/>}/>
          <Route path = '/help/*' element={<Help {...opts}/>}/>
          <Route path = '/Squads/*' element={<Squads {...opts}/>}/>
          <Route path = '/SquadGroups/*' element={<SquadGroups {...opts}/>}/>
          <Route path = '/tb/*' element={<TB {...opts}/>}/>
          <Route path = '/tw/*' element={<TW {...opts}/>}/>
          <Route path = '/*' element={<Home {...opts}/>}/>
        </Routes>
      </Router>
  )
}
