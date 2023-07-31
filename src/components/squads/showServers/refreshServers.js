import ApiRequest from 'components/apiRequest'
import DB from 'components/db'

export default async function refreshServers(opts = {}, forced = false, dbSkip = false){
  const { discordId, setAlert, setServers, setSpinner } = opts;
  setSpinner(true)
  let obj
  if(!dbSkip) obj = await DB.get('servers')
  if(!obj){
    const tempObj = await ApiRequest({ method: 'fetchDiscordSvr', dId: discordId, data: { forced: forced } })
    if(tempObj?.data){
      await DB.set('servers', tempObj.data)
      obj = tempObj.data
    }
    if(tempObj?.status?.msg) setAlert(tempObj.status)
  }
  if(obj) setServers(obj)
  setSpinner(false)
}
