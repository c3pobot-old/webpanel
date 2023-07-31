import { useEffect } from "react";
import ApiRequest from './apiRequest'
import GetCookie from './cookies'
import useLocalStorage from './useLocalStorage'

function saveData (value) {
  const discordId = GetCookie('discordId')
  if(value && discordId){
    ApiRequest({method: 'saveWebProfile', dId: discordId, data: value})
  }
}

export default function useWebProfile () {
  const [ value, setValue ] = useLocalStorage('webProfile', {});

  function saveValue (newValue){
    if(!newValue){
      setValue(null)
    }else{
      setValue({...value, ...newValue})
    }
  }
  useEffect(() => {
    // storing input name
    if(value && value !== {}){
      localStorage.setItem('webProfile', JSON.stringify(value))
      saveData(value)
    }
  }, [value]);

  return [value, saveValue];
};
