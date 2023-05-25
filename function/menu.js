exports.menu = async (conn, msg, from, jam, tanggal, runtime, prefix) => {
    var tx = `↤↤↤↤↤{ａｓｂ－ｂｏｔ}↦↦↦↦↦

 *Jam* : _${jam} WIB_
 *Tanggal* : _${tanggal}_
 *Runtime* : _${runtime(process.uptime())}_
 
╭─「 *MENU GRUP* 」
│↦  ${prefix}p
│↦  ${prefix}hidetag/h
│↦  ${prefix}tagall
╰─────────⭓

╭─「 *MENU CEKID* 」
│↦  ${prefix}ml/cekidml (id/zona)
│↦  ${prefix}ff/cekidff (id)
│↦  ${prefix}aov/cekidaov (id)
│↦  ${prefix}codm/cekidcodm (id)
│↦  ${prefix}sausage/cekidsausage (id)
│↦  ${prefix}gensin/cekidgensin (uid/server)
╰─────────⭓

╭─「 *MENU MAKER* 」
│↦  ${prefix}toqr (text/link/nomor)
│↦  ${prefix}s/stiker (gambar)
│↦  ${prefix}snobg (gambar)
│↦  ${prefix}smeme (gambar & text)
│↦  ${prefix}emojimix (emoji1 + emoji2)
│↦  ${prefix}removebg (gambar)
╰─────────⭓

╭─「 *MENU DOWNLOAD* 」
│↦  ${prefix}ytmp4/youtubemp4 (link)
│↦  ${prefix}ytmp3/youtubemp3 (link)
│↦  ${prefix}ig/instagram (link)
│↦  ${prefix}fb/facebook (link)
│↦  ${prefix}tt/tiktok (link)
│↦  ${prefix}twit/twitter (link)
╰─────────⭓

╭─「 *MENU GAME* 」
│↦  ${prefix}caklontong
│↦  ${prefix}tebakgambar
│↦  ${prefix}tebakkata
│↦  ${prefix}asahotak
│↦  ${prefix}siapakahaku
╰─────────⭓

╭─「 *MENU CONVERT* 」
│↦  ${prefix}toimg (reply sticker)
╰─────────⭓

╭─「 *MENU SEARCH* 」
│↦  ${prefix}quotesanime
│↦  ${prefix}pin/pinterest (query)
│↦  ${prefix}pinstick (query)
╰─────────⭓
`
    await conn.sendMessage(from, {text : tx}, { quoted: msg })
}