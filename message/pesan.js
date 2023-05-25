const { request } = require("http");
//module
const SETTING = require("../database/config.js");
const MODULE = SETTING.modul;
const { downloadContentFromMessage, downloadMediaMessage } = MODULE.baileys;
const { lirik, twittera } = MODULE.kyouka;
const fs = MODULE.fs;
const moment = MODULE.moment;
const qrcode = MODULE.qrcode;
const QrCode = require('qrcode-reader');
//MODUL GAME
const { tebakgambar, tebakkata, caklontong, asahotak, siapakahaku } =
    MODULE.bocil;

//function
const FUNCTION = SETTING.function;
const { getGroupAdmins, runtime, sleep, getBuffer, getRandom, fetchJson } =
    FUNCTION.funcServer;
const { download, artinama } = FUNCTION.download
const { toQR, emojiMix, removeBg, stickerImg, stickerVideo, smeme } = FUNCTION.maker
const { menu } = FUNCTION.menu;
const { writeExifImg, writeExifVid } = FUNCTION.exif;
const { pinterest, quotesAnime, styletext } = FUNCTION.scrap;
const { TelegraPh, UploadFileUgu, AnonFiles } = FUNCTION.uploader
const { ml, ff, aov, codm, sausage, gensin, } = FUNCTION.cekid

//function game
const { addPlayGame, isPlayGame, cekWaktuGame } = FUNCTION.func_game;
const { getJawaban } = FUNCTION.jawabanGame;
//Db
const mess = SETTING.mess;
const tbkGmbr = [];
const tbkKata = [];
const caklon = [];
const ashotak = [];
const siapaaku = [];
const tatar = [];


moment.tz.setDefault("Asia/Jakarta").locale("id");
module.exports = async (conn, msg, m, setting, store) => {
    try {
        let { gamewaktu } = setting;
        const { type, quotedMsg, mentioned, now, fromMe, isBaileys } = msg;
        const tanggal = moment().tz("Asia/Jakarta").format("ll");
        const time = moment(new Date()).format("HH:mm");
        let dt = moment(Date.now()).tz("Asia/Jakarta").locale("id").format("a");
        const ucapanWaktu = "Selamat " + dt.charAt(0).toUpperCase() + dt.slice(1);
        if (isBaileys) return;
        var chats = type === "conversation" && msg.message.conversation ? msg.message.conversation : type === "imageMessage" && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : type === "videoMessage" && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : type === "extendedTextMessage" && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : type === "buttonsResponseMessage" && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : type === "templateButtonReplyMessage" && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : type === "messageContextInfo" ? msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId : type == "listResponseMessage" && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : "";
        if (chats == undefined) { chats = ""; }

        const prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(chats)
            ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi)
            : "#";
        const quoted = msg.quoted ? msg.quoted : msg;

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

        //RESPONSE LIST, BUTTON DLL
        var dataGroup =
            type === "buttonsResponseMessage"
                ? msg.message.buttonsResponseMessage.selectedButtonId
                : "";
        var dataPrivate =
            type === "messageContextInfo"
                ? msg.message.buttonsResponseMessage?.selectedButtonId ||
                msg.message.listResponseMessage?.singleSelectReply.selectedRowId
                : "";
        var dataListG =
            type === "listResponseMessage"
                ? msg.message.listResponseMessage.singleSelectReply.selectedRowId
                : "";
        var dataList =
            type === "messageContextInfo"
                ? msg.message.buttonsResponseMessage?.selectedButtonId ||
                msg.message.listResponseMessage?.singleSelectReply.selectedRowId
                : "";

        //RESPONSE IYA atau TIDAK
        const isButton = dataGroup.length !== 0 ? dataGroup : dataPrivate;
        const isListMessage = dataListG.length !== 0 ? dataListG : dataList;
        const isImage = type == "imageMessage";
        const isQuotedMsg = type == "extendedTextMessage";
        const isMedia = type === "imageMessage" || type === "videoMessage";
        const isQuotedImage = isQuotedMsg ? content.includes("imageMessage") ? true : false : false;
        const isVideo = type == "videoMessage";
        const isQuotedVideo = isQuotedMsg ? content.includes("videoMessage") ? true : false : false;
        const isSticker = type == "stickerMessage";
        const isQuotedSticker = isQuotedMsg ? content.includes("stickerMessage") ? true : false : false;
        const isQuotedAudio = isQuotedMsg ? content.includes("audioMessage") ? true : false : false;

        //MENTIONS
        const mentionByTag =
            type == "extendedTextMessage" &&
                msg.message.extendedTextMessage.contextInfo != null
                ? msg.message.extendedTextMessage.contextInfo.mentionedJid
                : [];
        const mentionByReply =
            type == "extendedTextMessage" &&
                msg.message.extendedTextMessage.contextInfo != null
                ? msg.message.extendedTextMessage.contextInfo.participant || ""
                : "";
        const mention =
            typeof mentionByTag == "string" ? [mentionByTag] : mentionByTag;
        mention != undefined ? mention.push(mentionByReply) : [];
        const mentionUser = mention != undefined ? mention.filter((n) => n) : [];

        //FUNCTION

        function monospace(string) {
            return "```" + string + "```";
        }
        const reply = (teks) => {
            conn.sendMessage(from, { text: teks }, { quoted: msg });
        };

        // Game
        cekWaktuGame(conn, tbkGmbr);
        cekWaktuGame(conn, tbkKata);
        cekWaktuGame(conn, caklon);
        cekWaktuGame(conn, ashotak);
        cekWaktuGame(conn, siapaaku);
        cekWaktuGame(conn, tatar);
        getJawaban(
            conn,
            from,
            msg,
            sender,
            chats,
            tbkGmbr,
            tbkKata,
            caklon,
            ashotak,
            siapaaku,
            tatar
        );

        //PESAN
        conn.readMessages([msg.key]);
            switch (command) {
                //MENU BOT
                case "menu":
                case "m":
                    menu(conn, msg, from, time, tanggal, runtime, prefix);
                    break;
                case "p":
                    const speed = require("performance-now");
                    let timestampe = speed();
                    let latensie = speed() - timestampe;
                    reply(`${latensie.toFixed(4)} detik`);
                    break;
                case "tagall":
                    if (!isGroup) return reply(mess.OnlyGrup);
                    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
                    let teks_tagall = `══✪〘 *👥 Tag All* 〙✪══\n\n${q ? q : ""}\n\n`;
                    for (let mem of participants) {
                        teks_tagall += `➲ @${mem.id.split("@")[0]}\n`;
                    }
                    conn.sendMessage(
                        from,
                        { text: teks_tagall, mentions: participants.map((a) => a.id) },
                        { quoted: msg }
                    );
                    break;
                case "hidetag":
                case "h":
                    if (!isGroup) return reply(mess.OnlyGrup);
                    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin);
                    let mem = [];
                    groupMembers.map((i) => mem.push(i.id));
                    conn.sendMessage(
                        from,
                        { text: q ? q : "", mentions: mem },
                        { quoted: msg }
                    );
                    break;
                //MENU GAME
                case "tebakgambar":
                    if (isPlayGame(from, tbkGmbr))
                        return reply(`Masih ada game yang belum diselesaikan`);
                    tebakgambar().then((data) => {
                        console.log(data);
                        var teks =
                            `*TEBAK GAMBAR*\n\n` +
                            monospace(
                                `Petunjuk : ${data.jawaban.replace(
                                    /[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi,
                                    "_"
                                )}\nWaktu : 60s`
                            );
                        conn
                            .sendMessage(
                                from,
                                { image: { url: data.img }, caption: teks },
                                { quoted: msg }
                            )
                            .then((res) => {
                                var jawab = data.jawaban.toLowerCase();
                                addPlayGame(
                                    from,
                                    "TEBAK GAMBAR",
                                    jawab,
                                    60,
                                    res,
                                    tbkGmbr,
                                    sender
                                );
                            });
                    });
                    break;
                case "tebakkata":
                    if (isPlayGame(from, tbkKata))
                        return reply(`Masih ada game yang belum diselesaikan`);
                    tebakkata().then((data) => {
                        console.log(data);
                        var teks =
                            `*TEBAK KATA*\n\n` +
                            monospace(
                                `Soal : ${data.soal}\nPetunjuk : ${data.jawaban.replace(
                                    /[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi,
                                    "_"
                                )}\nWaktu : ${gamewaktu}s`
                            );
                        conn
                            .sendMessage(from, { text: teks }, { quoted: msg })
                            .then((res) => {
                                var jawab = data.jawaban.toLowerCase();
                                addPlayGame(
                                    from,
                                    "TEBAK KATA",
                                    jawab,
                                    gamewaktu,
                                    res,
                                    tbkKata,
                                    sender
                                );
                            });
                    });
                    break;
                case "caklontong":
                    if (isPlayGame(from, caklon))
                        return reply(`Masih ada game yang belum diselesaikan`);
                    caklontong().then((data) => {
                        console.log(data);
                        var teks =
                            `*TEKA-TEKI CAK LONTONG*\n\n` +
                            monospace(
                                `Soal : ${data.soal}\nPetunjuk : ${data.jawaban.replace(
                                    /[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi,
                                    "_"
                                )}\nWaktu : ${gamewaktu}s`
                            );
                        conn
                            .sendMessage(from, { text: teks }, { quoted: msg })
                            .then((res) => {
                                var jawab = data.jawaban.toLowerCase();
                                var desk = data.deskripsi;
                                addPlayGame(
                                    from,
                                    "TEKA-TEKI CAK LONTONG",
                                    jawab,
                                    gamewaktu,
                                    res,
                                    caklon,
                                    sender,
                                    desk
                                );
                            });
                    });
                    break;
                case "asahotak":
                    if (isPlayGame(from, ashotak))
                        return reply(`Masih ada game yang belum diselesaikan`);
                    asahotak().then((data) => {
                        console.log(data);
                        var teks =
                            `*ASAH OTAK*\n\n` +
                            monospace(
                                `Soal : ${data.soal}\nPetunjuk : ${data.jawaban.replace(
                                    /[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi,
                                    "_"
                                )}\nWaktu : ${gamewaktu}s`
                            );
                        conn
                            .sendMessage(from, { text: teks }, { quoted: msg })
                            .then((res) => {
                                var jawab = data.jawaban.toLowerCase();
                                addPlayGame(
                                    from,
                                    "ASAH OTAK",
                                    jawab,
                                    gamewaktu,
                                    res,
                                    ashotak,
                                    sender
                                );
                            });
                    });
                    break;
                case "siapakahaku":
                    if (isPlayGame(from, siapaaku))
                        return reply(`Masih ada game yang belum diselesaikan`);
                    siapakahaku().then((data) => {
                        console.log(data);
                        var teks =
                            `*SIAPAKAH AKU?*\n\n` +
                            monospace(
                                `Soal : ${data.soal}\nPetunjuk : ${data.jawaban.replace(
                                    /[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi,
                                    "_"
                                )}\nWaktu : ${gamewaktu}s`
                            );
                        conn
                            .sendMessage(from, { text: teks }, { quoted: msg })
                            .then((res) => {
                                var jawab = data.jawaban.toLowerCase();
                                addPlayGame(
                                    from,
                                    "SIAPAKAH AKU?",
                                    jawab,
                                    gamewaktu,
                                    res,
                                    siapaaku,
                                    sender
                                );
                            });
                    });
                    break;
                case "tatarucingan":
                    if (isPlayGame(from, tatar))
                        return reply(`Masih ada game yang belum diselesaikan`);
                    const tatarJson = await fetchJson('https://asbatore.my.id/tatar.json')
                    var ucing = tatarJson[Math.floor(Math.random() * tatarJson.length)]
                    console.log(ucing);
                    var teks =
                        `*TATAR UCINGAN*\n\n` +
                        monospace(
                            `Soal : ${ucing.soal.split('(')[0]}\n\nArti: ${ucing.soal.split('(')[1]}\n\nPetunjuk : ${ucing.jawaban.replace(
                                /[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi,
                                "_"
                            )}\nWaktu : ${gamewaktu}s`
                        );
                    conn
                        .sendMessage(from, { text: teks }, { quoted: msg })
                        .then((res) => {
                            var jawab = ucing.jawaban.toLowerCase();
                            var desk = ucing.arti;
                            addPlayGame(
                                from,
                                "TATAR UCINGAN",
                                jawab,
                                gamewaktu,
                                res,
                                tatar,
                                sender,
                                desk
                            );
                        });
                    break;

                //MENU DOWNLOAD
                case 'ytmp4': case 'youtubemp4':
                case 'ytmp3': case 'youtubemp3':
                case 'fb': case 'facebook':
                case 'ig': case 'instagram':
                case 'tt': case 'tiktok':
                case 'twit': case 'twitter':
                    if (!q) return reply('Silahkan Sertakan Linknya!')
                    download(q, conn, msg, command)
                    break;

                //MENU PRIMBON
                case 'artinama':
                    if (!q) return reply('Namanya siapa.?')
                    artinama(q, conn, msg)
                    break;

                //MENU MAKER
                case "s": case "stiker": case "setiker": case "sticker":
                    if (((isMedia && !msg.message.videoMessage) || isQuotedImage) && args.length == 0) {
                        var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, "image");
                        var buffer = Buffer.from([]);
                        for await (const chunk of stream) {
                            buffer = Buffer.concat([buffer, chunk]);
                        }
                        stickerImg(buffer, conn, msg)
                    } else if (((isMedia && msg.message.videoMessage.seconds < 11) || (isQuotedVideo && msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11)) && args.length == 0
                    ) {
                        var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, "video");
                        var buffer = Buffer.from([]);
                        for await (const chunk of stream) {
                            buffer = Buffer.concat([buffer, chunk]);
                        }
                        stickerVideo(buffer, conn, msg)
                    } else {
                        reply(`Reply gambar/video/sticker dengan caption ${prefix + "sticker"} \n*(MAKSIMAL 10 DETIK!)*`);
                    }
                    break;
                case "toimg":
                    var stream = await downloadContentFromMessage(msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, "image");
                    var buffer = Buffer.from([]);
                    for await (const chunk of stream) {
                        buffer = Buffer.concat([buffer, chunk]);
                    }
                    conn.sendMessage(from, { image: buffer, caption: 'Done..' }, { quoted: msg })
                    break
                case 'smeme':
                    if (!q) return reply('kirim/reply gambar dengan caption .smeme (text)')
                    if (isImage || isQuotedImage) {
                        var media = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, "image");
                        var buffer = Buffer.from([]);
                        for await (const chunk of media) {
                            buffer = Buffer.concat([buffer, chunk]);
                        }
                        smeme(buffer, q, conn, msg)
                    } else {
                        reply(`Kirim gambar dengan caption ${prefix + command} text_atas|text_bawah atau balas gambar yang sudah dikirim`)
                    }
                    break;
                case 'toqr': case 'jadiqr':
                    if (!q) return reply('Harap sertakan text/link!')
                    toQR(q, conn, msg)
                    break;
                case "emojimix":
                    let text = q;
                    let [emoji1, emoji2] = text.split`+`;
                    if (!emoji1) reply(`Example : ${prefix + command} 😅+🤔`);
                    if (!emoji2) reply(`Example : ${prefix + command} 😅+🤔`);
                    emojiMix(q, conn, msg)
                    break;
                case 'removebg': case 'nobg': case 'snobg':
                    if (isQuotedImage || isImage) {
                        let img = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, "image");
                        var buffer = Buffer.from([]);
                        for await (const chunk of img) {
                            buffer = Buffer.concat([buffer, chunk]);
                        }
                        removeBg(buffer, conn, msg, command)
                    } else {
                        reply('Kirim/replay pesan gambar dengan caption .' + command)
                    }
                    break;
                //MENU SEARCH
                case "pinterest":
                case "pin":
                    if (!q) return reply("*Contoh*: _#pin kanao_");
                    pinterest(q).then((data) => {
                        console.log(data.length);
                        let lunk = data[Math.floor(Math.random() * data.length)];
                        var but = { image: { url: lunk }, caption: `*PINTEREST*\nHasil pencarian ${q}\n`, };
                        conn.sendMessage(from, but, { quoted: msg });
                    });
                    break;
                case "pinstick":
                    if (!q) return reply("*Contoh*: _#pinstick kanao_");
                    pinterest(q).then(async (data) => {
                        console.log(data.length);
                        let lunk = data[Math.floor(Math.random() * data.length)];
                        let buh = await getBuffer(lunk)
                        let buffers = await writeExifImg(buh, { packname: "Created By", author: "No Name", });
                        await conn.sendMessage(from, { sticker: { url: buffers } }, { quoted: msg });
                    });
                    break;
                case "quotestnime":
                    quotesAnime().then((res) => {
                        var dat = res[Math.floor(Math.random() * res.length)];
                        var pes = `*QUOTES ANIME*
                    
_*"${dat.quotes}"*_

_Anime_ : ${dat.anime}
_Karakter_ : ${dat.karakter}
_Episode_ : ${dat.episode}`;
                        reply(pes);
                    });
                    break;

                //MENU CEKID
                case 'cekidml': case 'ml':
                    var id = q.split('|')[0]
                    var zona = q.split('|')[1]
                    if (!q) return reply(`Contoh: ${command} 165534765|2214`)
                    ml(id, zona).then(res => {
                        reply(`*MOBILE LEGENDS*\n\n_ID_ = ${id}\n_Server_ = ${zona}\n_Nickname_ = ${res.data.replaceAll('\n', '')}`)
                    })
                    break
                case 'cekidff': case 'ff':
                    if (!q) return reply(`Contoh: ${command} 165534765`)
                    ff(q).then(res => {
                        reply(`*FREE FIRE*\n\n_ID_ = ${q}\n_Nickname_ = ${res.data.replaceAll('\n', '')}`)
                    })
                    break
                case 'cekidaov': case 'aov':
                    if (!q) return reply(`Contoh: ${command} 165534765`)
                    aov(q).then(res => {
                        reply(`*FREE FIRE*\n\n_ID_ = ${q}\n_Nickname_ = ${res.data.replaceAll('\n', '')}`)
                    })
                    break
                case 'cekidcodm': case 'codm':
                    if (!q) return reply(`Contoh: ${command} 165534765`)
                    codm(q).then(res => {
                        reply(`*CODM*\n\n_ID_ = ${q}\n_Nickname_ = ${res.data.replaceAll('\n', '')}`)
                    })
                    break
                case 'cekidsausage': case 'sausage':
                    if (!q) return reply(`Contoh: ${command} 165534765`)
                    sausage(q).then(res => {
                        reply(`*SAUSAGEMAN*\n\n_ID_ = ${q}\n_Nickname_ = ${res.data.replaceAll('\n', '')}`)
                    })
                    break
                case 'cekidgensin': case 'gensin':
                    if (!q) return reply(`Contoh: ${command} 165534765|ame\n\n *SERVER*\nASIA = asia\nAMERICA = ame\nEUROPA = eu\nTW / MO / HK = cn`)
                    var id = q.split('|')[0]
                    var zona = q.split('|')[1]
                    reply(`*SERVER*\n\nASIA = asia\nAMERICA = ame\nEUROPA = eu\nTW/MO/HK = cn`)
                    gensin(id, zona.toLowerCase()).then(res => {
                        reply(`*GENSHIN IMPACT*\n\n_ID_ = ${q}\n_Server_ = ${zona}\n_Nickname_ = ${res.data.replaceAll('\n', '')}`)
                    })
                    break
        }
    } catch (error) {
        console.log(error);
    }
};
