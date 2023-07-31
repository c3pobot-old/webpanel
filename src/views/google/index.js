import Auth from './auth'
import AllyCodeNoMatch from './allyCodeNoMatch'
import Code3Error from './code3Error'
import ErrorOccured from './errorOccured'
import Link from './link'
import LinkSuccess from './linkSuccess'

import ButtonNav from 'components/buttonNav'

export default function Google(opts = {}){
  const { discordId } = opts;
  if(!discordId){
    localStorage.setItem('startUrl', window.location.href)
    ButtonNav('/discord/login')
  }
  if(!discordId) return null
  let navPath = window.location.pathname
  if(navPath) navPath = navPath.replace('/google', '')
  if(navPath === '/auth') return <Auth {...opts}/>
  if(navPath === '/allyCodeNoMatch') return <AllyCodeNoMatch {...opts}/>
  if(navPath === '/code3Error') return <Code3Error {...opts}/>
  if(navPath === '/errorOccured') return <ErrorOccured {...opts}/>
  if(navPath === '/linkSuccess') return <LinkSuccess {...opts}/>
  return <Link {...opts}/>

}
