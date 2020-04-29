const fs = require('fs-extra')
const mustache = require('mustache')
const moment = require('moment')

module.exports = (file, req, res, methods) => {
    const objMethods = {};
    (Array.isArray(methods) ? methods : []).map(el => {
        return Object.assign(objMethods, {
            [el.field]: view({request: req, response: res, fnView: el.replaceTo, value: el.value })
        })
    })

    const template = isValidFile(file) ? fs.readFileSync(file, 'utf8') : JSON.stringify(file)

    return mustache.render(template, objMethods)
}

const fnViews = {
    RAMDON_NUMBER: ({_undefined}) => Math.round(Math.random() * 1000),
    REQUEST_BODY: ({req, field}) => Array.isArray(req.body) ? req.body[0][field] : req.body[field],
    REQUEST_PARAM: ({req, field}) => req.params[field],
    DATE_NOW: ({_undefined}) => moment().toISOString()

}
const view = ({request: req, response: res, fnView, value}) => fnViews[fnView]({req, res, field: value})

const isValidFile = file => fs.existsSync(file)
