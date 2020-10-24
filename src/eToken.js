const crypto = require('crypto');

class eToken {
    /**
     *
     * @param {{ privateKey: crypto.KeyObject }} options
     */
    constructor(options = { privateKey: null }) {
        this.privateKey = options.privateKey
    }

    encrypt() {}

    decrypt() {}

    sign(data) {
        const privateKey = this.privateKey
        const bufferData = Buffer.from(data)

        const signature = crypto.sign("sha256", bufferData, {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        })

        return signature.toString("base64")
    }
}

module.exports = eToken
