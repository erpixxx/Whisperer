<h1 text-align="center">Whisperer <img src="https://github.com/erpixxx/Whisperer/blob/main/server/public/img/shhh-emoji.png?raw=true" width="30"></h1>

Whisperer is an application that allows remote modification of elements on a webpage on the client side, who has the plugin installed. The application consists of a server and a browser plugin.

## Features

- Remote modification of content elements on a webpage.
- Undo changes made.
- Automatic sending of DOM snapshots to the server.
- Supporting Docker with Docker Compose.

## Installation
<details>

<summary>Manual</summary>

### Manual 
1. Clone the repository:
    ```sh
    git clone https://github.com/YourRepository/Whisperer.git
    cd Whisperer
    ```

2. Install server dependencies:
    ```sh
    cd server
    npm install
    ```

3. Start the server:
    ```sh
    npm start
    ```

</details>
<details> 

<summary>Docker</summary>    

### Docker
1. Clone the repository
    ```sh
    git clone https://github.com/YourRepository/Whisperer.git
    ```

2. Run the docker-compose command
    ```sh
    docker compose up -d
    ```

</details>


## Project Structure

- [extension](https://github.com/erpixxx/Whisperer/tree/main/extension) - Browser extension code
- [server](https://github.com/erpixxx/Whisperer/tree/main/server) - Server app code
