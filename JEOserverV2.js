var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('url');
var rooms = [];

app.get('/',function(req,res){
res.sendFile(__dirname + "/masterV2.html");
})





io.on('connection',function(socket){

  socket.on('clear room', function(msg){
    for (var i = 0; i < rooms.length; i++){
      if (rooms[i] == msg){
        delete rooms[i];
        console.log ('deleted ' + msg)
      }
    }
  });

  socket.on('create room', function(msg){
    var success = true;
    for (var i = 0; i < rooms.length; i++){
      if (rooms[i] == msg){
        success = false;
      }
    }
    if (success){
      socket.emit('duplicate check', 'no duplicates');
      console.log(msg + " is a channel");
      rooms.push(msg);
    }
    else{
      socket.emit('duplicate check', 'duplicate');
    }
  });

  socket.on('join room', function(msg){
    var message = "doesn't exist";
    for (var i = 0; i < rooms.length; i++){
      if(rooms[i] == msg){

        message = "active room"

      }
    }
    io.emit('join response', message);

  });


   socket.on('buzz', function(msg){

    io.emit('playerInfo',[msg[0], msg[1]]);

   });

  socket.on('resetReq',function(msg){

    io.emit('reset',[msg[0], msg[1]]);

  })





});



http.listen(5000,function(){

console.log("listening on port 5000");

})
