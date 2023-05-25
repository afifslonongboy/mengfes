const axios = require('axios');

exports.ml = async (id, zona) => {
    var idGame = Number(id);
    var server = Number(zona);
    return axios.get(`https://solusi-media.my.id/api/ml.php?id=${idGame}&zone=${server}`)
        .then(function (response) {
            return response
        })
}

exports.ff = async (id) => {
    return axios.get('https://solusi-media.my.id/api/freefire?', {
        params: {
            id: id
        }
    })
        .then(function (response) {
            return response
        })
}

exports.aov = async (id) => {
    return axios.get('https://solusi-media.my.id/api/aov?', {
        params: {
            id: id
        }
    })
        .then(function (response) {
            return response
        })
}

exports.codm = async (id) => {
    return axios.get('https://solusi-media.my.id/api/codm.php?', {
        params: {
            id: id
        }
    })
        .then(function (response) {
            return response
        })
}

exports.sausage = async (id) => {
    return axios.get('https://solusi-media.my.id/api/sausage?', {
        params: {
            id: id
        }
    })
        .then(function (response) {
            return response
        })
}

exports.gensin = async (id, server) => {
    var idGame = Number(id);
    return axios.get('https://solusi-media.my.id/api/sausage?', {
        params: {
            id: idGame,
            server: 'os_'+server
        }
    })
        .then(function (response) {
            return response
        })
}