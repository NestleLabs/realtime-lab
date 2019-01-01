import "~/assets/index.scss";
import "bulmaswatch/materia/bulmaswatch.min.css";

export class App {
    constructor() {

    }

    mount () {
        function q(str) { return document.querySelector(str); }
        function parseTmpl(id, options) {
            return q(id).innerHTML.replace(/\{([^}]+)\}/g, function (_, ...args) {
                var val = options[args[0]];
                if (val) {
                    return val;
                }
                return args[0];
            });
        }
        function notice(action, msg) {
            var $notice = q("#notice");
            var classList = [...q("#notice").classList];
            $notice.setAttribute("class", classList.slice(0, -1).join(" "));
            $notice.innerHTML = parseTmpl("#notice_tmpl", {action, content: msg});
            var timer = setTimeout(function () {
                var tmpl = "";
                $notice.setAttribute("class", classList.join(" "));
                clearTimeout(timer);
            }, 1500);
        }
        document.addEventListener("DOMContentLoaded", function (evt) {

            var socket = null;
            q("#formA").addEventListener("submit", function (evt) {
                evt.preventDefault();
                const formSerialize = [...q("#formA").elements]
                    .filter(e => e.name).map(e => ({[e.name]: e.value}));
                q("#formA").reset();
                notice("reset", "重置表单");
                if (socket) {
                    socket.send(JSON.stringify(formSerialize));
                    console.log(" [x] Sent to socket: ", JSON.stringify(formSerialize));
                } else {
                    console.log("DEBUG form: ", JSON.stringify(formSerialize));
                }
            });
            q("#ws").addEventListener("click", function (evt) {
                q("#ws-status").innerText = (evt.target.checked ? "开启" : "关闭");
                const socketCtrl = _ => {
                    if (evt.target.checked) {
                        if (socket) return;
                        socket = new WebSocket("ws://localhost:3000/cable");
                        Object.assign(socket,{
                            onopen (evt) {
                                console.log("Connecting open ..");
                                socket.interval = setInterval(function () {
                                    socket.send("ping");
                                }, 1000);
                            },
                            onmessage (evt) {
                                console.log("DEBUG [.] Received Message: " + JSON.stringify(evt.data));
                                if (evt.data === "reconnect") {
                                    if (socket.readyState === socket.OPEN ||
                                        socket.readyState === socket.CONNECTING) {
                                        console.log("DEBUG [.] Received reconnect ret");
                                        socket.close();
                                    }
                                    console.log("DEBUG [.] Received Message to reconnect");
                                }
                            },
                            onclose (evt) {
                                clearInterval(socket.interval);
                                socket = null;
                                console.log("DEBUG [.] Connection closed. " + JSON.stringify(evt.data));
                            },
                        });
                    } else {
                        socket.close();
                    }
                }
                socketCtrl();
                notice("switch", "开启WebSocket");
            });
        });
    }

    static $mount () {
        return (new App()).mount();
    }
};

export default App.$mount();

