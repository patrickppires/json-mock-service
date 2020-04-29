const MockServerLauncher = require('./launcher')
const { config } = require('./../../config/wdio.conf.base')
const app = new MockServerLauncher()

app.onPrepare(config)
