export default function ButtonNav (uri, newWindow = false) {
  if(uri){
    if(newWindow){
      window.open(uri, '_blank')
    }else{
      window.location.href = uri
    }
  }
}
