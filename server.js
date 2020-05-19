const zappPipesDevKit = require('@applicaster/zapp-pipes-dev-kit');
const provider = require('./src');

const zappPipesServer = zappPipesDevKit.createZappPipesServer({
  options: { port: 8080, host: "0.0.0.0" }, // optionnal. these are the default values
  providers: [provider],
});

zappPipesServer.route({
  method: 'GET',
  path: '/{provider}/types',
  handler(req, reply) {
    reply(provider.manifest.handlers);
  },
});

zappPipesServer.startServer();
