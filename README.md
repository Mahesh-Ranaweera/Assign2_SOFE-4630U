# Assign2_SOFE-4630U :: HIVE : Team Messaging WebApplication
Assignment 2: Cloud Computing

## Web App Link
> http://ec2-35-182-243-223.ca-central-1.compute.amazonaws.com:3000

## Web-APP Features
* User Authentication
* Real-time team messaging service
* Create teams
* Join teams
* Get current weather report
* Create and share notes with team members

![Notebook Description](https://github.com/Mahesh-Ranaweera/Assign2_SOFE-4630U/blob/master/public/assets/hive_description.svg?sanitize=true)

## Setting up the application for local testing
### Install Prerequisite
- NodeJS
- Rethinkdb

1. Setting up Rethinkdb(Open-source database for realtime web)
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

2. Download the source files
```sh
    git clone git@github.com:Mahesh-Ranaweera/Assign2_SOFE-4630U.git

    cd Assign2_SOFE-4630U

    npm install
    npm install nodemon -g
```

3. Start Rethinkdb and WebApp
```sh
    rethinkdb

    nodemon npm start

    >> Navigate to localhost:3000 : for the webapp
    >> Navigate to localhost:8080 : for the rethinkdb admin site
```