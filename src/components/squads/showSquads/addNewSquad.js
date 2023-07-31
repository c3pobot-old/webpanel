import UpdateSquads from 'components/squads/updateSquads'
export default function AddNewSquad(opts = {}, nameKey){
  const { squadList, squads, setSquad, server, setAlert, prefix } = opts
  if(nameKey || nameKey >= 0){
    let squadExists = squadList.filter(x=>x.nameKey?.toLowerCase() === nameKey?.toString()?.toLowerCase()).length
    if(prefix === 'g') squadExists = squads.filter(x=>x.nameKey?.toLowerCase() === nameKey?.toString()?.toLowerCase()).length
    if(!squadExists){
      let tempSquad = { nameKey: nameKey.toString().toLowerCase(), units: [], id: server.id, change: { type: 'add' }}
      setSquad(tempSquad)
      UpdateSquads(opts, tempSquad)
    }else{
      setAlert({type: 'error', msg: 'Squad with name '+nameKey+' already exists'})
    }
  }
}
