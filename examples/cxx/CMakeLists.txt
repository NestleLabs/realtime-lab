cmake_minimum_required(VERSION 3.0)

set (CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11 -lstdc++")
set(CMAKE_CXX_COMPILER g++)
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS ON)
project(chat-server)
#add_compile_options(-std=c++11)

include(ExternalProject)

set(EXTERNAL_INSTALL_LOCATION ${CMAKE_BINARY_DIR}/external)

ExternalProject_Add(websocketpp
	PREFIX "vendor/websocketpp"
    GIT_REPOSITORY git@github.com:zaphoyd/websocketpp.git
    CMAKE_ARGS -DCMAKE_INSTALL_PREFIX=${EXTERNAL_INSTALL_LOCATION}
    GIT_TAG "0.8.1"
    EXCLUDE_FROM_ALL TRUE
)

ExternalProject_Add(json
	PREFIX "vendor/json"
    GIT_REPOSITORY git@github.com:nlohmann/json.git
    CMAKE_ARGS -DCMAKE_INSTALL_PREFIX=${EXTERNAL_INSTALL_LOCATION}
    GIT_TAG "v3.5.0"
    EXCLUDE_FROM_ALL TRUE
)

include_directories(${EXTERNAL_INSTALL_LOCATION}/include)
link_directories(${EXTERNAL_INSTALL_LOCATION}/lib)

add_executable(chat-server main.cxx)
add_dependencies(chat-server websocketpp json)
#target_link_libraries(chat-server websocketpp json -Lstd=c++11)
