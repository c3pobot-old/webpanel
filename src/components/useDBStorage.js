import { useEffect, useState } from "react";
import DB from './db'

export default function useDBStorage (key, defaultValue = null){
  const [ value, setValue ] = useState();

  async function setdbValue (newValue) {
    await DB.set(key, newValue)
    setValue(newValue)
  }

  async function getIntialValue(){
    const saved = await DB.get(key)
    setValue(saved || defaultValue)
  }
  useEffect(()=>{
    getIntialValue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return [ value, setdbValue ]
}
