import sorter from 'components/stableSort'
const getSquadNum = (squadId)=>{
  try{
    if(squadId?.includes('-platoon-1')) return 1
    if(squadId?.includes('-platoon-2')) return 2
    if(squadId?.includes('-platoon-3')) return 3
    if(squadId?.includes('-platoon-4')) return 4
    if(squadId?.includes('-platoon-5')) return 5
    if(squadId?.includes('-platoon-6')) return 6
  }catch(e){
    console.error(e);
  }
}
const GetUnits = async(baseId, members = [], playerUnitCount = {}, maxUnit = 10)=>{
  try{
    return await members.filter(x=>x.rosterUnit?.filter(y=>y.definitionId?.startsWith(baseId+':') && (!playerUnitCount[x?.playerId] || maxUnit > playerUnitCount[x?.playerId])).length > 0 ).map(m=>{
      let rosterUnits = m.rosterUnit.filter(y=>y.definitionId?.startsWith(baseId+':'))
      return Object.assign({},{
        player: m.name,
        playerId: m.playerId,
        baseId: baseId,
        relicTier: rosterUnits[0].relic?.currentTier,
        rarity: rosterUnits[0].currentRarity,
        level: rosterUnits[0].currentLevel,
        tier: rosterUnits[0].currentTier,
        gp: rosterUnits[0].gp,
        combatType: rosterUnits[0].combatType,
        sort: (rosterUnits[0].relic?.currentTier || 0) + (rosterUnits[0].currentTier || 0)
      })
    })
  }catch(e){
    console.error(e);
  }
}
const GetUnitCount = async(units = [])=>{
  try{
    let res = {}
    for(let i in units){
      if(!res[units[i].baseId]){
        res[units[i].baseId] = JSON.parse(JSON.stringify(units[i]))
        res[units[i].baseId].count = 0
      }
      res[units[i].baseId].count++
    }
    return Object.values(res)
  }catch(e){
    console.error(e);
  }
}
const GetSquadConfig = (platoonIds = [], platoonId, squadNum)=>{
  try{
    let res = {}
    let tempPlatoon = platoonIds.find(x=>x.id === platoonId)
    if(tempPlatoon?.squads?.length > 0){
      const tempSquad = tempPlatoon.squads.find(x=>x.num === squadNum)
      if(tempSquad) res = JSON.parse(JSON.stringify(tempSquad))
    }
    return res
  }catch(e){
    console.error(e);
  }
}
const GetNumUnits = (member = [], baseId, relicTier = 1, rarity = 1, combatType = 1)=>{
  try{
    return +member.filter(x=>x.rosterUnit.filter(y=>y.definitionId?.startsWith(baseId+':') && y.currentRarity >= 0 && (combatType === 2 || y.relic?.currentTier >= relicTier)).length > 0).length
  }catch(e){
    console.error(e);
  }
}
export default async function MapPlatoons(pDefinition = [], guild = [], platoonIds = [], tbDay = 1){
  let units = {}, platoons = [], pDef = []
  if(platoonIds?.length > 0){
    for(let i in platoonIds){
      let tempObj = pDefinition.find(x=>x.id === platoonIds[i].id)
      if(tempObj){
        tempObj = JSON.parse(JSON.stringify(tempObj))
        tempObj.exclude = platoonIds[i].exclude
        tempObj.prefilled = platoonIds[i].prefilled
        pDef.push(tempObj)
      }
    }
  }else{
    const tempObj = pDefinition.filter(x=>x.phase === 'P'+tbDay)
    if(tempObj?.length > 0) pDef = JSON.parse(JSON.stringify(tempObj))
  }
  for(let i in pDef){
    let tempPlatoon = JSON.parse(JSON.stringify(pDef[i]))
    tempPlatoon.squads = []
    tempPlatoon.points = 0
    tempPlatoon.rarity = 1
    tempPlatoon.relicTier = 1
    let playerUnitCount = {}
    let squads = (JSON.parse(JSON.stringify(pDef[i].squads)))
    for(let s in squads){
      let cgIsDumb = true
      if(+s === 0){
        let tempSquadNum = getSquadNum(squads[s].id)
        if(tempSquadNum === 1) cgIsDumb = false
      }
      squads[s].num = (cgIsDumb ? (+s + 1):getSquadNum(squads[s].id))
    }
    squads = await sorter(squads, 'desc', 'points')
    if(!tempPlatoon.exclude && !tempPlatoon.prefilled){
      for(let s in squads){
        let requireUnit = 0, providedUnit = 0
        let tempSquad = {id: squads[s].id, num: squads[s].num, units: [], points: 0, nameKey: pDef[i].id+' '+pDef[i].nameKey}
        const squadConfig = await GetSquadConfig(platoonIds, pDef[i].id, squads[s].num)
        if(squadConfig) tempSquad = {...tempSquad, ...squadConfig}
        //console.log(platoonIds?.filter(x=>x.id === pDef[i].id)?.fliter(x=>x.squads.filter(s=>s.id === squads[s].num && s.exclude)).length)
        if(!tempSquad.exclude && !tempSquad.prefilled){
          const unitCounts = await GetUnitCount(squads[s].units)
          for(let u in unitCounts){
            requireUnit += unitCounts[u].count
            if(unitCounts[u].rarity > tempPlatoon.rarity) tempPlatoon.rarity = unitCounts[u].rarity
            if(unitCounts[u].unitRelicTier > tempPlatoon.relicTier) tempPlatoon.relicTier = unitCounts[u].unitRelicTier
            if(!units[unitCounts[u].baseId]) units[unitCounts[u].baseId] = await GetUnits(unitCounts[u].baseId, guild, playerUnitCount, tempPlatoon.maxUnit)
            // && x.rarity >= unitCounts[u].rarity && x.tier >= unitCounts[u].tier && x.relicTier >= unitCounts[u].unitRelicTier
            let avaliableUnits = units[unitCounts[u].baseId].filter(x=>x.rarity >= unitCounts[u].rarity && (unitCounts[u].combatType === 2 || x.relicTier >= unitCounts[u].unitRelicTier))
            //if(unitCounts[u].combatType === 1) avaliableUnits = avaliableUnits?.filter(x=>x.tier >= unitCounts[u].tier && x.relicTier >= unitCounts[u].unitRelicTier)
            if(avaliableUnits?.length > 0) avaliableUnits = await sorter(avaliableUnits, 'asec', 'relicTier')
            let prefilled = tempSquad.unitConfig?.find(x=>x.baseId === unitCounts[u].baseId && x.prefilled > 0)
            if(prefilled?.baseId){
              for(let m = 0;m<prefilled.prefilled;m++){
                providedUnit++
                tempSquad.units.push({nameKey: unitCounts[u].nameKey, player: 'Prefilled', baseId: unitCounts[u].baseId})
                unitCounts[u].count--
              }
            }
            if(unitCounts[u].count < 0) unitCounts[u].count = 0
            if(unitCounts[u].count > 0 && +avaliableUnits?.length > 0 && +avaliableUnits?.length >= unitCounts[u].count){
              for(let m = 0;m<unitCounts[u].count;m++){
                if(avaliableUnits[m]){
                  providedUnit++
                  avaliableUnits[m].nameKey = unitCounts[u].nameKey
                  tempSquad.units.push(avaliableUnits[m])
                  units[unitCounts[u].baseId] = units[unitCounts[u].baseId].filter(x=>x.playerId !== avaliableUnits[m].playerId)
                  if(!playerUnitCount[avaliableUnits[m].playerId]) playerUnitCount[avaliableUnits[m].playerId] = 0
                  playerUnitCount[avaliableUnits[m].playerId] += 1
                }
              }
            }else{
              for(let m = 0;m<unitCounts[u].count;m++){
                tempSquad.units.push({nameKey: unitCounts[u].nameKey, baseId: unitCounts[u].baseId, available: +avaliableUnits?.length, count: GetNumUnits(guild, unitCounts[u].baseId, unitCounts[u].unitRelicTier, unitCounts[u].rarity, unitCounts[u].combatType)})
              }
            }
          }
          if(tempSquad?.units?.length > 0){
            if(requireUnit === providedUnit){
              tempPlatoon.points += squads[s].points || 0
              tempSquad.points = squads[s].points
            }
          }
        }
        tempPlatoon.squads.push(tempSquad)
      }
    }
    if(tempPlatoon.squads?.length > 0) tempPlatoon.squads = await sorter(tempPlatoon.squads, 'asce', 'num')
    platoons.push(tempPlatoon)
  }
  if(platoons?.length > 0) platoons = await sorter(platoons, 'asce', 'sort')
  return platoons
}
