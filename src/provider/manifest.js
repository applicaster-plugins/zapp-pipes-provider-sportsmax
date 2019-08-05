export const manifest = {
  handlers: [
    "SPORTSMAX_TOKEN",
  ],
  help: {
    SPORTSMAX_TOKEN: {
      description: 'Create a sportsmax authentication token to enable watch locked item from applicater2',
      params: {
        timestamp: 'for how long this token should be valid',
        uuid: 'the device uuid'
      }
    }
  }
};
