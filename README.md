
# Scheduler

## Table of content
+ [Overview](#overview)
+ [Prerequisites](#prerequisites)
+ [Installation](#installation)
    - [Using docker compose with the backend (Recommended)](#using-docker-compose-with-the-backend)
    - [Stand-alone from DockerHub](#stand-alone-from-dockerhub)
    - [Stand-alone build your own image](#stand-alone-build-your-own-image)
    - [Stand-alone from source](#stand-alone-from-source)


## Overview

A frontend to [Scheduler](https://github.com/mohamednehad450/Scheduler) built with [NextJS](https://nextjs.org/)


## Prerequisites
- Install git
    ```
    sudo apt install git
    ```
- Install Docker (if not building from source)
    1. Install docker
        ```
        curl -sSL https://get.docker.com | sh
        ```
    2. Allow Docker to be used without being a root
        ```
        sudo usermod -aG docker $USER
        ```
    3. Restart
        ``` 
        reboot
        ```


## Installation

### Using docker compose with [the backend](https://github.com/mohamednehad450/Scheduler)

1. Clone this project
    ```
    git clone https://github.com/mohamednehad450/Scheduler-Frontend.git
    cd Scheduler-Frontend
    ```
2. Create `.env` file and add TOKEN_KEY to it 
    ```
    echo TOKEN_KEY=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 50) > .env
    ```
3. Start docker compose
    ```
    docker compose up
    ```

### Stand-alone from DockerHub
1. Create the container
    ```
    docker container create --name scheduler_frontend_container -p 3000:3000 mohamednehad450/scheduler-frontend:1.0
    ```
2. Start the container
    ```
    docker start scheduler_frontend_container
    ```

### Stand-alone build your own image
1. Clone this project
    ```
    git clone https://github.com/mohamednehad450/Scheduler-Frontend.git
    cd Scheduler-Frontend
    ```
2. Build the image 
    ``` 
    docker build -t scheduler-frontend .
    ```
3. Create the container
    ```
    docker container create --name scheduler_frontend_container -p 3000:3000 scheduler-frontend
    ```
4. Start the container
    ```
    docker start scheduler_frontend_container
    ```

### Stand-alone from source
1. Install node 18 using [nvm](https://github.com/nvm-sh/nvm) or from [here](https://nodejs.org/en/download/)

2. Clone this project
    ```
    git clone https://github.com/mohamednehad450/Scheduler-Frontend.git
    cd Scheduler-Frontend
    ```

3. Install dependencies
    ```
    npm install
    ```

4. Build the project
    ``` 
    npm run build
    ```

5. Start the server
    ```
    npm run start
    ```
