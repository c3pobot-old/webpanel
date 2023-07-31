import Login from './login'
import Logout from './logout'
import Auth from './auth'
import LoginError from './error'
import LogoutSuccess from './logoutSuccess'
export default function Discord(opts = {}){
  let navPath = window.location.pathname
  if(navPath) navPath = navPath.replace('/discord', '')
  if(navPath === '/auth') return <Auth {...opts}/>
  if(navPath === '/logout') return <Logout {...opts}/>
  if(navPath === '/error') return <LoginError {...opts}/>
  if(navPath === '/logoutSuccess') return <LogoutSuccess {...opts}/>
  return <Login />
}
