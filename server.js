var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

/*
This code allows anyone to grab this multiplayer server template, and simply upload their game files into the root directory.
Server.js takes care of adding multiplayer functionality by editing index.html and inserting references to the multiplayer javascript files.
Once that's done, the server serves the updated HTML with multiplayer to the client, and no one needs to edit any files!
To work, this should find: 
*/

var replace = require('replace-in-file');

var options = {
  files: 'index.html',
  from: `<script src="game.js"></script>
    </body>`,
  to: `<script src="game.js"></script>
        <script src="/socket.io/socket.io.js"></script>
        <script src="multiplayer.js"></script>
    </body>`,
}; 

try {
  const results = replace.sync(options);
  console.log('Updated index.html to include multiplayer files:', results);
}
catch (error) {
  console.error('Error occurred:', error);
};


//then serve index.html to the player
 
app.use(express.static(__dirname + ''));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
 
io.on('connection', function (socket) {
  console.log('a user connected');
 
  //listening for game-out messages from clients
  socket.on('game-out', (value) => {
    console.log('Game-out received with ', value);
    io.emit('game-in', value);
  });

});

 
server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});