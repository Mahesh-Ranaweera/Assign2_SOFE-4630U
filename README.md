# Assign2_SOFE-4630U :: HIVE : Team Messaging WebApplication
Assignment 2: Cloud Computing

![Notebook Description](https://github.com/Mahesh-Ranaweera/Assign2_SOFE-4630U/blob/master/public/assets/hive_description.svg?sanitize=true)

## Web App Link
> <>

## Web-APP Features
* User Authentication
* Real-time team messaging service
* Create teams
* Join teams
* Get current weather report
    ```js
        >type in the messaging input

        ::get:weather <location>
        ::get:weather Toronto,ca
    ```
    * https://openweathermap.org api was used to get the weather information
* Create and share notes with team members
    ```js
        >type in the messaging input

        ::note:create <description of the note goes here>
        ::note:create This is the content of the note that is shared with the team
    ```

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

## Setting up AWS EC2 and adding Auto Scaling Group 
URL to dashboard: https://console.aws.amazon.com/ec2/ 
1. Choosing an Amazon Machine Image:
    - For this assignment I chose Ubuntu Server 16.04 LTS

2. Choose an Instance Type:
    - I chosed General Purpose, t2.micro instance

3. Configure Instance Details:
    - I launched a Auto Scaling Group from the number of instance section

4. Under Create Launch Configuration:
    - Named the launch configuration
    - Added a 8GB of storage to the instance

5. Create Auto Scaling Group:
    - Give a name to auto scaling group
    - Set the group size to 1
    - Under subnet I added availability zones
