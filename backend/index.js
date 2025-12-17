const express = require('express');
const { createServer } = require('node:http');
const {Server} = require('socket.io')
const cors = require('cors')

const app = express();
const server = createServer(app);

const corsOptions = {
    origin : "*",
    methods : ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders : ["Content-Type", "Authorization"]
}

const io = new Server(server, {
  cors: {
    origin: "*",   
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders : ["Content-Type", "Authorization"]
  }
})

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', msg);
  });
});

    
server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});