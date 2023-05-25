exports.status_Connection = async (Boom, update, connectToWhatsApp, DisconnectReason) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
        const shouldReconnect = (lastDisconnect.error = Boom)?.output?.statusCode !== DisconnectReason.loggedOut
        console.log('connection Terputus ', lastDisconnect.error, ', Menghubungkan ulang ', shouldReconnect)
        // reconnect if not logged out
        if (shouldReconnect) {
            connectToWhatsApp()
        }
    }
}