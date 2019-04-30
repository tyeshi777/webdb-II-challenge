const express = require("express");
const helmet = require("helmet");
const zoosRouter = require("./zoos-routers.js");
const bearsRouter = require("./bears-routers.js");
const server = express();

server.use(helmet());
server.use(express.json());

server.use("/api/zoos", zoosRouter);
server.use("/api/bears", bearsRouter);

module.exports = server;
