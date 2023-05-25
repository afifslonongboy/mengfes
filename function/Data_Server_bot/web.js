exports.getQr = (qr, io) => {
    io.on('connection', function (socket) {
        socket.emit('qr', qr)
    })
}

exports.open = (io) => {
    io.on('connection', function (socket) {
        socket.emit('open', '');
    })
}

exports.msgWeb = (io, nama, no, pesan) => {
    io.on('connection', function (socket) {
        socket.emit('message', `Pesan Dari ${nama}/${no} === ${pesan}`);
    })
}