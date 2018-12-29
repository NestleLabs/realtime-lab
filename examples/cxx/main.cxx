#include <iostream>
#include <websocketpp/config/asio_no_tls.hpp>
#include <websocketpp/server.hpp>
#include <nlohmann/json.hpp>

#include <cstdlib>

using namespace std;

typedef websocketpp::server<websocketpp::config::asio> server;

using websocketpp::lib::placeholders::_1;
using websocketpp::lib::placeholders::_2;
using websocketpp::lib::bind;

typedef server::message_ptr message_ptr;

void on_message(server* s, websocketpp::connection_hdl hdl, message_ptr msg) {
    cout << "on_message called with hdl: " << hdl.lock().get() << endl;
    cout << "message: " << msg->get_payload() << endl;

    if (msg->get_payload() == "stop-listening") {
        s->stop_listening();
        return ;
    }

    try {
        s->send(hdl, msg->get_payload(), msg->get_opcode());
    } catch (websocketpp::exception const & e) {
        cout << "Echo failed because: "
                  << "(" << e.what() << ")" << std::endl;
    }
}

class ArgvRange{
    public:
        ArgvRange(int argc, const char * const argv[])
            : argc_(argc), argv_(argv)
        {
        }

        const char * const *begin() const { return argv_; }
        const char * const *end() const { return argv_ + argc_; }

    private:
        const int argc_;
        const char * const *argv_;
};

int main(int argc, char** argv) {
    server echo_server;
    string portOption(argv[1]);
    if (argc < 2 || portOption != "-p") {
        cout << "Usage: -p <port>" << endl;
        return 0;
    }

    auto port = atoi(argv[2]);
    cout << "listening on " << port << endl;

    try {
        echo_server.set_access_channels(websocketpp::log::alevel::all);
        echo_server.clear_access_channels(websocketpp::log::alevel::frame_payload);

        echo_server.init_asio();
        echo_server.set_message_handler(bind(&on_message, &echo_server, ::_1, ::_2));

        echo_server.listen(port);
        echo_server.start_accept();
        echo_server.run();
    } catch (websocketpp::exception const & e) {
        cout << e.what() << endl;
    } catch (...) {
        cout << "other exception" << endl;
    }
    return 0;
}
