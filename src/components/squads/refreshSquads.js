import ApiRequest from 'components/apiRequest'
import DB from 'components/db'

async function fetchSquadList(opts = {}, force = false){
  const { discordId, setAlert, server, setSpinner } = opts
  setSpinner(true)
  let obj
  if(!force) obj = await DB.get('cache-'+server?.id)
  if(!obj){
    const tempObj = await ApiRequest({method: 'squads', dId: discordId, data: {method: 'get', data: server}});
    if(tempObj?.squads?.length >= 0){
      await DB.set('cache-'+server.id, tempObj.squads)
      obj = tempObj.squads
    }
    if(tempObj?.msg) setAlert(tempObj.msg)
  }
  if(obj) await DB.set(server?.id, obj)
  setSpinner(false)
  return obj
}
export default async function RefreshSquads (opts = {}, force = false){
  const { server, setSquadList } = opts
  let obj
  if(!force) obj = await DB.get(server?.id)
  if(!obj) obj = await fetchSquadList(opts, force)
  if(obj) setSquadList(obj)
}
