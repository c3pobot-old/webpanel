export default function RandomString() {
	try{
    let result = '';
  	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  	for ( var i = 0; i < 64; i++ ) {
  	  result += characters.charAt(Math.floor(Math.random() * 64));
  	}
  	return result;
  }catch(e){
    console.error(e)
  }
}
