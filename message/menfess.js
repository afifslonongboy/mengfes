const SETTING = require("../database/config.js");
const MODULE = SETTING.modul;
const fs = MODULE.fs;

const FUNCTION = SETTING.function;
const { getGroupAdmins, runtime, sleep, getBuffer, getRandom, fetchJson } =
    FUNCTION.funcServer;

//DATABASE MENFESS
const rom = JSON.parse(fs.readFileSync('./database/menfess.json'));
const balas = JSON.parse(fs.readFileSync('./database/balas_menfess.json'));

module.exports = async (conn, msg, m, setting, store) => {
    try {
        const { type, quotedMsg, mentioned, now, fromMe, isBaileys } = msg;
        if (isBaileys) return;
        var chats = type === "conversation" && msg.message.conversation ? msg.message.conversation : type === "imageMessage" && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : type === "videoMessage" && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : type === "extendedTextMessage" && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : type === "buttonsResponseMessage" && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : type === "templateButtonReplyMessage" && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : type === "messageContextInfo" ? msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId : type == "listResponseMessage" && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : "";
        if (chats == undefined) { chats = ""; }

        const prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(chats)
            ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi)
            : "#";

        //INITIAL
        const content = JSON.stringify(msg.message);
        const from = msg.key.remoteJid;
        const pushname = msg.pushName;
        const body = chats.startsWith(prefix) ? chats : "";
        const args = body.trim().split(/ +/).slice(1);
        const q = args.join(" ");
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
        const botNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";

        //IYA atau TIDAK
        const isGroup = msg.key.remoteJid.endsWith("@g.us");
        const sender = isGroup ? msg.key.participant ? msg.key.participant : msg.participant : msg.key.remoteJid;
        const isOwner = [`${setting.ownerNumber}`].includes(sender) ? true : false;
        const isCommand = body.startsWith(prefix);

        //GRUP INITIAL
        const groupMetadata = isGroup ? await conn.groupMetadata(from) : "";
        const groupName = isGroup ? groupMetadata.subject : "";
        const groupId = isGroup ? groupMetadata.id : "";
        const participants = isGroup ? await groupMetadata.participants : "";
        const groupMembers = isGroup ? groupMetadata.participants : "";
        const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : "";

        //GRUP IYA atau TIDAK
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false;
        const isGroupAdmins = groupAdmins.includes(sender);

        //RESPONSE IYA atau TIDAK
        const isImage = type == "imageMessage";
        const isQuotedMsg = type == "extendedTextMessage";
        const isMedia = type === "imageMessage" || type === "videoMessage";
        const isQuotedImage = isQuotedMsg ? content.includes("imageMessage") ? true : false : false;
        const isVideo = type == "videoMessage";
        const isQuotedVideo = isQuotedMsg ? content.includes("videoMessage") ? true : false : false;
        const isSticker = type == "stickerMessage";
        const isQuotedSticker = isQuotedMsg ? content.includes("stickerMessage") ? true : false : false;
        const isQuotedAudio = isQuotedMsg ? content.includes("audioMessage") ? true : false : false;

        const reply = (teks) => {
            conn.sendMessage(from, { text: teks }, { quoted: msg });
        };

        // Function Menfess
        if (!msg.key.fromMe && balas.find(i => i.tujuan === sender) && !isGroup) {
            var dbx = balas.find(i => i.tujuan === sender)
            if (dbx.status === 'konek') {
                if (['conversation', 'extendedTextMessage'].includes(msg.type)) {
                    if (chats.startsWith(prefix + 'balas')) return reply(`Jangan pake ${prefix}balas, langsung pesanny aja.`)
                    if (chats.startsWith(prefix)) return reply(`Jangan diawali dengan simbol jika kamu ingin membalas pesan menfess`)
                    var teks_balasan = `Hai, kamu menerima pesan balasan nih\n\nPesan yang kamu kirim sebelumnya :\n${dbx.pesan}\n\nPesan Balasannya :\n${chats}`
                    
                    conn.sendMessage(dbx.dari, {text: teks_balasan})
                    reply(`Sukses mengirimkan balasan`)
                }
            }
        }

        // Function for Chat With
        function checkChat(who = '', _db) {
            var posi = _db.find(i => [i.tujuan].includes(who))
            return posi
        }

        function otherSender(who = '', _db) {
            return who == _db.a ? _db.b : who == _db.b ? _db.a : ''
        }

        function isChat(who = '', _db) {
            var posi = _db.find(i => [i.dari, i.tujuan].includes(who))
            return posi
        }

        function hapusChat(who = '', _db, pathe) {
            var cek_data = isChat(who, _db)
            var posi_x = _db.indexOf(cek_data)
            _db.splice(posi_x, 1)
            fs.writeFileSync(pathe, JSON.stringify(_db, null, 2))
        }

        //PESAN
        conn.readMessages([msg.key]);
        if (isGroup) { console.log(from); }
        else {
            switch (command) {
                case 'menfess':
                    if (isGroup) return reply('Fitur ini khusus chat pribadi!')
                    if (!q) return reply(`Silahkan masukkan format seperti contoh dibawah\nformat: .${command} Nomer|Nama|Pesan\n\n*Contoh* : .${command} 6282123432653|sur|halo`)
                    if (isChat(sender, rom)) return reply(`kamu sedang dalam room menfess.\n\nKetik ${prefix}stopchat untuk keluar dari room chat.`)

                    var number_to = q.split('|')[0];
                    var sender_name = q.split('|')[1];
                    var msg_send = q.split('|')[2]
                    if (number_to.startsWith('0')) {
                        number_to = '62' + number_to.slice(1)
                    } else if (number_to.startsWith('+62')) {
                        number_to = '62' + number_to.slice(3)
                    }
                    if (!number_to) return reply(`Format salah, masukkan nomer tujuan\n\nContoh Format:\n.${command} Nomer|Secret|Hai, apa kabar?`)

                    if (isNaN(number_to)) return reply(`Tujuan Harus Berupa Nomor!\n\nContoh Format:\n.${command} ` + botNumber.split("@")[0] + '|Secret|Hai')
                    

                    number_to = number_to.replace(/[^0-9]/gi, '') + "@s.whatsapp.net"

                    rom.push({
                        dari: sender,
                        tujuan: number_to,
                        noBot: botNumber,
                        pesan: msg_send,
                        status: 'disconnected'
                    })
                    fs.writeFileSync('./database/menfess.json', JSON.stringify(rom, null, 2))

                    if (!sender_name) return reply(`Format salah, masukkan nama Anda atau nama rahasia\n\nContoh Format:\n.${command} ` + number_to.split("@")[0] + '|Nama|Hai')

                    if (!msg_send) return reply(`Format salah, masukkan pesan yang akan dikirim\n\nContoh Format:\n.${command} ${number_to.split("@")[0]}|${sender_name}|Hai Kak`)

                    var cek_number = await conn.onWhatsApp(number_to)

                    if (cek_number.length === 0) return reply(`Nomer yang anda masukkan tidak terdaftar di WhatsApp!`)

                    number_to = cek_number[0].jid

                    if (sender === number_to) return reply(`Jangan kirim ke diri sendiri dong🥲`)

                    if (botNumber === number_to) return reply(`Jangan kirim ke nomer bot lah🥲`)

                    var send = `Hai, ada pesan nih buat kamu.\n\n_Dari:_ \n${sender_name}\n_Pesan:_ \n${msg_send}\n\nPesan ini ditulis oleh seseorang, bot hanya menyampaikan pesan tersebut kepadamu.\n\nKetik .balas untuk membalas pesan.`
                    conn.sendMessage(number_to, { image: { url: 'storage/mengfess.jpg' }, caption: send })

                    reply(`Sukses mengirim pesan Rahasia ke nomer tersebut, silahkan tunggu jawaban dari penerima pesan, jika sudah dibalas bot akan otomatis mengirim balasannya!`)
                    break
                case  'balas':
                    if (isChat(sender, rom) === undefined) return 
                    if (isChat(sender, rom).dari === sender) return reply(`lu yang kirim pesan, lol.`)
                    var data = isChat(sender, rom)
                    balas.push({
                        dari: data.dari,
                        tujuan: data.tujuan,
                        pesan: data.pesan,
                        status: 'konek'
                    })
                    fs.writeFileSync('./database/balas_menfess.json', JSON.stringify(balas, null, 2))
                    var cek_data = isChat(sender, rom)
                    var posi_x = rom.indexOf(cek_data)
                    rom.splice(posi_x, 1)
                    fs.writeFileSync('./database/menfess.json', JSON.stringify(rom, null, 2))
                    reply('Silahkan ketik balasan kamu!')
                    setTimeout(hapusChat, 1800000, sender, balas, './database/balas_menfess.json')
                    break

                case 'stopchat':
                    if (isChat(sender, rom) === undefined) return reply('Tidak ada pesan.')
                    hapusChat(sender, rom, './database/menfess.json')
                    reply('*_Done..._*')
                    break
            }
        }

    } catch (error) {
        console.log(error);
    }
}