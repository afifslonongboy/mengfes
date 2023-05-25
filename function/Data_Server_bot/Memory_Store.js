const { makeInMemoryStore } = require("@adiwajshing/baileys")
const logg = require('pino')
const Memory_Store = makeInMemoryStore({ logger: logg().child({ level: 'fatal', stream: 'store' }) })

module.exports = { Memory_Store }