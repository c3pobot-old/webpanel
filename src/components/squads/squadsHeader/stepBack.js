export default function StepBack(opts = {}, type){
  const { prefix, server, setConfirm, setGroup, setServer, setSquad, setUnit } = opts;
  let changes = localStorage.getItem(prefix+'-changes')
  if(changes) changes = JSON.parse(changes)
  if(type){
    if(type === 'unit'){
      setUnit(null)
    }
    if(type === 'squad'){
      setSquad(null)
      setUnit(null)
    }
    if(type === 'group'){
      if(setGroup) setGroup(null)
      setSquad(null)
      setUnit(null)
    }
    if(type === 'server'){
      if(changes){
        setConfirm({msg: 'You have un-saved changes for server **'+server?.name+'** What do you want to do with them?', open: true, setConfirm: setConfirm})
      }else{
        if(setGroup) setGroup(null)
        setSquad(null)
        setUnit(null)
        setServer(null)
      }
    }
  }
}
