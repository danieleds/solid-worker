const fs = require("fs");
const path = require("path");
const vm = require("vm");
const noop = require(path.join(__dirname, "noop.js"));
const events = /^(error|message)$/;

function toFunction (arg) {
	var __worker_evaluated_function_ = null;
	eval("__worker_evaluated_function_ = (" + arg + ")"); // eslint-disable-line no-eval

	return __worker_evaluated_function_;
}

// Bootstraps the Worker
process.once("message", obj => {
	const exp = obj.isfn ? toFunction(obj.input) : fs.readFileSync(obj.input, "utf8");

	global.self = {
		close: () => {
			process.exit(0);
		},
		postMessage: msg => {
			process.send(JSON.stringify({data: msg}));
		},
		onmessage: void 0,
		onerror: err => {
			process.send(JSON.stringify({error: err.message, stack: err.stack}));
		},
		addEventListener: (event, fn) => {
			if (events.test(event)) {
				global["on" + event] = global.self["on" + event] = fn;
			}
		}
	};

	global.__dirname = __dirname;
	global.__filename = __filename;
	global.require = require;

	global.importScripts = (...files) => {
		let scripts;

		if (files.length > 0) {
			scripts = files.map(file => {
				return fs.readFileSync(file, "utf8");
			}).join("\n");

			vm.createScript(scripts).runInThisContext();
		}
	};

	Object.keys(global.self).forEach(key => {
		global[key] = global.self[key];
	});

	process.on("message", msg => {
		try {
			(global.onmessage || global.self.onmessage || noop)(JSON.parse(msg));
		} catch (err) {
			(global.onerror || global.self.onerror || noop)(err);
		}
	});

	process.on("error", err => {
		(global.onerror || global.self.onerror || noop)(err);
	});

	if (typeof exp === "function") {
		exp();
	} else {
		vm.createScript(exp).runInThisContext();
	}
});
