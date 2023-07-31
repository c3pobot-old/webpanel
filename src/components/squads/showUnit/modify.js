import AddUnitToSquad from 'components/squads/addUnitToSquad'
import UpdateSquads from 'components/squads/updateSquads'

export function AddStat(opts = {}, data = {}){
  const { unit, setAlert } = opts;
  if(data.max === '' || data.max === "" || +data.max < 1) delete data.max
  if(data.min >= 0 ) data.min = +data.min
  if(data.max >= 0 ) data.max = +data.max
  if(!data.min) data.min = 0
  if(unit.stats.filter(x=>x.id === data.id).length > 0){
    setAlert({type: 'error', msg: 'Stat '+data.nameKey+' is already added'})
  }else{
    const tempUnit = JSON.parse(JSON.stringify(unit));
    if(tempUnit){
      tempUnit.stats.push(data)
      AddUnitToSquad(opts, tempUnit, 'stat')
    }
  }
}
export function DeleteStat(opts = {}, data={}, statIndex){
  const { unit } = opts;
  const tempUnit = JSON.parse(JSON.stringify(unit));
  if(tempUnit){
    tempUnit.stats = tempUnit.stats.filter(x=>x.id !== data.id)
    AddUnitToSquad(opts, tempUnit, 'stat')
  }
}
export function DeleteUnit(opts = {}){
  const { setUnit, unit, squad } = opts;
  const tempSquad = JSON.parse(JSON.stringify(squad))
  if(tempSquad?.units){
    tempSquad.units = tempSquad.units.filter(x=>x.id !== unit.id)
    tempSquad.change = {type: 'deleteUnit'}
    UpdateSquads(opts, tempSquad)
    setUnit(null)
  }
}
export function EditStat(opts={}, data={}, statIndex){
  const { unit } = opts;
  if(data.max === '' || data.max === "" || +data.max < 1) delete data.max
  if(data.min >= 0 ) data.min = +data.min
  if(data.max >= 0 ) data.max = +data.max
  if(!data.min) data.min = 0
  const tempUnit = JSON.parse(JSON.stringify(unit));
  if(tempUnit){
    tempUnit.stats[statIndex] = data
    AddUnitToSquad(opts, tempUnit, 'stat');
  }
}
export function EditUnit(opts = {}, data = {}){
  const { unit } = opts;
  const tempUnit = {...unit,...data}
  AddUnitToSquad(opts, tempUnit, 'stat');
}
