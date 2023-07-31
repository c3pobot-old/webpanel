import UpdateSquads from 'components/squads/updateSquads'
import DB from 'components/db'
export function AddSquad(opts = {}, nameKey){
  if(!nameKey) return
  nameKey = nameKey.toString().trim().toLowerCase()
  const { squadList, squads, server, setAlert, prefix } = opts
  if(nameKey || nameKey >= 0){
    let squadExists = squadList.filter(x=>x.nameKey?.toLowerCase() === nameKey).length
    if(prefix === 'g') squadExists = squads.filter(x=>x.nameKey?.toLowerCase() === nameKey).length
    if(!squadExists){
      let tempSquad = { nameKey: nameKey, units: [], id: server.id, change: { type: 'add' }}
      UpdateSquads(opts, tempSquad)
    }else{
      setAlert({type: 'error', msg: 'Squad with name '+nameKey+' already exists'})
    }
  }
}
export function DeleteGroup(opts = {}){
  const { group, server, setChanges, setGroup, setSquadList, squadList } = opts;
  const groupIndex = squadList.findIndex(x=>x.nameKey === group.nameKey)
  if(groupIndex >= 0){
    group.change = {type: 'delete'}
    group.deleteMe = true
    squadList[groupIndex] = group
    DB.set(server.id, squadList)
    setSquadList(squadList)
    setChanges(true)
    setGroup(null)
  }
}
export function UpdateSquadOrder(opts={}, newSquads = []){
  const { group, server, setChanges, setGroup, setSquadList, squadList } = opts;
  if(!group.squads || newSquads?.length === 0) return
  let groupIndex = squadList.findIndex(x=>x.nameKey === group.nameKey)
  if(groupIndex >= 0){
    group.squads = newSquads
    group.change = {type: 'squadOrder'}
    squadList[groupIndex] = group
    DB.set(server.id, squadList)
    setSquadList(squadList)
    setChanges(true)
    setGroup(group)
  }
}
