const forge = require('node-forge')
const pki = forge.pki

// generate a keypair and create an X.509v3 certificate
var keys = pki.rsa.generateKeyPair(2048);
var cert = pki.createCertificate();
cert.publicKey = keys.publicKey;
// alternatively set public key from a csr
//cert.publicKey = csr.publicKey;
// NOTE: serialNumber is the hex encoded value of an ASN.1 INTEGER.
// Conforming CAs should ensure serialNumber is:
// - no more than 20 octets
// - non-negative (prefix a '00' if your value starts with a '1' bit)
cert.serialNumber = '01';
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
var attrs = [{
    name: 'commonName',
    value: 'example.org'
}, {
    name: 'countryName',
    value: 'US'
}, {
    shortName: 'ST',
    value: 'Virginia'
}, {
    name: 'localityName',
    value: 'Blacksburg'
}, {
    name: 'organizationName',
    value: 'Test'
}, {
    shortName: 'OU',
    value: 'Test'
}];
cert.setSubject(attrs);
// alternatively set subject from a csr
//cert.setSubject(csr.subject.attributes);
cert.setIssuer(attrs);
cert.setExtensions([{
    name: 'basicConstraints',
    cA: true
}, {
    name: 'keyUsage',
    keyCertSign: true,
    digitalSignature: true,
    nonRepudiation: true,
    keyEncipherment: true,
    dataEncipherment: true
}, {
    name: 'extKeyUsage',
    serverAuth: true,
    clientAuth: true,
    codeSigning: true,
    emailProtection: true,
    timeStamping: true
}, {
    name: 'nsCertType',
    client: true,
    server: true,
    email: true,
    objsign: true,
    sslCA: true,
    emailCA: true,
    objCA: true
}, {
    name: 'subjectAltName',
    altNames: [{
        type: 6, // URI
        value: 'http://example.org/webid#me'
    }, {
        type: 7, // IP
        ip: '127.0.0.1'
    }]
}, {
    name: 'subjectKeyIdentifier'
}]);
/* alternatively set extensions from a csr
var extensions = csr.getAttribute({name: 'extensionRequest'}).extensions;
// optionally add more extensions
extensions.push.apply(extensions, [{
  name: 'basicConstraints',
  cA: true
}, {
  name: 'keyUsage',
  keyCertSign: true,
  digitalSignature: true,
  nonRepudiation: true,
  keyEncipherment: true,
  dataEncipherment: true
}]);
cert.setExtensions(extensions);
*/
// self-sign certificate
cert.sign(keys.privateKey);

// convert a Forge certificate to PEM
var pem = pki.certificateToPem(cert);

// convert a Forge certificate from PEM
var cert = pki.certificateFromPem(pem);

// convert a Forge certificate to an ASN.1 X.509v3 object
var asn1Cert = pki.certificateToAsn1(cert);

console.log(pem)
