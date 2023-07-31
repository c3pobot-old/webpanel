import DB from 'components/db'

export default function UpdateSquads(opts={}, newSquad={}){
  const { group, prefix, server, setChanges, setGroup, setSquad, setSquadList, squad, squadList } = opts;
  let tempSquadList = []
  if(squadList) tempSquadList = JSON.parse(JSON.stringify(squadList))
  let squadChange = {type: newSquad?.change?.type}
  if(prefix === 's'){
    const squadIndex = tempSquadList.findIndex(x=>x.nameKey === newSquad.nameKey)
    if(squadIndex >= 0){
      tempSquadList[squadIndex] = newSquad
    }else{
      tempSquadList.push(newSquad)
    }
  }
  if(prefix === 'g'){
    let tempGroup = JSON.parse(JSON.stringify(group))
    tempGroup.change = squadChange
    delete newSquad.change
    const groupSquadIndex = tempGroup?.squads?.findIndex(x=>x.nameKey === newSquad?.nameKey)
    const squadIndex = tempSquadList.findIndex(x=>x.nameKey === tempGroup.nameKey)
    if(groupSquadIndex >= 0){
      tempGroup.squads[groupSquadIndex] = newSquad
    }else{
      if(tempGroup?.squads) tempGroup.squads.push(newSquad)
    }
    if(newSquad.deleteMe) tempGroup.squads = tempGroup.squads.filter(x=>x.nameKey !== newSquad.nameKey)
    if(squadIndex >= 0) tempSquadList[squadIndex] = tempGroup
    setGroup(tempGroup)
  }
  if(newSquad?.deleteMe){
    setSquad(null)
  }else{
    if(squad) setSquad(newSquad)
  }
  DB.set(server?.id, tempSquadList)
  setSquadList(tempSquadList)
  setChanges(true)
}
