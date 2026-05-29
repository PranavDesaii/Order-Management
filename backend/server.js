const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const ordersRouter = require('./src/routes/orders');
const { initSocket } = require('./src/socket/index');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

// attach io to every request so controllers can use it
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/orders', ordersRouter);

initSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});