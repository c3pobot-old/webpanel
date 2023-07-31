import UpdateSquads from 'components/squads/updateSquads'

export default function DeleteSquad(opts = {}){
  const { squad } = opts;
  const tempSquad = JSON.parse(JSON.stringify(squad))
  tempSquad.deleteMe = true
  tempSquad.change = {type: 'delete'}
  UpdateSquads(opts, tempSquad)
}
