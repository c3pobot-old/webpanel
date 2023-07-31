const combatType = {
  1: 1,
  2: 2,
  3: 0
}
export default function MapZones(tbDef = {}){
  try{
    const zoneData = []
    for(let i in tbDef.conflictZoneDefinition){
      let tempConflict = {
        id: tbDef.conflictZoneDefinition[i].zoneDefinition.phase+'-'+tbDef.conflictZoneDefinition[i].zoneDefinition.conflict,
        zoneId: tbDef.conflictZoneDefinition[i].zoneDefinition.zoneId,
        phase: tbDef.conflictZoneDefinition[i].zoneDefinition.phase,
        phaseNum: +tbDef.conflictZoneDefinition[i].zoneDefinition.phase?.replace('P', ''),
        conflict: tbDef.conflictZoneDefinition[i].zoneDefinition.conflict,
        conflictNum: +tbDef.conflictZoneDefinition[i].zoneDefinition.conflict?.replace('C', ''),
        type: tbDef.conflictZoneDefinition[i].zoneDefinition.type,
        combatType: combatType[tbDef.conflictZoneDefinition[i].territoryBattleZoneUnitType],
        nameKey: tbDef.conflictZoneDefinition[i].zoneDefinition.nameKey,
        platoons: 0,
        numRounds: tbDef.roundCount,
        cms: 0,
        star: 0,
        totalPoints: 0,
        deployment: 0,
        sort: tbDef.conflictZoneDefinition[i].zoneDefinition.sort || 0,
        victoryPointRewards: tbDef.conflictZoneDefinition[i].victoryPointRewards.map((x, index)=>{
          return Object.assign({}, {
            star: +index + 1,
            points: +x.galacticScoreRequirement
          })
        })
      }
      for(let p in tempConflict.victoryPointRewards){
        tempConflict[tempConflict.victoryPointRewards[p].star] = +tempConflict.victoryPointRewards[p].points
      }
      tempConflict.points3star = tempConflict[3]
      zoneData.push(tempConflict)
    }
    return zoneData
  }catch(e){
    console.error(e);
  }
}
