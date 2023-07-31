import ApiRequest from 'components/apiRequest'
import DB from 'components/db'

export default async function RefreshUnits(opts = {}, force = false){
  const { discordId, setAlert, setSpinner, setUnitList } = opts
  let obj
  if(!force) obj = await DB.get('units')
  if(!obj){
    setAlert({type: 'info', msg: 'Pulling units from server'})
    setSpinner(true)
    obj = await ApiRequest({method: 'getUnitList', dId: discordId, data: {}})
    if(obj?.length > 0){
      await DB.set('units', obj)
      setAlert({ type: 'success', msg: 'Units Pulled Successfully' })
    }else{
      if(obj?.msg?.msg){
        setAlert(obj.msg)
      }else{
        setAlert({ type: 'error', msg: 'Error getting units' })
      }
    }
    setSpinner(false)
  }
  if(obj?.length > 0) setUnitList(obj);
}
