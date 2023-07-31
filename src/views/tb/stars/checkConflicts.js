import sorter from 'components/stableSort'
async function CheckConflict(round = [], gp = {}, star = 0){
  try{
    round = await sorter(round, 'aesc', star)
    if(star === 3) round = await sorter(round, 'aesc', 'points3star')
    if(star === 0) round = await sorter(round, 'aesc', '1')
    let prefered = round.filter(x=>x?.prefered === star || x?.preloaded === true)
    if(prefered?.length > 0){
      for(let p in prefered){
        let i = round.findIndex(x=>x.id === prefered[p].id)
        if(i >= 0){
          if(star > 0 && !round[i].preload && round[i][star] && (+gp[round[i].combatType] + round[i].totalPoints) >= round[i][star]){
            round[i].star = star
            gp[round[i].combatType] = gp[round[i].combatType] - (round[i][star] - round[i].totalPoints)
            if(gp[round[i].combatType] < 0 ) gp[round[i].combatType] = 0
            round[i].deployment = round[i][star] - round[i].totalPoints
            round[i].totalPoints = round[i][star]
            if(star < 3) round[i].next = round[i][star + 1] - round[i][star]
            for(let s = 3;s>=0;s--){
              if(round[i][s]) delete round[i][s]
            }
          }
        }
      }
    }
    if(round?.length > 0 && star > 0){
      for(let i in round){
        if(star > 0 && !round[i].preload && round[i][star] && (+gp[round[i].combatType] + round[i].totalPoints) >= round[i][star]){
          round[i].star = star
          gp[round[i].combatType] = gp[round[i].combatType] - (round[i][star] - round[i].totalPoints)
          if(gp[round[i].combatType] < 0 ) gp[round[i].combatType] = 0
          round[i].deployment = round[i][star] - round[i].totalPoints
          round[i].totalPoints = round[i][star]
          if(star < 3) round[i].next = round[i][star + 1] - round[i][star]
          for(let s = 3;s>=0;s--){
            if(round[i][s]) delete round[i][s]
          }
        }
      }
    }
    if(round?.length > 0 && star === 0){
      for(let i in round){

        if(round[i]['1'] && gp[round[i].combatType] > 0 ){
          if(round[i].totalPoints + gp[round[i].combatType] > round[i]['1'] ){
            let points2add = round[i]['1'] - round[i].totalPoints - 1
            if(points2add > 0){
              round[i].deployment += points2add
              round[i].totalPoints += points2add
              gp[round[i].combatType] -= points2add
              if(gp[round[i].combatType] < 0) gp[round[i].combatType] = 0
            }
          }else{
            round[i].deployment += gp[round[i].combatType]
            round[i].totalPoints += gp[round[i].combatType]
            gp[round[i].combatType] = 0
          }
          round[i].points3star -= round[i].totalPoints
        }
      }
    }
  }catch(e){
    console.error(e);
  }
}
export default async function checkConflicts(conflicts = [], gp, roundMap, roundNum, config = {}){
  try{
    let currentRound = [], tempConflicts = JSON.parse(JSON.stringify(conflicts.filter(x=>x.phaseNum === roundNum))), totalRounds = 0
    if(Object.values(config).length > 0){
      for(let i in config){
        let tempConflict
        if(roundNum > 1) tempConflict = roundMap[(roundNum - 1)]?.find(x=>x.id === config[i].id)
        if(!tempConflict) tempConflict = conflicts.find(x=>x.id === config[i].id)
        if(tempConflict){
          tempConflict = JSON.parse(JSON.stringify(tempConflict))
          if(tempConflict.totalPoints > 0) tempConflict.preloaded = true
          tempConflict.platoons = config[i].platoons
          tempConflict.cms = config[i].cms
          tempConflict.preload = config[i].preload
          tempConflict.deployment = 0
          tempConflict.totalPoints += (config[i].platoons || 0) + (config[i].cms || 0)
          tempConflict.points3star = tempConflict.points3star - (config[i].platoons || 0) - (config[i].cms || 0)
          tempConflict.prefered = config[i].prefered
          currentRound.push(tempConflict)
        }
      }
    }
    if(currentRound?.length > 0 && currentRound?.length !== tempConflicts?.length && roundNum > 0 && roundMap[roundNum - 1]){
      let tempRound = roundMap[(roundNum - 1)]
      if(tempRound?.length > 0) tempRound = JSON.parse(JSON.stringify(tempRound))
      for(let i in tempRound){
        if(currentRound.filter(x=>x.conflictNum === tempRound[i].conflictNum).length === 0){
          tempRound[i].cms = 0
          tempRound[i].platoons = 0
          tempRound[i].preloaded = true
          tempRound[i].preload = false
          tempRound[i].deployment = 0
          currentRound.push(tempRound[i])
        }
      }
    }
    if(currentRound?.length === 0){
      if((roundNum - 1) > 0 && roundMap[(roundNum - 1)]){
        currentRound = JSON.parse(JSON.stringify(roundMap[(roundNum - 1)]))
        for(let i in currentRound){
          currentRound[i].cms = 0
          currentRound[i].platoons = 0
          currentRound[i].preloaded = true
          currentRound[i].preload = false
          currentRound[i].deployment = 0
        }
      }else{
        currentRound = JSON.parse(JSON.stringify(conflicts.filter(x=>x.phaseNum === roundNum)))
      }
    }
    if(currentRound?.length !== tempConflicts?.length){
      for(let i in tempConflicts){
        if(currentRound.filter(x=>x.conflictNum === tempConflicts[i].conflictNum).length === 0){
          currentRound.push(JSON.parse(JSON.stringify(tempConflicts[i])))
        }
      }
    }

    for(let i in currentRound){
      if(currentRound[i].star > 0){
        let tempObj = conflicts.find(x=>x.conflictNum === currentRound[i].conflictNum && x.phaseNum === (currentRound[i].phaseNum + 1))
        if(tempObj) currentRound[i] = JSON.parse(JSON.stringify(tempObj))
      }
      currentRound[i].round = roundNum
      if(currentRound[i].numRounds > totalRounds) totalRounds = currentRound[i].numRounds
    }

    await CheckConflict(currentRound, gp, 3)

    await CheckConflict(currentRound, gp, 2)
    if(roundNum === totalRounds) await CheckConflict(currentRound, gp, 1)
    await CheckConflict(currentRound, gp, 0)
    //for(let i = 3;i >= 0; i--) await CheckConflict(currentRound, gp, +i)

    currentRound = await sorter(currentRound, 'asec', 'sort')
    roundMap[roundNum] = JSON.parse(JSON.stringify(currentRound))
  }catch(e){
    console.error(e);
  }
}
