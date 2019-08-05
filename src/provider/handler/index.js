import * as commands from './commands';

export const handler = nativeBridge => params => {
  const type = getType(params);  
  if (!type || [ 'generateToken' ].indexOf(type) == -1) {
    return nativeBridge.throwError('unknown request');
  }
  
  return commands[type](params)
    .then(nativeBridge.sendResponse)
    .catch(nativeBridge.throwError);
};




const getType = ({ type }) =>
  ({
    SPORTSMAX_TOKEN: 'generateToken',
  }[type]);


  //api[udid]=71bdbabfa58e00a9&api[uuid]=5d45b437accf6000140fbd6e