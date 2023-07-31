import { v4 as uuidv4 } from 'uuid';

import UpdateSquads from 'components/squads/updateSquads'

export default function AddUnit(opts={}, nameKey){
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
