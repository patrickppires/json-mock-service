const recursive = require('recursive-readdir')
const path = require('path')

module.exports = (workdir) => new Promise((resolve, reject) => recursive(path.resolve(workdir, 'mappings'), (err, files) => {
    if (err) {
        reject(err)
    }
    return resolve(files.filter(file => path.extname(file) === '.json'))
}))
