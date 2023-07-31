import { createGlobalState } from 'react-hooks-global-state';

function getLocalStorageValue(key, defaultValue = null){
  let saved = localStorage.getItem(key)
  if(saved) saved = JSON.parse(saved)
  return saved || defaultValue
}
const intialState = {
  allyCodes: null,
  alert: {},
  spinner: false,
  webProfile: getLocalStorageValue('webProfile', {}),
  nav: sessionStorage.getItem('nav') || '/'
}
const { useGlobalState } = createGlobalState(intialState);
export default useGlobalState
