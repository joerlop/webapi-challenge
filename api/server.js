const express = require('express');

const projectsRouter = require("../projects/projects-router")

const server = express();

server.use(express.json());

server.use("/api/projects", projectsRouter)



// add an endpoint that returns all the messages for a hub
// add an endpoint for adding new message to a hub

module.exports = server