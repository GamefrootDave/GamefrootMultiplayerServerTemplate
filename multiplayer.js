            //socket message receiving
            var self = this;
            this.socket = io();
            
            //receiving game-in messages from the server, and then ingesting them into the game
            this.socket.on('game-in', (value) => {
                //console.log('game-in' + value );
                game.broadcast.ingest('game-in', value );
            });
            
            //sending game-out messages to the server!
            game.broadcast.emitter.on(game.broadcast.MESSAGE, ( message, value ) => { 
                if ( message === 'game-out' ) {
                    //console.log('game-out' + value);
                    this.socket.emit('game-out', value );
                }
            });