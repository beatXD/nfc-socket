const { NFC } = require('nfc-pcsc')
const http = require('http')
const express = require('express')
const { io } = require('socket.io-client')
const macaddress = require('macaddress')

const hostname = '192.168.1.11'
const port = 3333

const app = express()
const server = http.createServer(app)

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)

  let macAddress = ''

  macaddress.one('awdl0').then(function (mac) {
    console.log('Mac address for awdl0: %s', mac)
    macAddress = mac
  })

  const socket = io('http://localhost:9999')
  socket.on('connect', () => console.log('connect', socket.connected))

  const nfc = new NFC()

  nfc.on('reader', reader => {
    console.log(`${reader.reader.name}  device attached`)

    reader.on('card', card => {
      console.log(`${reader.reader.name}  card detected`, card)
      socket.emit('socket', { card, macAddress })
    })

    reader.on('card.off', card => {
      console.log(`${reader.reader.name}  card removed`, card)
    })

    reader.on('error', err => {
      console.log(`${reader.reader.name}  an error occurred`, err)
    })

    reader.on('end', () => {
      console.log(`${reader.reader.name}  device removed`)
    })
  })

  nfc.on('error', err => {
    console.log('an error occurred', err)
  })
})
