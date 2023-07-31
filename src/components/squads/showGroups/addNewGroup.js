import DB from 'components/db'

export default function AddNewGroup(opts = {}, nameKey){
  const { setAlert, setGroup, setSquadList, server, squadList } = opts
  if(nameKey || nameKey >= 0){
    if(squadList.filter(x=>x.nameKey?.toLowerCase() === nameKey?.toString()?.toLowerCase()).length === 0){
      let tempGroup = { nameKey: nameKey.toString().toLowerCase(), squads: [], id: server.id, change: { type: 'add' }}
      squadList.push(tempGroup)
      DB.set(server.id, squadList)
      setSquadList(squadList)
      setGroup(tempGroup)
    }else{
      setAlert({type: 'error', msg: 'Group with name '+nameKey+' already exists'})
    }
  }
}
