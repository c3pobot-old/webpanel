import Dexie from 'dexie';

export const db = new Dexie(process.env.REACT_APP_BOT_DB_NAME)

db.version(1).stores({
  data: 'id'
})
function set(key, data){
  return new Promise(function(resolve){
    db.data.put({id: key, value: data})
    .then(function(){
      resolve()
    })
    .catch(function(e){
      console.error(e)
      resolve()
    })
  })
}
async function get(key){
  return new Promise(function(resolve){
    db.data.where({id: key}).first(function (data){
      resolve(data?.value)
    })
    .catch(e=>{
      console.error(e);
      resolve()
    })
  })
}
function clear(){
  return new Promise(function(resolve){
    db.data.clear()
    .then(function (){
      resolve()
    })
    .catch(function(e){
      console.error(e);
      resolve()
    })
  })
}
function del(key){
  return new Promise(function(resolve){
    db.data.delete(key)
    .then(function(){
      resolve()
    })
    .catch(function(e){
      console.error(e);
      resolve()
    })
  })
}
const Functions = {
  get: get,
  set: set,
  clear: clear,
  del: del
}
export default Functions
