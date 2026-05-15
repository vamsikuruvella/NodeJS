const http = require('http');

const server = http.createServer(function (req, res) {
    // console.log(req.url);
    if (req.url === "/getSecretData") {
        res.end("No secret data");
    }
    else {
        res.end('Hello World!');
    }
});



server.listen(7777);