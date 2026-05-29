const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // join a store-specific room for filtering
    socket.on('join_store', (storeId) => {
      socket.join(`store_${storeId}`);
      console.log(`Socket ${socket.id} joined store_${storeId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

module.exports = { initSocket };