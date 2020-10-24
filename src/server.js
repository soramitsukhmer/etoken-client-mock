const fs = require('fs');
const crypto = require('crypto');

const WebSocket = require('ws');
const eToken = require('./eToken');

const { stringify } = JSON

function createMockServer() {
    const privateKey = loadPrivateKey()

    const publicKey = crypto.createPublicKey({ key: privateKey })
    const certchain = publicKey.export({ type: 'pkcs1', format: 'der' }).toString('base64')

    const wss = new WebSocket.Server({
        port: 44331,
        path: '/token'
    });

    const token = new eToken({ privateKey })

    wss.on('listening', () => console.log('Server is listening on port ws://localhost:44331/token\n' + timestamp() + "\n"))
    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            const signature = token.sign(message)
            const payload = {
                certchain: certchain,
                signature: signature,
                signeddata: message
            }
            ws.send(stringify(payload))
            logger.request(message, payload)
        });
    });
}

function loadPrivateKey(key = 'keypairs/private.pem') {
    const privateKey = fs.readFileSync(key)

    return crypto.createPrivateKey({
        key: privateKey,
        format: 'pem'
    })
}

function timestamp() {
    return new Date()
}

const logger = {
    request(message, payload = {}) {
        console.warn('Message: ' + message)
        console.warn('Requested at: ' + timestamp())
        console.log('-----BEGIN PAYLOAD-----')
        console.log(payload)
        console.log('-----END PAYLOAD-----')
        console.log('\n')
    }
}

module.exports = createMockServer
