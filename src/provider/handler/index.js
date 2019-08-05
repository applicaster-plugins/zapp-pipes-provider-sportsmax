import * as commands from './commands';

export const handler = nativeBridge => params => {
  const type = getType(params);  
  console.log(params);
  
  if (!type || [ 'generateToken' ].indexOf(type) == -1) {
    return nativeBridge.throwError('unknown request');
  }
  params = convertParam(params);
  return commands[type](params)
    .then(nativeBridge.sendResponse)
    .catch(nativeBridge.throwError);
};

function convertParam(params){
  try{
    var items = params.url.split("&");
    params.timestamp = items[0].split("=")[1];
    params.uuid = items[1].split("=")[1];
  }catch(e){

  }
  return params;
}



const getType = ({ type }) =>
  ({
    SPORTSMAX_TOKEN: 'generateToken',
  }[type]);


  //api[udid]=71bdbabfa58e00a9&api[uuid]=5d45b437accf6000140fbd6e