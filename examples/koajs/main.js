'use strict';
const Koa = require('koa');
const Router = require('koa-router');
const router = new Router();
const http = require('http');
const app = new Koa();
const logInfo = (...args) => console.log("[INFO]", ...args);

const {exit, argv} = process;

function Usage() {
    console.log("Usage: -p <port>");
}

const cmd = (argv) => {
    const _args = argv.slice(1);
    if (_args[1] !== '-p') {
        Usage();
        exit(0);
    } else {
        const port = _args[2];
        if (!port) {
            Usage();
            exit(0);
        }
        logInfo(`port: ${port}`);
    }
}

cmd(argv);

router.get('/cable', (ctx, future) => {
    ctx.body = 'OK';
    ctx.status = 200;
});

app.use(router.routes())
    .use(router.allowedMethods());

const httpServer = http.createServer(app.callback());
const listener = httpServer.listen(3000, () => {
    const address = listener.address();
    logInfo('listening on port %s', address.port);
});
