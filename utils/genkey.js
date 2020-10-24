const fs = require('fs')
const forge = require('node-forge')
const pki = forge.pki;

function createCertificate(keys) {
    const attrs = [
        { name: 'commonName', value: 'example.org' },
        { name: 'countryName', value: 'US' },
        { shortName: 'ST', value: 'Virginia' },
        { name: 'localityName', value: 'Blacksburg' },
        { name: 'organizationName', value: 'Test' },
        { shortName: 'OU', value: 'Test' }
    ]

    const cert = pki.createCertificate();

    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

    cert.setSubject(attrs)
    cert.setIssuer(attrs);
    cert.setExtensions([
        { name: 'basicConstraints', cA: true },
        { name: 'keyUsage', keyCertSign: true, digitalSignature: true, nonRepudiation: true, keyEncipherment: true, dataEncipherment: true },
        { name: 'extKeyUsage', serverAuth: true, clientAuth: true, codeSigning: true, emailProtection: true, timeStamping: true },
        { name: 'nsCertType', client: true, server: true, email: true, objsign: true, sslCA: true, emailCA: true, objCA: true },
        { name: 'subjectAltName', altNames: [{ type: 6, value: 'http://example.org/webid#me' }, { type: 7, ip: '127.0.0.1' }] },
        { name: 'subjectKeyIdentifier' }
    ]);

    cert.sign(keys.privateKey)

    return cert
}

function main() {
    const keys = pki.rsa.generateKeyPair(2048);
    const cert = createCertificate(keys)

    const privateKey = pki.privateKeyToPem(keys.privateKey)
    const publicKey = pki.publicKeyToPem(keys.publicKey)
    const crtKey = pki.certificateToPem(cert);

    fs.writeFileSync("keypairs/private.pem", privateKey, 'utf8')
    fs.writeFileSync("keypairs/public.pub", publicKey, 'utf8')
    fs.writeFileSync("keypairs/certificate.pem", crtKey, 'utf8')
}

main()
