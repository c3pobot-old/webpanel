import CheckConflicts from './checkConflicts'
export default async function calcPoints(zoneData = [], guild = {}, config = {}){
  let gp = {}, roundMap = {}, rounds = zoneData[0]?.numRounds, starCount = 0
  if(guild) gp = { 0: guild.gp, 1: guild.gpChar, 2: guild.gpShip }

  for(let i = 0;i<rounds;i++){
    await CheckConflicts(zoneData, JSON.parse(JSON.stringify(gp)), roundMap, +i + 1, config[(+i + 1)])
  }

  starCount = Object.values(roundMap).flat(1).reduce((acc, a)=>{
    return acc + a.star
  }, 0)

  return {gp: gp, roundMap: roundMap, stars: starCount}
}
