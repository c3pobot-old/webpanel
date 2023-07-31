import Cookies from 'universal-cookie'
const cookies = new Cookies();
export default function GetCookie (name) {
  return cookies.get(name, {path: '/'})
}
export function DeleteCookie (name) {
  cookies.remove(name, {path: '/'})
}
export function SetCookie (name, value, longTerm = true) {
  const opts = {path: '/'}
  if(longTerm) opts.maxAge = 7776000
  cookies.set(name, value, opts)
}
