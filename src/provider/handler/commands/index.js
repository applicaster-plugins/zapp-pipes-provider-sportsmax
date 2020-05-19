import { generateToken } from './generateToken';
import { getEPG } from './getEPG';
import { getChannelList } from './getChannelList';

export const commands = {
  "SPORTSMAX_TOKEN": generateToken,
  "epg": getEPG,
  "channel-list": getChannelList
};
