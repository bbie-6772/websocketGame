import express from "express";
import { createServer } from 'http';
import initSocket from "./init/socket.js";
import { loadGameAssets } from "./init/assets.js";

const app = express();
const server = createServer(app)

const  PORT = 1205;

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static("public"))
initSocket(server)

server.listen(PORT, async () => {
    console.log('Server is running on PORT: ' + PORT)

    try {
        const assets = await loadGameAssets();
        console.log(assets, 'Assets loaded successfully');
    } catch (err) {
        console.error('Failed to load game assets: '+ err.message)
    }
})
 