const qrcode = require('qrcode')
const { fetchJson, getBuffer, getRandom } = require('../func_server')
const { writeExifImg, writeExifVid } = require('../exif')
const { UploadFileUgu} = require('../uploader_media')
const fs = require('fs')

const FormData = require('form-data');
const https = require('https')
const axios = require('axios');
axios.defaults.httpsAgent = new https.Agent({
    rejectUnauthorized: false,
})
const { removeBackgroundFromImageBase64, removeBackgroundFromImageUrl, removeBackgroundFromImageFile } = require('remove.bg')

exports.toQR = async (query, conn, msg) => {
    let qyuer = await qrcode.toDataURL(query, { scale: 35 });
    let data = new Buffer.from(qyuer.replace("data:image/png;base64,", ""), "base64");
    let buff = 'toQR.jpg'
    await fs.writeFileSync("./storage/" + buff, data);
    let medi = fs.readFileSync("./storage/" + buff);
    await conn.sendMessage(msg.from, { image: medi, caption: "Success✓!" }, { quoted: msg });
    setTimeout(() => {
        fs.unlinkSync("./storage/" + buff);
    }, 10000);
}

exports.stickerImg = async (media, conn, msg) => {
    let buffers = await writeExifImg(media, {
        packname: "Created By",
        author: "No Name",
    });
    conn.sendMessage(msg.from, { sticker: { url: buffers } }, { quoted: msg });
}

exports.stickerVideo = async (media, conn, msg) => {
    let buffers = await writeExifVid(media, {
        packname: "Created", author: "No Name",
    });
    conn.sendMessage(msg.from, { sticker: { url: buffers } }, { quoted: msg });
}

exports.smeme = async (buffer, q, conn, msg) => {
    let nama = getRandom('.png')
    fs.writeFileSync('./storage/'+nama, buffer)
    var media_url = await UploadFileUgu('storage/'+nama)
    let meme_url = ''
    let tex = q;
    let [teks1, teks2] = tex.split`|`;
    if (teks1 && teks2) {
         meme_url = `https://api.memegen.link/images/custom/${encodeURIComponent(teks1)}/${encodeURIComponent(teks2)}.png?background=${media_url.url}`
    } else if (!teks1) {
         meme_url = `https://api.memegen.link/images/custom/_/${encodeURIComponent(teks2)}.png?background=${media_url.url}`
    }else if (!teks2) {
         meme_url = `https://api.memegen.link/images/custom/${encodeURIComponent(teks1)}/_.png?background=${media_url.url}`
    } else {
        meme_url = `https://api.memegen.link/images/custom/${encodeURIComponent(q)}/_.png?background=${media_url.url}`
    }
    let buh = await getBuffer(meme_url)
    let buffers = await writeExifImg(buh, { packname: "Created By", author: "No Name", });
    await conn.sendMessage(from, { sticker: { url: buffers } }, { quoted: msg });
    fs.unlinkSync('./storage/'+nama)
}

exports.emojiMix = async (query, conn, msg) => {
    let text = query;
    let [emoji1, emoji2] = text.split`+`;
    let anu = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`);
    for (let res of anu.results) {
        let xm_za = res.url;
        let hek = await getBuffer(xm_za);
        let buffers = await writeExifImg(hek, {
            packname: "Created BY",
            author: "No-Name",
        });
        await conn.sendMessage(msg.from, { sticker: { url: buffers } }, { quoted: msg });
    }
}

exports.removeBg = async (media, conn, msg, command) => {
    conn.sendMessage(msg.from, { text: '*_Proses...._*' }, { quoted: msg })
    let ranE = getRandom('.jpg')
    await fs.writeFileSync('./storage/' + ranE, media)
    const _buff = './storage/' + ranE
    let anu = await remove(fs.readFileSync(_buff))
    console.log(anu)
    if (command == 'snobg') {
        let buffers = await writeExifVid(anu, {
            packname: "Created", author: "No Name",
        });
       await conn.sendMessage(msg.from, { sticker: { url: buffers } }, { quoted: msg });
    } else {
        await conn.sendMessage(msg.from, { image: { url: buff }, caption: "Success✓!" }, { quoted: msg })
    }
    setTimeout(() => { fs.unlinkSync(buff) }, 10000)
    setTimeout(() => { fs.unlinkSync(_buff) }, 10000)
}



//GAMBAR
async function remove(input) {
    try {
        const apis = ['zNKnayDFH1nugtA81fkPMzXn', '5CyygkXiT5vrki2Z6ZsUCE8u', 'Mz4yJkagrCLotdgsr4Ms39ud', 'vEeWnzQws9kJoYNMYKhbT1s6', '2arViktax9HUdMqy9U7wFLKT', 'sfZpRHNwVPAG57nZVHijYZ9v', 'oqVVyQ2rBDYdUrxThg4GdjhA', 'rGp4axHpQ56Y5tRLX7J789QC', 'NfPx6NgTkpVYLnKUZHCAM1P3']
        const response = await removeBackgroundFromImageBase64({
            base64img: input.toString('base64'),
            apiKey: apis[Math.floor(Math.random() * apis.length)],
            size: 'auto',
            type: 'auto',
        })
        return Buffer.from(response.base64img, 'base64')
    } catch (error) {
        console.log(error)
    }
}

//VIDEO
async function unscreen(input) {
    const UNSCREEN_API_VIDEOS_URL = "https://api.unscreen.com/v1.0/videos";
    const apiss = ['N6J4Bjbyh2V4eqhAPTWYtFER', 'fcKJkPstNXp4pjntYt3bR38E']
    const API = apiss[Math.floor(Math.random() * apiss.length)]
    try {
        const form = new FormData();

        var headers = form.getHeaders();
        headers['X-Api-Key'] = API;

        const data = await axios({
            url: UNSCREEN_API_VIDEOS_URL,
            method: "POST",
            headers: {
                headers
            },
            data: input,
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity,
        })
            .then(function (response) {
                // handle success
                return response.data
            })
    } catch (err) {
        console.log('gagal')
    }

}