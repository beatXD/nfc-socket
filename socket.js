const io = require('socket.io')({
  path: '/socket.io',
  cors: { origin: '*' },
})

io.on('connection', client => {
  console.log('Client connected...')

  client.on('disconnect', () => {
    console.log('Client disconnected...')
  })

  client.on('socket', data => {
    console.log('Message: ', data)
    io.emit(`${data.macAddress}`, data?.uid)
  })
})
io.listen(9999)
