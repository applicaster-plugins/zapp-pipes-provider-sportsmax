import jwt from 'jsonwebtoken';
const secret = "AViqL8rxVraFMtoa58nR6H4pfXZzXUmdxTwhFhB7";
const name = "Sportsmax"

export function generateToken(params, nativeBridge){  

  if( !params.uuid || !params.timestamp){
    return Promise.reject('you must have timestamp and uuid params.');
  }
  let timestamp;
  try{
    timestamp = parseInt(params.timestamp)
  }catch(err){
    return Promise.reject('timestamp can not parse to int.');
  }
  
  let header = {
      "alg": "HS256",
      "typ": "JWT"
    }
  
    let data = {
      "iss": name,
      "exp": timestamp,
      "uuid":params.uuid
    }  
    return new Promise(function(resolve, reject) {
      try{
        var token = jwt.sign(data, secret, { header });
        let resultFeed = {
                  type: {
                    value: 'feed',
                  },
                  extensions: {
                    auth_token: token,
                  },          
              }
         nativeBridge.log("resultFeed");   
         nativeBridge.log(JSON.stringify(resultFeed));
         resolve(resultFeed)
      } catch(error){
        nativeBridge.log(error);
        reject("jwt error.")
      } 
    });
}

