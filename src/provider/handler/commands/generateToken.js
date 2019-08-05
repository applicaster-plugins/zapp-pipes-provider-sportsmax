import jwt from 'jsonwebtoken';
const secret = "AViqL8rxVraFMtoa58nR6H4pfXZzXUmdxTwhFhB7";
const name = "Sportsmax"


export function generateToken(params){  
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
      jwt.sign(data, secret,{ header }, function(err, token) {
        if(err){
           reject('token not created.');
        }else{
          let feed = {
              type: {
                value: 'feed',
              },
              extensions: {
                auth_token: token,
              },          
          }
          resolve(feed)
        }
      });    
    });
}

