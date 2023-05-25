"use strict";
//module
const SETTING = require('./database/config.js')
const MODULE = SETTING.modul
const FUNCTION = SETTING.function
const { default: makeWASocket, useSingleFileAuthState, DisconnectReason, makeInMemoryStore} = MODULE.baileys
const { Boom } = MODULE.boom
const logg = require('pino')
const moment = MODULE.moment
const express = MODULE.express
const socketIO = MODULE.socketIO
const qrcode = MODULE.qrcode
const http = MODULE.http
const fs = MODULE.fs
const fileUpload = MODULE.fileupload
const time = moment(new Date()).format('HH:mm:ss DD/MM/YYYY')

//function
const { serialize, sleep } = FUNCTION.funcServer
const { status_Connection } = FUNCTION.statusConnect
const { getQr, open } = FUNCTION.web

//create Server
const port = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

//DataBot
const setting = SETTING.dataBot
const session = `./${setting.sesionName}.json`
const { state, saveState } = useSingleFileAuthState(session)
moment.tz.setDefault("Asia/Jakarta").locale("id");

//Server Running
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(fileUpload({
    debug: false
}));
app.get('/', (req, res) => {
    res.sendFile('tampil.html', {
        root: __dirname
    });
});
server.listen(port, function () {
    console.log('App berjalan di port *: ' + port);
});

/**
* Uncache if there is file change;
* @param {string} module Module name or path;
* @param {function} cb <optional> ;
*/
function nocache(module, cb = () => { }) {
    console.log(`Module ${module} sedang diperhatikan terhadap perubahan`)
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}
/**
* Uncache a module
* @param {string} module Module name or path;
*/
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

const store = makeInMemoryStore({ logger: logg().child({ level: 'fatal', stream: 'store' }) })

//connect to wa 
async function start() {
    const connectToWhatsApp = async () => {
        const sock = makeWASocket({
            printQRInTerminal: true,
            logger: logg({ level: 'fatal' }),
            browser: ['asb-menfess', 'Opera', '1.0.0'],
            auth: state,
            syncFullHistory: true, getMessage: async key => {
                return {

                }
            }
        })
        console.clear()
        store.bind(sock.ev)

        /* Auto Update */
        require('./message/pesan')
        require('./message/menfess')
        nocache('./message/menfess', module => console.log('[ WHATSAPP BOT ]  ' + time + ` "${module}" Telah diupdate!`))
        nocache('./message/pesan', module => console.log('[ WHATSAPP BOT ]  ' + time + ` "${module}" Telah diupdate!`))
        
        //Update Pesan
        sock.multi = true
        sock.nopref = false
        sock.prefa = 'anjing'
        sock.ev.on('messages.upsert', async m => {
            var msg = m.messages[0]
            if (!m.messages) return;
            try { if (msg.message.messageContextInfo) delete msg.message.messageContextInfo } catch { }
            if (msg.key && msg.key.remoteJid == "status@broadcast") return
            if (msg.key.fromMe === true) return
            if (msg.message != null) {
                var pesan = msg.message.conversation
                var aran = msg.pushName
                var no = msg.key.remoteJid.split('@')[0]
            } else { }
            msg = serialize(sock, msg)
            msg.isBaileys = msg.key.id.startsWith('BAE5')
            require('./message/pesan.js')(sock, msg, m, setting, store)
            require('./message/menfess.js')(sock, msg, m, setting, store)
        })

        //Update Grup
        sock.ev.on('group-participants.update', async (update) => {
            console.log(update);
        })

        sock.ev.on('connection.update', (update) => {
            status_Connection(Boom, update, connectToWhatsApp, DisconnectReason, io)
            if (update.qr != '') {
                let qr = `${update.qr}`
                qrcode.toDataURL(qr, (err, url) => {
                    getQr(url, io)
                    sleep(20000)
                    open(io)
                })
            }
        })

        sock.ev.on('creds.update', await saveState)
    }
    connectToWhatsApp().catch(err => console.log("penemuan error: " + err))
}
start()