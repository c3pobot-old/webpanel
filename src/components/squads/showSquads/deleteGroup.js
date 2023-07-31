import DB from 'components/db'
export default function DeleteGroup(opts = {}){
  const { group, server, setChanges, setGroup, setSquadList, squadList } = opts;
  group.change = {type: 'delete'}
  group.deleteMe = true
  const groupIndex = squadList.findIndex(x=>x.nameKey === group.nameKey)
  if(groupIndex >= 0){
    squadList[groupIndex] = group
    DB.set(server.id, squadList)
    setSquadList(squadList)
    setGroup(null)
    setChanges(true)
  }
}
