# solid-worker
Process-based WebWorker for the server

`require()` is available for flexible inline Worker scripts.

[![npm version](https://badge.fury.io/js/solid-worker.svg)](https://badge.fury.io/js/solid-worker)
[![build status](https://secure.travis-ci.org/danieleds/solid-worker.svg)](http://travis-ci.org/danieleds/solid-worker)

## Example
#### Creating a Worker from a file
The worker script:
```javascript
onmessage = function (ev) {
	postMessage(ev.data);
};
```

The core script:
```javascript
var Worker = require("solid-worker");
var worker = new Worker("repeat.js");

worker.onmessage = function (ev) {
	console.log(ev.data);
	worker.terminate();
};

worker.postMessage("Hello World!");
```

#### Creating a Worker from a Function
```javascript
var Worker = require("solid-worker");
var worker = new Worker(function () {
	self.onmessage = function (ev) {
		postMessage(ev.data);
	};
});

worker.onmessage = function (ev) {
	console.log(ev.data);
	worker.terminate();
};

worker.postMessage("Hello World!");
```

## Properties
#### onmessage
Message handler, accepts an `Event`

#### onerror
Error handler, accepts an `Event`

## API
#### addEventListener(event, fn)
Adds an event listener

#### postMessage()
Broadcasts a message to the `Worker`

#### terminate()
Terminates the `Worker`

## License
Copyright (c) 2015 Jason Mulligan  
Copyright (c) 2016-2017 Daniele Di Sarli  
Licensed under the BSD-3 license

Forked from: https://github.com/avoidwork/tiny-worker

This fork introduces bug fixes which has not been included in the original repo.
