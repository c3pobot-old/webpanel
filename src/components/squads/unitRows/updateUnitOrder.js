import UpdateSquads from 'components/squads/updateSquads'

export default function UpdateUnitOrder( opts = {}, units = [], squad ){
  if(squad){
    squad.units = units
    squad.change = {type: 'order'}
    UpdateSquads(opts, squad)
  }
}
