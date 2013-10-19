/* You should implement your request handler function in this file.
 * But you need to pass the function to http.createServer() in
 * basic-server.js.  So you must figure out how to export the function
 * from this file and include it in basic-server.js. Check out the
 * node module documentation at http://nodejs.org/api/modules.html. */

var fs = require("fs");
var url = require('url');
var mysql = require('mysql');
var querystring = require('querystring');
var log = []; //DELETE
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "Content-Type":"text/plain",
  "access-control-max-age": 10 // Seconds.
};

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  database : 'chat'
});

connection.connect(function(err) {
  console.log('connected!\n\n\n\n\n\n\n');
  if(err){
    console.log(err);
  }
});


exports.handleRequest = function(request, response) {

  fs.exists('./chatlog', function(exists) {
    if(exists) {
      fs.readFile('./chatlog', 'utf8', function(data) {
        console.log('chatlog',data);
      });
    }
  });

  var headers = defaultCorsHeaders;
  var routes = {
    '/': function(req){
      console.log('INDEX REQUESTED');
      if(req.url === "/") {
        fs.readFile(process.cwd() + '/client/chatterbox.html', 'utf8', function (err, html) {
          response.writeHeader(200, {"Content-Type": "text/html"});
          response.write(html);
          response.end();
        });
      } else {
        fs.readFile(process.cwd() + '/client' + req, 'binary', function (err, data) {
          if(err) {
            console.log("error on request");
            routes['/404-Not-Found']();
          } else {
            response.writeHead(200, {"Content-Type": "text/plain"});
            response.write(data, 'binary');
            response.end();
          }
        });
      }
    },
    '/classes/messages': function(req, urlObj){
      // TO DO: include createdAt, updatedAt, roomname and objectId
      console.log(req.method);
      console.log('MESSAGES REQUESTED');
      var fullBody = '';
      urlObj = urlObj || {};
      if(urlObj['roomname']){
        room = urlObj.roomname;
      } else {
        room = 'lobby';
      }
      if(req.method === 'POST'){

        req.on('data', function(chunk) {
          fullBody += chunk.toString();
          console.log('receiving DAATAA')
        });

        req.on('end', function() {
          if(!fullBody){
            response.writeHead(404, headers);
            response.end();

          } else {
          console.log('fullbody',fullBody)

            var decodedBody = JSON.parse(fullBody);

            if(decodedBody.username && decodedBody.text) {
              var chatObj = {username: decodedBody.username, text: decodedBody.text, roomname: decodedBody.roomname, createdAt: (Date.now()).toString(), objectId: Math.round((Math.random()*1000)).toString()};

              fs.appendFile("./chatlog", JSON.stringify(chatObj) + "\n", function(err) {
                if(err) {
                  console.log("Error saving!");
                  response.writeHead(400, headers);
                  response.end();
                } else {
                  var messagesQuery = connection.query("INSERT INTO messages SET ?",{text: chatObj.text, username: chatObj.username, roomname: chatObj.roomname}, function(err, result){
                    if (err){
                      console.log(err);
                    } else{
                      console.log('#WINNING');
                    }
                  });
                  response.writeHead(201, headers);
                  response.end();
                }
              });
            }
          }
        });
      } else if(req.method === 'GET') {
        var allMessages = connection.query("SELECT * FROM messages", function(err, result){
          if(err){
            console.log(err);
          } else {
            response.writeHead(200, headers);
            response.end(JSON.stringify(result));
          }
        });
      } else if (req.method === 'OPTIONS') {
        response.writeHead(200, headers);
        response.end();

      } else  {
        routes['/405-Method-Not-Supported']();
      }
    },
    '/createUser': function(req){
      var fullBody = '';
      req.on('data', function(chunk) {
        fullBody += chunk.toString();
      });

      req.on('end', function() {
        if(!fullBody){
          response.writeHead(404, headers);
          response.end();
        } else {
          username = fullBody.slice(5);
          console.log('USER:',username);
          var x = connection.query("SELECT COUNT(username) FROM users WHERE username = ?",username, function(err, result){
            if(err){
              console.log('ERROR\n\n',err);
            }
            console.log('RESULT\n\n',result);
            if(result[0]['COUNT(username)'] === 0){
              connection.query("INSERT INTO users SET ?",{username:username}, function(err, result){
                if(err){
                  console.log(err);
                }
                else {
                  console.log('ADDED to DB');
                  response.writeHead(200,headers);
                  response.end();
                }
              });
            } else {
              response.writeHead(409,headers);
              response.end();
              console.log('Username Taken! Your lack of originality is depressing.');
            }
          });
        }
      });
    },
    '/classes/rooms': function(req){
      var fullBody = '';
      req.on('data', function(chunk) {
        fullBody += chunk.toString();
      });

      req.on('end', function() {
        if(!fullBody){
          response.writeHead(404, headers);
          response.end();
        } else {
          var roomObj = JSON.parse(fullBody);
          var room = roomObj['roomname'];
          connection.query('SELECT COUNT(roomname) FROM rooms WHERE roomname = ?',room, function(err,result){
            if(err){
              console.log(err);
            } else if(result[0]['COUNT(roomname)'] === 0) {
              connection.query('INSERT INTO rooms SET roomname = ?',room,function(err,result){
                if(err){
                  console.log(err);
                } else {
                  console.log("added room");
                  response.writeHead(200,headers);
                  response.end();
                }
              });
            } else {
              response.writeHead(409,headers);
              response.end();
              console.log('Already in Roomlist');
            }
          });
        }
      });
    },
    '/404-Not-Found': function(req){
      console.log('404 ERROR');
      headers['Content-Type'] = "text/plain";
      response.writeHead(404, headers);
      response.end("404 Not Found!");
    },
    '/405-Method-Not-Supported': function(req){
      headers['Content-Type'] = "text/plain";
      response.writeHead(405, headers);
      response.end("405 - Method Not Supported!");
    },
    '/?': function(req) {
      headers['Content-Type'] = "text/plain";
      response.writeHead(200, headers);
      response.end();
    }

  };
  console.log('\n\n\n',url.parse(request.url).path);

  var pathname = url.parse(request.url).pathname;
  var fullpath = url.parse(request.url).path;
  var search = url.parse(request.url).query;


  if(fullpath.charAt(1) !== "?") {

    if(routes[request.url]){
      routes[request.url](request);
    } else if (request.url.indexOf("classes/") > -1) {
        routes['/classes/messages'](request, parseUrl(request.url));
    }
    else if (request.url.slice(-2) === "js") {
      routes['/'](request.url);
    }
    else {
      routes['/404-Not-Found'](request);
    }
  } else {
    routes[pathname]({url:'/'});
  }
};

var parseUrl =  function(stringUrl) {
  var urlObj = {
    fullUrl: stringUrl
  };
  urlObj.baseUrl = stringUrl.slice(0,stringUrl.indexOf("classes"));
  if(stringUrl.indexOf("?") > -1 ) {
    if(stringUrl.indexOf("order") > -1) {
      // process order
    }
    if(stringUrl.indexOf("limit") > -1) {
      // process limit
    }
    urlObj.roomname = stringUrl.slice(stringUrl.indexOf("classes/") + 8, stringUrl.indexOf("?"));
  }
  else {
    urlObj.roomname = stringUrl.slice(stringUrl.indexOf("classes/") + 8);
  }
  return urlObj;
};