const WebSocket = require('ws');
const { WebcastPushConnection } = require('tiktok-live-connector');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

const wss = new WebSocket.Server({ port: 8080 }); // Choose an appropriate port

wss.on('connection', (ws) => {
  console.log('Client connected');

  eventEmitter.on('dropBall', () => {
    ws.send(JSON.stringify({ type: 'dropBall' }));
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// TikTok live connection setup
let tiktokUsername = 'noradin_muhamad_oficial';
let tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);

tiktokLiveConnection
  .connect()
  .then((state) => {
    console.info(`Connected to roomId ${state.roomId}`);
  })
  .catch((err) => {
    console.error('Failed to connect', err);
  });

tiktokLiveConnection.on('chat', (data) => {
  console.log(`${data.uniqueId} (userId:${data.userId}) writes: ${data.comment}`);
  eventEmitter.emit('dropBall');
});

tiktokLiveConnection.on('gift', (data) => {
  console.log(`${data.uniqueId} (userId:${data.userId}) sends ${data.giftId}`);
  eventEmitter.emit('dropBall');
});
