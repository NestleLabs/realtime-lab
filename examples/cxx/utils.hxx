#ifndef _CHAT_SERVER_UTILS_HXX_
#define _CHAT_SERVER_UTILS_HXX_


/**
 * Example:
 * int main (int argc, char *argv) {
 * for (const char *argv: argv_range(argc, argv)) {
 *    cout << argv << endl;
 * }
 *
 **/

class argv_range {
    public:
        argv_range(int argc, const char * const *argv)
         : argc_(argc), argv_(argv)
        {}

        const char * const *begin() const { return argv_; }
        const char * const *end() const { return argv_ + argc_; }
    private:
        const int argc_;
        const char * const *argv_;
};

#endif
