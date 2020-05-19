import { commands } from './commands';

export const handler = nativeBridge => params => {
  const { type } = params;

  if (!type) {
    return nativeBridge.throwError('command type is missing in params');
  }

  var command = commands[type];
  if (!command) {
    return nativeBridge.throwError('command not supported');
  }

  return command(params, nativeBridge)
  .then(nativeBridge.sendResponse)
  .catch(nativeBridge.throwError);
};
