const express = require("express");
const { Server: SocketIOServer } = require("socket.io");
const { createServer } = require("http");

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer);