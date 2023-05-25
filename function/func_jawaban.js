const { getJawabanGame, isPlayGame, getGamePosi, getDescripsi } = require('./func_game')

exports.getJawaban = (conn, from, msg, sender, chats, tbkGmbr, tbkKata, caklon,ashotak,siapaaku,tatar) => {
    if (isPlayGame(from, tbkGmbr)) {
            if (chats.toLowerCase() == getJawabanGame(from, tbkGmbr)) {
                var cap = `*TEBAK GAMBAR*\n*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${getJawabanGame(from, tbkGmbr)}`
                conn.sendMessage(from, {text: cap}, { quoted: msg })
                tbkGmbr.splice(getGamePosi(from, tbkGmbr), 1)
            
        }
    }
    if (isPlayGame(from, tbkKata)) {
            if (chats.toLowerCase() == getJawabanGame(from, tbkKata)) {
                var cap = `*TEBAK KATA*\n*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${getJawabanGame(from, tbkKata)}`
                conn.sendMessage(from, {text: cap}, { quoted: msg })
                tbkKata.splice(getGamePosi(from, tbkKata), 1)
            
        }
    }
    if (isPlayGame(from, caklon)) {
            if (chats.toLowerCase() == getJawabanGame(from, caklon)) {
                var cap = `*TEKA-TEKI CAK LONTONG*\n*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${getJawabanGame(from, caklon)}\n_${getDescripsi(from, caklon)}_`
                console.log(getGamePosi(from, caklon));
                conn.sendMessage(from, {text: cap}, { quoted: msg })
                caklon.splice(getGamePosi(from, caklon), 1)
            
        }
    }
    if (isPlayGame(from, ashotak)) {
        if (chats.toLowerCase() == getJawabanGame(from, ashotak)) {
            var cap = `*ASAH OTAK*\n*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${getJawabanGame(from, ashotak)}`
            conn.sendMessage(from, { text: cap }, { quoted: msg })
            ashotak.splice(getGamePosi(from, ashotak), 1)

        }
    }
    if (isPlayGame(from, siapaaku)) {
        if (chats.toLowerCase() == getJawabanGame(from, siapaaku)) {
            var cap = `*SIAPAKAH AKU*\n*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${getJawabanGame(from, siapaaku)}`
            conn.sendMessage(from, { text: cap }, { quoted: msg })
            siapaaku.splice(getGamePosi(from, siapaaku), 1)

        }
    }

    if (isPlayGame(from, tatar)) {
        if (chats.toLowerCase() == getJawabanGame(from, tatar)) {
            var cap = `*TATAR UCINGAN*\n*Selamat Jawaban Kamu Benar 🎉*\n\nJawaban : ${getJawabanGame(from, tatar)}\nArti: ${getDescripsi(from, tatar)}`
            conn.sendMessage(from, { text: cap }, { quoted: msg })
            tatar.splice(getGamePosi(from, tatar), 1)

        }
    }
}