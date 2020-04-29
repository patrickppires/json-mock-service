const logger = require('simple-node-logger')
const opts = {
    timestampFormat: 'YYYY-MM-DD HH:mm:ss.SSS'
}
module.exports = logger.createSimpleLogger(opts)
