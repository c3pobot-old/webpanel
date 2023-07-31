import UpdateSquads from 'components/squads/updateSquads'
export default function addUnitToSquad(opts = {}, tempUnit, type){
  const { squad, unit, setUnit } = opts
  if(tempUnit && squad){
    const index = squad.units?.findIndex(x=>x.id === tempUnit.id)
    if(index >= 0){
      squad.units[index] = tempUnit;
      squad.change = { type: type || 'edit' }
      if(unit) setUnit(tempUnit)
      UpdateSquads(opts, squad)
    }
  }
}
