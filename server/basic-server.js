/* Import node's http module: */
var http = require("http");

/* Import our event handler */
var handler = require('./request-handler.js');

/* This is the callback function that will be called each time a
 * client (i.e.. a web browser) makes a request to our server. */
var requestListener = function (request, response) {

  /* Request is an http.ServerRequest object containing various data
   * about the client request - such as what URL the browser is
   * requesting. */
  console.log("Serving request type " + request.method + " for url " + request.url);
  // console.log(request);

  /* "Status code" and "headers" are HTTP concepts that you can
   * research on the web as and when it becomes necessary. */
  // var statusCode = 200;

  /* Without this line, this server wouldn't work.  See the note
   * below about CORS. */

  // var headers = defaultCorsHeaders;
  // headers['Content-Type'] = "text/plain";

  /* Response is an http.ServerRespone object containing methods for
   * writing our response to the client. Documentation for both request
   * and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html*/

  // response.writeHead(statusCode, headers);

  /* .writeHead() tells our server what HTTP status code to send back
   * to the client, and what headers to include on the response. */

  handler.handleRequest(request, response);

  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
  // response.end("Hello, World!");
};

/* These headers will allow Cross-Origin Resource Sharing.
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

/* Every server needs to listen on a port with a unique number. The
 * standard port for HTTP servers is port 80, but that port is
 * normally already claimed by another server and/or not accessible to
 * user processes, so we'll use a higher port number that is not
 * likely to be taken: */
var port = 8080;

/* For now, since you're running this server on your local machine,
 * we'll have it listen on the IP address 127.0.0.1, which is a
 * special address that always refers to localhost. */
var ip = "127.0.0.1";

/* Use node's http module to create a server and start it listening on
 * the given port and IP. */
var server = http.createServer(requestListener);
//console.log(fs.readdirSync(process.cwd() + '/client'));
// fs.readFile(process.cwd() + '/client/chatterbox.html', 'utf8', function (err, html) {
//     if (err) {
//         throw err;
//     }
//     http.createServer(function(request, response) {
//         response.writeHeader(200, {"Content-Type": "text/html"});
//         response.write(html);

//         response.end();
//     }).listen(8080,ip);
// });

console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

/* To start this server, run:
     node basic-server.js
 *  on the command line.

 * To connect to the server, load http://127.0.0.1:8080 in your web
 * browser.

 * server.listen() will continue running as long as there is the
 * possibility of serving more requests. To stop your server, hit
 * Ctrl-C on the command line. */
