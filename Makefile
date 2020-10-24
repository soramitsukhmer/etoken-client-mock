main: cert server

server:
	@node index.js

cert:
	@node utils/genkey.js
	@openssl x509 -outform der \
		-in keypairs/certificate.pem \
		-out keypairs/certificate.crt

clean:
	@rm keypairs/*.{crt,pem,pub} || true
