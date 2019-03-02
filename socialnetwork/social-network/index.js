'use strict';

require('dotenv').config();
const webServer = require('./webserver');
const httpServerConfig = require('./config/http-server-config');
const mysqlPool = require('./webserver/databases/mysql-pool.js');
const mongoPool = require('./webserver/databases/mongo-pool.js');

/**
 * Initialize dependencies
 * */
(async function initApp() {
  try {
    await mysqlPool.connect();
    await mongoPool.connect();
    await webServer.listen(httpServerConfig.port);
    console.log(`server running at: ${httpServerConfig.port}`);
  } catch (e) {
    await webServer.close();
    console.error(e);
    process.exit(1);
  }
}());
