const http = require('http');
const url = require('url');
let messages = require('./messages.js');
let dictionary = {};
let getReqCounter = 0;
let postReqCounter = 0;


class Server {
    constructor() {
        this.port = process.env.PORT || 3000;
    }

    start() {
        http.createServer((req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', '*');
            let q = url.parse(req.url, true);

            if (q.pathname === '/api/definitions') {
                if (req.method === 'GET') {
                    let word = q.query.word;
                    if ( dictionary[word] === undefined) {
                        res.writeHead(404, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: messages.userMessages.wordNotFound }));
                    } else {
                        getReqCounter++;
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ word: word, definition: dictionary[word], reqNum : getReqCounter }));
                    }


                } else if (req.method === 'POST') {
                    let body = "";
                    req.on('data', function (data) {
                        if (data != null)
                            body += data;
                    });
                    req.on('end', function () {
                        let q = JSON.parse(body);
                        let word = q['word'];
                        let definition =q['definition'];
                        let resualt = '';
                        if (word != null && definition != null && dictionary[word] === undefined) {
                            postReqCounter++;
                            dictionary[word] = definition;
                            res.writeHead(200, { 'Content-Type': 'text/plain' });
                            resualt= messages.userMessages.wordAdded;
                        } else {
                            res.writeHead(201, { 'Content-Type': 'text/plain' });
                            resualt = messages.userMessages.wordExist;
                        }
                        res.end(JSON.stringify({ message: resualt, reqNum : postReqCounter}));
                    });
                }

            } else {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`<h1>${messages.userMessages.error}</h1>`);
            }

        }).listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }

    
}

const server = new Server();
server.start();
