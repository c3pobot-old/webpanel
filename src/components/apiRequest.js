export default async function ApiRequest (opt = {}) {
  const obj = await fetch('/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "accept": "application/json"
    },
    body: JSON.stringify(opt)
  })

  .then(res=>{
    return res.json()
  })
  .catch(e=>{})
  return obj
}
