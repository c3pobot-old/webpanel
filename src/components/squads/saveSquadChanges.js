import ApiRequest from 'components/apiRequest'
import DB from 'components/db'

export default async function SaveSquadChanges( opts = {} ){
  const { discordId, server, setAlert, setChanges, setSpinner, setSquadList, squadList  } = opts;
  if(server?.id){
    setAlert({type: 'info', msg: 'Saving Squad Changes to the database....'})
    setSpinner(true)
    const obj = await ApiRequest({method: 'squads', dId: discordId, data: { method: 'save', data: { squads: squadList, type: server?.type, id: server?.id}}})
    if(obj){
      if(obj.squads){
        await DB.set('cache-'+server.id, obj.squads)
        await DB.set(server.id, obj.squads)
        setSquadList(obj.squads)
      }
      if(obj.msg) setAlert(obj.msg)
    }
    setChanges(false)
    setSpinner(false)
  }
}
