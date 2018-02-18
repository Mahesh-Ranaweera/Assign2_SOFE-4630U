# Assign2_SOFE-4630U
Assignment 2 SOFE-4630U

### SETTING UP RETHINKDB
```
    sudo pip install "mitmproxy==0.18.2"
    mitmproxy

    sudo apt-get install build-essential protobuf-compiler python \
                     libprotobuf-dev libcurl4-openssl-dev \
                     libboost-all-dev libncurses5-dev \
                     libjemalloc-dev wget m4

    wget https://download.rethinkdb.com/dist/rethinkdb-2.3.6.tgz
    tar xf rethinkdb-2.3.6.tgz

    cd rethinkdb-2.3.6
    ./configure --allow-fetch
    sudo make
    sudo make install
```