const express = require('express'); // importing a CommonJS module
const helmet = require("helmet");
const morgan = require("morgan");

const hubsRouter = require('./hubs/hubs-router.js');
const server = express();

// custom middleware
function logger (req, res, next) {  
  console.log(`${req.method}\n Request to \n${req.originalUrl}`)

  next();
}

function greeter (req, res, next) {
  req.cohort = "Web 26"

  next();
}

function gateKeeper(guess) {
  return (req, res, next) => {
    const password = req.headers.password
    password && password.toLowerCase() === guess 
        ? res.status(202) & next() 
        : res.status(401).json({ message: "DIDN'T WORK"});  
  }
}

// next is instance of function that when invoked calls next middleware on the stack

// global middleware - applies to every request top to bottom
server.use(express.json()); // built-in middleware
server.use(morgan("dev")); // expediting comms?
server.use(helmet()); // security
// server.use(logger);

// routes - endpoints
// middleware can be used locally e.g. server.get('/', logger, (req, res) => {...
server.use('/api/hubs', logger, gateKeeper("mellon"), hubsRouter);

server.get('/', logger, greeter, gateKeeper("notto"), (req, res) => {
  console.log(req.headers)

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome ${req.cohort} to the Lambda Hubs API</p>
    `);
});




module.exports = server;
