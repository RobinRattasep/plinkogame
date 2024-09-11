const { WebcastPushConnection } = require('tiktok-live-connector'); // CommonJS syntax (server-side)
const WebSocket = require('ws'); // Use WebSocket for communication with the front-end
const wss = new WebSocket.Server({ port: 8080 }); // Create WebSocket server on port 8080

let tiktokUsername = 'bouncy_bounce';
let tiktokLiveConnection = new WebcastPushConnection(tiktokUsername);
let i = 0;
tiktokLiveConnection
  .connect()
  .then((state) => {
    console.info(`Connected to roomId ${state.roomId}`);
  })
  .catch((err) => {
    console.error('Failed to connect', err);
  });

// Send WebSocket message on chat event
tiktokLiveConnection.on('chat', (data) => {
  console.log(`${data.uniqueId} (userId:${data.userId}) writes: ${data.comment}`);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send('dropBall'); // Send message to WebSocket clients
    }
  });
});

// Send WebSocket message on gift event
tiktokLiveConnection.on('gift', (data) => {
  console.log(`${data.uniqueId} (userId:${data.userId}) sends ${data.giftId}`);
  let dropCount = data.giftId === 5655 ? 5 : 25; // If giftId is 5655, drop 5 balls, otherwise drop 25
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      for (let i = 0; i < dropCount; i++) {
        client.send('dropBall'); // Send message to WebSocket clients
        console.log('droppedball - gift');
      }
    }
  });
});

tiktokLiveConnection.on('like', (data) => {
  console.log(`${data.uniqueId} sent ${data.likeCount} likes, total likes: ${data.totalLikeCount}`);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send('increaseBet'); // Send message to WebSocket clients
    }
  });
});

tiktokLiveConnection.on('follow', (data) => {
  console.log(data.uniqueId, 'followed!');
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      for (let i = 0; i < 5; i++) {
        // Corrected loop logic
        client.send('dropBall'); // Send message to WebSocket clients
        console.log('droppedball - follow');
      }
    }
  });
});

tiktokLiveConnection.on('share', (data) => {
  console.log(data.uniqueId, 'shared the stream!');
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      for (let i = 0; i < 3; i++) {
        // Corrected loop logic
        client.send('dropBall'); // Send message to WebSocket clients
        console.log('droppedball - share');
      }
    }
  });
});

// Infinite loop to drop between 1-10 balls every 15 seconds
function dropBallsPeriodically() {
  setInterval(() => {
    const numBalls = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
    console.log(`Dropping ${numBalls} balls every 15 seconds`);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        for (let i = 0; i < 2; i++) {
          client.send('dropBall'); // Send message to WebSocket clients
          console.log('droppedball - periodic');
        }
      }
    });
  }, 35000); // Every 15 seconds (15,000 ms)
}

// Start the periodic ball dropping
dropBallsPeriodically();
