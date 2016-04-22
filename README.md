# [Signup Link!](https://learn.fullstackacademy.com/signup?cohort=571a663dd5e33e030020cade)
# Web APIs

1. [Detailed Background](#detailed-background)
  - [HTTP](#http)
  - [Anatomy of a request](#anatomy-of-a-request)
  - [Anatomy of a response](#anatomy-of-a-response)
  - [The cycle](#the-cycle)
  - [REST](#rest)
2. [Our first API Client](#our-first-api-client)
  - [Installing Node.js](#installing-node-js)
  - [Setting up the Project](#setting-up-the-project)
  - [The request](#the-request)
3. [Our project](#our-project)
  - [Structure](#structure)
  - [Setting Up Your Own Web Server](#setting-up-your-own-web-server)
  - [With Twilio](#with-twilio)
  - [Challenge](#challenge)

## Detailed Background

Note: This might be more information than you need. I want you to have a complete picture.

### HTTP
The internet as we know it (and nearly every web API) is built on top of the HTTP protocol. HTTP is a set of conventions that allow programs running on computers to send each other information. These programs have distinct roles. The _client_ initiates the communication by creating a _request_. The _server_ sends a _response_ the the request. Servers send one response per request.

    ┌──────────┐                   ┌──────────┐
    │          │◀───1. Request──── │          │
    │   HTTP   │                   │   HTTP   │
    │  Server  │                   │  Client  │
    │          │────2. Response──▶ │          │
    └──────────┘                   └──────────┘
    
Sometimes when people talk about clients and servers they're talking about hardware. Other times they're talking about software. Today, we're talking about software. A server is a software program that responds to a client's request. A client is a program that sends requests to servers.

You know many HTTP clients already. Some live in your browser, others are on phones. Still more are in cars, thermostats, security systems and baby cameras.

### Anatomy of a request

Requests have several components:

- Location - where the request is going
  - Server - internet address of a computer running a server program
  - Path - everything after the `.com`
- Method - a somewhat arbitrary categorization tool. We'll get to this more when we talk about REST. Common methods include GET, POST, PUT, and DELETE
- Headers - key, value pairs for sending more information
- Body - binary data that is sometimes sent with the request

### Anatomy of a response

Responses have the following components:

- Status code - a convention for describing disposition of the request. You probably already know one, 404 (not found). Status code 200 means "OK."
- Headers - key, value pairs describing metadata about the response
- body - binary data

### The cycle

    ┌──────────────────────────────────────────────────────────────┐
    │                            Client                            │
    └┬─────────────────────────────────────────────────────────────┘
     │GET /docs/index.html HTTP/1.1   ▲                             
     │Host: www.test101.com           │HTTP/1.1 200 OK              
     │Accept: image/gif, image/jpeg   │Date: Sun, 18 Oct 2009...    
     │Accept-Language: en-us          │Server: Apache/2.2.14 (Win32)
     │Accept-Encoding: gzip, deflate  │Last-Modified: Sat, 20 Nov...
     │Content-Length: 25kb            │ETag: "10000000565a5-2c-..." 
     │User-Agent: Mozilla/4.0...      │Accept-Ranges: bytes         
     │(blank line)                    │Content-Length: 44           
     │                                │Connection: close            
     │                                │Content-Type: text/html      
     │                                │X-Pad: avoid browser bug     
     │                                │                             
     │                                │<html><body><h1>It           
     ▼                                │works!</h1></body></html>    
    ┌─────────────────────────────────┴────────────────────────────┐
    │                            Server                            │
    └──────────────────────────────────────────────────────────────┘

### REST

REST stands for [REpresentational State Transfer](https://en.wikipedia.org/wiki/Representational_state_transfer). It's a little complicated, but the gist is that it's convention on top of HTTP that standardizes the format of requests and responses for common tasks in web software.

Most tasks on web applications can be categorized into the following 4 groups

- Create
- Read
- Update
- Delete

You can tweet, look at a tweet, edit a tweet (maybe? ¯\_(ツ)_/¯), delete a tweet.

You can "friend" someone on facebook, see other people's friends, update a friend (relationship status? ¯\_(ツ)_/¯), and unfriend someone.

You get the idea.

REST is basically a mapping of HTTP request verbs and paths to these 4 common actions. 

Here's the mapping:

| Purpose | Method | Path         |
|---------|--------|--------------|
| Create  | POST   | /            |
| Read    | GET    | / or /someId |
| Update  | PUT    | /someId      |
| Delete  | DELETE | /someId      |

This might not make sense, so here's an example.

In Twitter's API, you might create a tweet like this:

```
POST /api/tweets HTTP/1.1
Host: www.twitterdotcom.com
Accept: application/json
Accept-Language: en-us
Accept-Encoding: gzip, deflate
Content-Length: 1kb
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9
User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)
{
  "tweet":"omg lolz #yolo"
}
```

Twitter might respond like this:

```
HTTP/1.1 201 Created
Date: Sun, 18 Oct 2018 08:56:53 GMT
ETag: "10000000565a5-2c-3e94b66c2e680"
Content-Length: 44
Connection: close
Content-Type: application/json
  
{
  "id": 1232244242422,
  "tweet": "omg lolz #yolo",
  tags: ["yolo"],
  user: 2342342423423
}
```

You might update a tweet like this

```
PUT /api/tweets/1232244242422 HTTP/1.1
Host: www.twitterdotcom.com
Accept: application/json
Accept-Language: en-us
Accept-Encoding: gzip, deflate
Content-Length: 1kb
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9
User-Agent: Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)
{
  "tweet":"omg lolz #yolo #fun!"
}
```

etc.

## Our first API Client

### Installing Node.js

#### Linux

Ok so you guys might be somewhat on your own. You probably _don't_ want to just use your built in package manager because it will be hopelessly out of date. [Here](https://nodejs.org/en/download/package-manager/) are some great instructions for making the package managers work

#### Mac & Windows

Head to [node.js](https://nodejs.org/en/)s' website and download the installer from there. You can also use a package manager if you have one and know what you're doing.

Once Node is installed, fire up a shell (windows users, I really hope you have [Cygwin](https://www.cygwin.com/) if not, you might be looking on with a friend...) and run:

```bash
$ node --version
```

You should get some version number. If you don't, flag me down and I'll help you.

### Setting up the Project

I've set up a starting point for you on [github](...). To download it, you can click on the download link on github, or use `git clone`. Once you have the project on your hard drive, direct your shell to the project. Here's how I would do it:

```bash
$ git clone ...
$ cd ./api-project
```

Then run `$ npm install`. NPM (Node Package Manager) will read the `package.json` file in the directory and install needed dependencies.

### The Request

Use your favorite text editor to explore the directory. You should see something like

```
.
├── example.js
├── index.js
├── package.json
└── node_modules
```

Open up `example.js`. See if you can predict what it will do. Once you've looked it up and down, run it!

```bash
$ node ./example.js
```

What you're getting back is the JSON representation of my github repositories.

## Our Project

### Structure

We're building a cool little system. When a user texts a phone number, the raspberry pi takes a photo and texts it back. To make this work we're going to use a service called Twilio. Twilio is an API that let's us easily write software with telephony features. We can send and receive texts, calls, and photos.

Our program that is _both_ an HTTP client and an HTTP server. This may seem odd, but its actually quite common. Here's how our program fits into the ecosystem.

    ┌──────────────────────────────────────────────────┐                                        
    │              Verison, AT&T, etc...               │                                        
    └┬─────────────────────────────────────────────────┘    1. An incoming SMS triggers a cell  
     │ ▲                                              ▲     provider to send a request to Twilio
     │ │                                              │     2. Twilio Responds, indicating that 
     ▼ │                                              │     they received the message.          
    ┌──┴──────────────────────────────────────────────┴┐                                        
    │                      Twilio                      │                                        
    └┬─────────────────────────────────────────────────┘    3. Twilio sends your server a       
     │                                                ▲     request... waiting...               
     │                                                │                                         
     ▼                                                │                                         
    ┌─────────────────────────────────────────────────┴┐                                        
    │                   Your server                    │░                                       
    └──────────────────────────────────────────────────┘░   4. Your server receives twilio's    
     │░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▲░░   request                             
     │                                                │     5. Your server makes a request to   
     │                                                │     the Raspberry Pi                    
    ┌▼────────────────────────────────────────────────┴┐    6. The raspberry pi takes a photo   
    │                     The RPI                      │    7. The raspberry pi responds to the 
    └──────────────────────────────────────────────────┘    request with the photo              
                                                            8. Your server responds to twilio's 
                                                            request                             
                                                            9 Twilio makes a new request to     
                                                            Version, AT&T, etc                  
                                                                                                


### Setting Up Your Own Web Server

Node.js comes built with an `http` package which makes it simple to create basic servers. Open up `index.js` and start editing.

First, require the `http` package.

```js
const http = require('http');
```

There's a method exposed on the `http` object called `createServer`. We're going to call that method.

```js
http.createServer()
```

`createServer` returns an HTTP Server object. This object has a `listen` method. We can call the listen method to tell the server to start listening on a port. We haven't talked about ports yet. For now, just think of them as radio frequencies. Our line should now look like:

```js
http.createServer().listen(1337);
```

So great. Now we have an HTTP server, but it isn't doing anything for us! How do we specify the functionality of the server? Well the `createServer` method actually takes an argument. Its a function!

```js
http.createServer(function() {}).listen(1337);
```

This is a pretty common pattern in javascript and many other languages. By passing a function into create server, we're telling how we want the server to behave. `http` will call our function whenever a request comes into the server. It will pass in two arguments to our function: an object representing the request, and another the response.

```js
http.createServer(function(request, response) {
  
}).listen(1337);
```

Now let's get the server saying something.

```js
http.createServer(function(request, response) {
  res.writeHead(200);
  res.end('Hi guys!');
}).listen(1337);
```

Fire up your server to test it

```bash
$ node index.js
```

Now direct your browser to http://localhost:1337

Notice that your computer is running both a client program and a server program.

### With Twilio

Go to twilio.com and set up an account. You should be able to get a test number for free. But if not, numbers only cost $1/month. You can cancel them after today. Every text sent or received costs 1 cent.

When you're setting up your phone number, Twilio will ask you what server they should send requests to. Your computer isn't running on the public internet! How will twilio get messages to you? You can use a service called ngrok to give your laptop a temporary domain name.

You can install it like this:

```bash
$ npm install -g ngrok
```

Some of you may need to `sudo` that command or find me for help correcting your permissions.

Once you have `ngrok` installed, you can set up a domain for your laptop like this

```bash
$ ngrok http 1337
```

It will show you output like this

```
ngrok by @inconshreveable                                                                                                                                                                 (Ctrl+C to quit)

Tunnel Status                 online
Update                        update available (version 2.0.24, Ctrl-U to update)
Version                       2.0.19/2.0.25
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://5a18a004.ngrok.io -> localhost:1337
Forwarding                    https://5a18a004.ngrok.io -> localhost:1337

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00

```

You can copy this part `http://5a18a004.ngrok.io` and give that to twilio.

Now, you need to modify your web server to give the type of responses twilio is looking for.

Try making your server look like this

```js
const http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(`<?xml version="1.0" encoding="UTF-8"?>
              <Response>
                  <Message>
                    <Body>Welcome to Twilio!</Body>
                    <Media>http://i.imgur.com/Act0Q.gif</Media>
                  </Message>
              </Response>`);

}).listen(1337);
```

Make sure your server is restarted and your ngrok tunnel is open. Try sending a text to your number on twilio. You should get a funny response!

### Challenge

Your challenge is to modify the server to make requests to the raspberry pi server we wrote together.  When the twilio request comes to you, send me a request. I'll send you back a URL to a photo that I took because of the request. Then you forward that on to twilio.

The first one to finish gets my Raspberry
