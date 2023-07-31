import { v4 as uuidv4 } from 'uuid';
import UpdateSquads from 'components/squads/updateSquads'
import DB from 'components/db'

export function AddUnit(opts={}, nameKey){
  const { setChanges, setUnit, squad, unitList, webProfile } = opts;
  let tempSquad
  if(squad) tempSquad = JSON.parse(JSON.stringify(squad))
  let uInfo = unitList.find(x=>x.nameKey?.toLowerCase() === nameKey?.toLowerCase().trim())
  if(uInfo && tempSquad){
    const newUnit = {
      id: uuidv4(),
      baseId: uInfo.baseId,
      nameKey: uInfo.nameKey,
      combatType: uInfo.combatType,
      rarity: (webProfile?.unitDefault?.rarity || 1),
      gp: (webProfile?.unitDefault?.gp || 0),
      stats: []
    }
    if(uInfo.combatType === 1){
      newUnit.gear = webProfile?.unitDefault?.gear || {nameKey: "G1", name: "gear", value: 1}
      newUnit.zeta = []
      newUnit.omi = []
      newUnit.ult = []
    }
    if(tempSquad?.units){
      tempSquad.units.push(newUnit)
      tempSquad.change = {type: 'newUnit'}
      UpdateSquads(opts, tempSquad)
    }
    setChanges(true)
    if(webProfile?.showUnit) setUnit(newUnit)
  }
}
export function DeleteSquad(opts = {}){
  const { squad } = opts;
  const tempSquad = JSON.parse(JSON.stringify(squad))
  tempSquad.deleteMe = true
  tempSquad.change = {type: 'delete'}
  UpdateSquads(opts, tempSquad)
}

export function SetMainSquad(opts={}){
  const { prefix, group = {}, setChanges, setGroup, setSquad, setSquadList, squad = {}, squadList = [], server={} } = opts;
  if(prefix !== 'g' || group.squads?.length === 0 || !group.squads) return
  let newStatus = squad.main ? false:true
  let squadIndex = group.squads.findIndex(x=>x.nameKey === squad.nameKey)
  let groupIndex = squadList.findIndex(x=>x.nameKey === group.nameKey)
  if(squadIndex >= 0 && groupIndex >= 0){
    if(newStatus){
      for(let i in group.squads) group.squads[i].main = false
    }
    squad.main = newStatus
    group.change = {type: 'setmain'}
    group.squads[squadIndex] = squad
    squadList[groupIndex] = group
    DB.set(server?.id, squadList)
    setChanges(true)
    setSquadList(squadList)
    setGroup(group)
    setSquad(squad)
  }
}
