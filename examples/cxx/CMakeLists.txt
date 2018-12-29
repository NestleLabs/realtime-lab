cmake_minimum_required(VERSION 3.0)

set(CMAKE_CXX_COMPILER g++)
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS ON)

project(chat-server)

include(ExternalProject)

set(EXTERNAL_INSTALL_LOCATION ${CMAKE_BINARY_DIR}/external)

ExternalProject_Add(asio
	PREFIX "vendor/asio"
    GIT_REPOSITORY git@github.com:chriskohlhoff/asio.git
    GIT_TAG "asio-1-12-2"
    EXCLUDE_FROM_ALL TRUE
    CONFIGURE_COMMAND ""
    BUILD_COMMAND ""
)

ExternalProject_Add(websocketpp
	PREFIX "vendor/websocketpp"
    GIT_REPOSITORY git@github.com:zaphoyd/websocketpp.git
    #CMAKE_ARGS -DCMAKE_INSTALL_PREFIX=${EXTERNAL_INSTALL_LOCATION}
    GIT_TAG "0.8.1"
    #EXCLUDE_FROM_ALL TRUE
    #BUILD_ALWAYS FALSE
    #CONFIGURE_COMMAND ""
    #BUILD_COMMAND ""
)

ExternalProject_Add(json
	PREFIX "vendor/json"
    GIT_REPOSITORY git@github.com:nlohmann/json.git
    #CMAKE_ARGS -DCMAKE_INSTALL_PREFIX=${EXTERNAL_INSTALL_LOCATION}
    GIT_TAG "v3.5.0"
    #EXCLUDE_FROM_ALL TRUE
    #BUILD_ALWAYS FALSE
    #CONFIGURE_COMMAND ""
    #BUILD_COMMAND ""
)
include_directories("vendor/asio/src/asio/asio/include" ${EXTERNAL_INSTALL_LOCATION}/include )
link_directories(${EXTERNAL_INSTALL_LOCATION}/lib)

add_definitions(-DASIO_STANDALONE)
add_executable(chat-server main.cxx)
add_dependencies(chat-server websocketpp json)
