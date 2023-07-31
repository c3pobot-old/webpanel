export default function getPath (enumPath = {}, index = 2) {
  let str = window.location.pathname.split('/')[index]
  if(str && enumPath[str]) return enumPath[str]
}
