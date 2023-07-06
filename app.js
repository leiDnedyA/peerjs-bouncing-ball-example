const express = require("express");
const { ExpressPeerServer } = require("peer");

const app = express();

const PORT = 8080;

app.use(express.static('src'));

const server = app.listen(PORT);

const peerServer = ExpressPeerServer(server, {
    debug: true,
    allow_discovery: true,
    proxied: true
});

peerServer.on('connection', (client) => {
    console.log(client);
})

app.use("/peerjs", peerServer);