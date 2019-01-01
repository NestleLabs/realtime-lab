#ifndef _CHAT_SERVER_UTILS_HXX_
#define _CHAT_SERVER_UTILS_HXX_

#include <iostream>
/**
 * Example:
 * int main (int argc, char *argv) {
 * for (const char *argv: argv_range(argc, argv)) {
 *    cout << argv << endl;
 * }
 *
 **/

template<class T>
class argv_range {
    public:
        argv_range(int argc, const T * const *argv)
         : argc_(argc), argv_(argv)
        {}

        const T * const *begin() const { return argv_; }
        const T * const *end() const { return argv_ + argc_; }

    private:
        const int argc_;
        const T * const *argv_;

    public:
        friend std::ostream& operator<< (std::ostream& stream, const argv_range& self) {
            for (const T *argv: self) {
                stream << argv << std::endl;
            }
            return stream;
        }
};

#endif
