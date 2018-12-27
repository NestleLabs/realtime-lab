'use strict';
const Koa = require('koa');
const Router = require('koa-router');
const http = require('http');
const WebSocket = require('ws');

const router = new Router();
const app = new Koa();

const logInfo = (...args) => console.log("[INFO]", ...args);

const {exit, argv} = process;

function Usage() {
    console.log("Usage: -p <port>");
}

const cmd = (argv) => {
    const _args = argv.slice(2);
    if (!_args.length) return {};
    const [optionPort, port] = _args;
    if (optionPort !== '-p' || !port) {
        Usage(); exit(0);
    }
    return {
        port
    }
}

const appEnv = cmd(argv);

const httpServer = http.createServer(app.callback());

const socket = new WebSocket.Server({
    path: '/cable',
    server: httpServer
});

//socket.broadcast = function (data) {
//    socket.clients.forEach(client =>
//        client.readyState === socket.OPEN &&
//        client.send(data))
//}
socket.broadcast = function (data) {
    socket._clients.forEach(client => client.send(data))
}

function parseMessage(message) {
    try {
        return JSON.parse(message);
    } catch (err) {
        return message;
    }
}

socket.on('connection', (ws, req) => {
    logInfo(" [x] open socket ip " + req.connection.remoteAddress);
    socket._clients = socket._clients || [];
    socket._clients.push(ws);

    ws.on('message', (message) => {
        logInfo(" [x] Got Message. " + message);
        const msg = parseMessage(message);
        if (msg.type === "AI") {
            console.log(" [x] Boardcast by AI: ");
            socket.broadcast(JSON.stringify({message: msg.message}));
            return;
        }
        ws.send("pong");
    });
    ws.on('close', () => {
        logInfo(" [x] socket closed. ");
    });
});


router.get("/health", function (ctx, next) {
    logInfo(" [api] health");
    ctx.body = JSON.stringify({
        client_len: socket._clients && socket._clients.length,
        refs: "clients",
        clients: socket._client && socket._clients.map(e => ({...e}))
    });
});

app.use(router.routes())
    .use(router.allowedMethods());

const listener = httpServer.listen(appEnv.port, () => {
    const address = listener.address();
    logInfo('listening on port', address.port);
});

