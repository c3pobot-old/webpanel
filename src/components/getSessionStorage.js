export default function GetSessionStorage (name, json = true) {
  let obj = sessionStorage.getItem(name)
  if(obj && json) obj = JSON.parse(obj)
  return obj
}
