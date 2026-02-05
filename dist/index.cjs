//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion
let node_net = require("node:net");
node_net = __toESM(node_net);
let node_fs = require("node:fs");
node_fs = __toESM(node_fs);
let node_path = require("node:path");
node_path = __toESM(node_path);
let node_os = require("node:os");
node_os = __toESM(node_os);
let node_tls = require("node:tls");
node_tls = __toESM(node_tls);
let undici = require("undici");
undici = __toESM(undici);
let node_stream = require("node:stream");
node_stream = __toESM(node_stream);
let ssh2 = require("ssh2");
ssh2 = __toESM(ssh2);
require("node:stream/web");

//#region lib/types/FileInfo.ts
var FileInfo = class FileInfo {
	name;
	size;
	mode;
	mtime;
	linkTarget;
	constructor(name, size, mode, mtime, linkTarget) {
		this.name = name;
		this.size = size;
		this.mode = mode;
		this.mtime = mtime;
		this.linkTarget = linkTarget;
	}
	static fromJSON(s) {
		const json = JSON.parse(s);
		return new FileInfo(json.name, json.size, json.mode, new Date(json.mtime), json.linkTarget);
	}
};

//#endregion
//#region lib/http.ts
const DOCKER_RAW_STREAM = "application/vnd.docker.raw-stream";
const DOCKER_MULTIPLEXED_STREAM = "application/vnd.docker.multiplexed-stream";
const APPLICATION_JSON = "application/json";
const APPLICATION_NDJSON = "application/x-ndjson";
var NotFoundError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "NotFoundError";
	}
};
var UnauthorizedError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "UnauthorizedError";
	}
};
var ConflictError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "ConflictError";
	}
};
function _parseContentType(contentType) {
	if (!contentType) {
		return { type: "" };
	}
	const parts = contentType.split(";").map((part) => part.trim());
	const type = parts[0]?.toLowerCase() || "";
	let charset;
	for (let i = 1; i < parts.length; i++) {
		const param = parts[i]?.toLowerCase() || "";
		if (param.startsWith("charset=")) {
			charset = param.split("=")[1];
			break;
		}
	}
	return {
		type,
		charset
	};
}
function _getErrorMessageFromResp(res, body) {
	const contentType = res.headers["content-type"]?.toLowerCase();
	if (contentType?.includes(APPLICATION_JSON) && body) {
		const jsonBody = JSON.parse(body);
		if (jsonBody.message) {
			return jsonBody.message;
		}
	}
	return res.statusMessage;
}
/**
* HTTPClient provides HTTP communication capabilities over TCP sockets.
* Supports GET, POST, and DELETE requests with query parameters and request bodies.
* Handles chunked transfer encoding and provides streaming response callbacks.
*/
var HTTPClient = class {
	agent;
	headers;
	baseUrl;
	constructor(agent, userAgent, headers) {
		this.agent = agent;
		this.headers = headers || {};
		this.headers["User-Agent"] = userAgent;
		this.baseUrl = "http://localhost:2375";
	}
	close() {
		return this.agent.destroy();
	}
	sendHTTPRequest(_method, _uri, _options) {
		throw new Error("sendHTTPRequest method not implemented");
	}
	buildQueryString(params) {
		if (!params || Object.keys(params).length === 0) {
			return "";
		}
		const searchParams = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				if (value && typeof value === "object" && typeof value.toURLParameter === "function") {
					searchParams.append(key, value.toURLParameter());
				} else {
					searchParams.append(key, String(value));
				}
			}
		});
		const queryString = searchParams.toString();
		return queryString ? `?${queryString}` : "";
	}
	async head(uri, params) {
		const queryString = this.buildQueryString(params);
		return (0, undici.fetch)(`${this.baseUrl}${uri}${queryString}`, {
			method: "HEAD",
			headers: this.headers,
			dispatcher: this.agent
		});
	}
	async get(uri, accept, params) {
		const queryString = this.buildQueryString(params);
		return (0, undici.fetch)(`${this.baseUrl}${uri}${queryString}`, {
			method: "GET",
			headers: {
				Accept: accept,
				...this.headers
			},
			dispatcher: this.agent
		});
	}
	getJSON(uri, params) {
		return this.get(uri, APPLICATION_JSON, params).then((response) => {
			if (response.status === 404) {
				throw NotFoundError;
			}
			return response.json();
		});
	}
	async post(uri, params, data, headers) {
		const queryString = this.buildQueryString(params);
		const requestHeaders = {
			"Content-Type": APPLICATION_JSON,
			...headers,
			...this.headers
		};
		let body = "";
		if (data) {
			if (isReadableStream(data)) {
				body = data;
			} else {
				body = JSON.stringify(data);
			}
		}
		return (0, undici.fetch)(`${this.baseUrl}${uri}${queryString}`, {
			method: "POST",
			headers: requestHeaders,
			body,
			duplex: "half",
			dispatcher: this.agent
		});
	}
	async put(uri, params, data, type) {
		const queryString = this.buildQueryString(params);
		return (0, undici.fetch)(`${this.baseUrl}${uri}${queryString}`, {
			method: "PUT",
			headers: {
				"Content-Type": type,
				...this.headers
			},
			body: JSON.stringify(data),
			dispatcher: this.agent
		});
	}
	async delete(uri, params) {
		const queryString = this.buildQueryString(params);
		return (0, undici.fetch)(`${this.baseUrl}${uri}${queryString}`, {
			method: "DELETE",
			headers: this.headers,
			dispatcher: this.agent
		});
	}
	async upgrade(uri, params) {
		const queryString = this.buildQueryString(params);
		const { headers, socket } = await (0, undici.upgrade)(`${this.baseUrl}${uri}${queryString}`, {
			method: "POST",
			headers: this.headers,
			dispatcher: this.agent,
			protocol: "tcp"
		});
		const header = headers["content-type"] || "";
		let content;
		if (Array.isArray(header)) {
			content = header[0] || "";
		} else {
			content = header;
		}
		return {
			content,
			socket
		};
	}
};
function isReadableStream(data) {
	return "getReader" in data && typeof data.getReader === "function";
}

//#endregion
//#region lib/socket.ts
/**
* HTTP Agent that creates socket connections using a provided factory function.
* This allows flexible socket creation strategies while supporting connection pooling.
*/
var SocketAgent = class extends undici.Agent {
	constructor(createSocketFn) {
		super({
			connect: (options, callback) => {
				const socket = createSocketFn();
				socket.on("connect", () => {
					callback(null, socket);
				});
				socket.on("error", (err) => {
					callback(err, null);
				});
				return socket;
			},
			bodyTimeout: 0
		});
	}
};

//#endregion
//#region lib/filter.ts
var Filter = class {
	data = new Map();
	set(key, values) {
		this.data.set(key, new Set(values));
		return this;
	}
	add(key, value) {
		if (!this.data.has(key)) {
			this.data.set(key, new Set());
		}
		this.data.get(key).add(value);
		return this;
	}
	get(key) {
		const values = this.data.get(key);
		return values ? Array.from(values) : [];
	}
	has(key) {
		return this.data.has(key);
	}
	keys() {
		return Array.from(this.data.keys());
	}
	toJSON() {
		const result = {};
		for (const [key, values] of this.data) {
			result[key] = {};
			for (const value of values) {
				result[key][value] = true;
			}
		}
		return result;
	}
	toURLParameter() {
		return JSON.stringify(this.toJSON());
	}
};

//#endregion
//#region lib/ssh.ts
/**
* SSH connection utilities for Docker remote access
*/
var SSH = class SSH {
	/**
	* Get SSH private key from common locations
	* @returns SSH private key buffer or undefined
	*/
	static async getPrivateKey() {
		const keyPaths = [
			(0, node_path.join)((0, node_os.homedir)(), ".ssh", "id_rsa"),
			(0, node_path.join)((0, node_os.homedir)(), ".ssh", "id_ed25519"),
			(0, node_path.join)((0, node_os.homedir)(), ".ssh", "id_ecdsa")
		];
		for (const keyPath of keyPaths) {
			try {
				return await node_fs.promises.readFile(keyPath);
			} catch (err) {}
		}
		return undefined;
	}
	/**
	* Create a socket factory function for SSH connections that can be used with SocketAgent
	* @param sshHost SSH host string (e.g., "ssh://user@host:22/var/run/docker.sock")
	* @returns Function that creates new SSH socket connections
	*/
	static async createSocketFactory(sshHost) {
		const privateKey = await SSH.getPrivateKey();
		const sshUrl = sshHost.substring(6);
		let user = "root";
		let host;
		let port = 22;
		let socketPath = "/var/run/docker.sock";
		const atIndex = sshUrl.indexOf("@");
		let hostPart;
		if (atIndex !== -1) {
			user = sshUrl.substring(0, atIndex);
			hostPart = sshUrl.substring(atIndex + 1);
		} else {
			hostPart = sshUrl;
		}
		const slashIndex = hostPart.indexOf("/");
		let hostPortPart;
		if (slashIndex !== -1) {
			hostPortPart = hostPart.substring(0, slashIndex);
			socketPath = hostPart.substring(slashIndex);
		} else {
			hostPortPart = hostPart;
		}
		const colonIndex = hostPortPart.lastIndexOf(":");
		if (colonIndex !== -1) {
			host = hostPortPart.substring(0, colonIndex);
			port = parseInt(hostPortPart.substring(colonIndex + 1)) || 22;
		} else {
			host = hostPortPart;
		}
		return () => {
			const conn = new ssh2.Client();
			const sshStream = new node_net.Socket();
			conn.on("ready", () => {
				conn.openssh_forwardOutStreamLocal(socketPath, (err, stream$1) => {
					if (err) {
						conn.end();
						sshStream.emit("error", new Error(`Failed to create SSH tunnel to ${socketPath}: ${err.message}`));
						return;
					}
					stream$1.pipe(sshStream);
					sshStream.pipe(stream$1);
					sshStream.on("close", () => {
						conn.end();
					});
					sshStream.emit("connect");
				});
			});
			conn.on("error", (err) => {
				sshStream.emit("error", new Error(`SSH connection failed to ${user}@${host}:${port}: ${err.message}`));
			});
			conn.connect({
				host,
				port,
				username: user,
				privateKey,
				tryKeyboard: true
			});
			return sshStream;
		};
	}
};

//#endregion
//#region lib/util.ts
function isObject(value) {
	return value !== null && typeof value === "object";
}
function isFileNotFoundError(error) {
	return isObject(error) && "code" in error && error.code === "ENOENT";
}
function getErrorMessage(error) {
	if (!error) {
		return;
	}
	if (typeof error === "string") {
		return error;
	}
	if (error instanceof Error) {
		return error.message;
	}
	if (isObject(error) && "message" in error && typeof error.message === "string") {
		return error.message;
	}
	return;
}
function parseIntWithDefault(value, defaultValue) {
	if (value === undefined) {
		return defaultValue;
	}
	const number = parseInt(value);
	return Number.isNaN(number) ? defaultValue : number;
}
function parseDockerHost(dockerHost, defaultPort) {
	const tcpAddress = dockerHost.substring(6);
	const [host, portStr] = tcpAddress.split(":");
	if (!host) {
		throw new Error(`Invalid Docker host: ${dockerHost}`);
	}
	const port = parseIntWithDefault(portStr, defaultPort);
	return {
		host,
		port
	};
}

//#endregion
//#region lib/tls.ts
/**
* TLS certificate utilities for secure Docker connections
*/
var TLS = class {
	/**
	* Load TLS certificates from a directory
	* @param certPath Path to directory containing ca.pem, cert.pem, and key.pem files
	* @returns TLS options object for HTTPS agent
	*/
	static async loadCertificates(certPath) {
		const tlsOptions = {};
		try {
			const caPath = (0, node_path.join)(certPath, "ca.pem");
			try {
				tlsOptions.ca = await node_fs.promises.readFile(caPath);
			} catch {}
			const certPemPath = (0, node_path.join)(certPath, "cert.pem");
			try {
				tlsOptions.cert = await node_fs.promises.readFile(certPemPath);
			} catch {}
			const keyPath = (0, node_path.join)(certPath, "key.pem");
			try {
				tlsOptions.key = await node_fs.promises.readFile(keyPath);
			} catch {}
			return tlsOptions;
		} catch (error) {
			throw new Error(`Failed to load TLS certificates from ${certPath}: ${getErrorMessage(error)}`, { cause: error });
		}
	}
};

//#endregion
//#region lib/multiplexed-stream.ts
function demultiplexStream(stdout, stderr) {
	let buffer = new Uint8Array(0);
	return new node_stream.Writable({ write(chunk, encoding, cb) {
		try {
			const data = chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk);
			const newBuffer = new Uint8Array(buffer.length + data.length);
			newBuffer.set(buffer, 0);
			newBuffer.set(data, buffer.length);
			buffer = newBuffer;
			while (buffer.length >= 8) {
				const streamType = buffer[0];
				const contentSize = buffer[4] << 24 | buffer[5] << 16 | buffer[6] << 8 | buffer[7];
				if (buffer.length >= 8 + contentSize) {
					const content = buffer.slice(8, 8 + contentSize);
					if (streamType === 1) {
						stdout.write(Buffer.from(content));
					} else if (streamType === 2) {
						stderr.write(Buffer.from(content));
					}
					buffer = buffer.slice(8 + contentSize);
				} else {
					break;
				}
			}
			cb();
		} catch (error) {
			cb(error);
		}
	} });
}

//#endregion
//#region lib/json-stream.ts
async function* jsonMessages(response) {
	if (!response.body) {
		throw new Error("No response body");
	}
	const contentType = response.headers.get("content-type") || "";
	const charsetMatch = contentType.match(/charset=([^;]+)/i);
	let charset = "utf-8";
	if (charsetMatch && charsetMatch[1]) {
		charset = charsetMatch[1].trim();
	}
	const reader = response.body.getReader();
	const decoder = new TextDecoder(charset);
	let buffer = "";
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) {
				break;
			}
			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split("\n");
			buffer = lines.pop() || "";
			for (const line of lines) {
				const trimmedLine = line.trim();
				if (trimmedLine !== "") {
					try {
						yield JSON.parse(trimmedLine);
					} catch (error) {
						console.warn("Failed to parse JSON line:", trimmedLine, error);
					}
				}
			}
		}
		if (buffer.trim() !== "") {
			try {
				yield JSON.parse(buffer.trim());
			} catch (error) {
				console.warn("Failed to parse final JSON line:", buffer, error);
			}
		}
	} finally {
		reader.releaseLock();
	}
}

//#endregion
//#region lib/docker-client.ts
var DockerClient = class DockerClient {
	api;
	/**
	* Create a new DockerClient instance
	* You should use the static fromDockerHost or fromDockerConfig methods instead
	* @param agent Undici agent for HTTP connections
	* @param userAgent User agent string for requests (defaults to 'docker/node-sdk')
	* @param headers Optional additional headers to include in requests
	*/
	constructor(agent, userAgent = "docker/node-sdk", headers) {
		this.api = new HTTPClient(agent, userAgent, headers);
	}
	/**
	* Create a DockerClient instance from a Docker host string
	* @param dockerHost Docker host string (e.g., "unix:/var/run/docker.sock", "tcp://localhost:2376", "ssh://user@host[:port][/path/to/docker.sock]", or "/var/run/docker.sock")
	* @param certificates Optional path to directory containing TLS certificates (ca.pem, cert.pem, key.pem) for TCP connections
	* @returns Promise that resolves to a connected DockerClient instance
	*/
	static async fromDockerHost(dockerHost, certificates, userAgent, headers) {
		if (dockerHost.startsWith("unix:")) {
			const socketPath = dockerHost.substring(5);
			try {
				const agent = new SocketAgent(() => (0, node_net.createConnection)(socketPath));
				return new DockerClient(agent, userAgent, headers);
			} catch (error) {
				throw new Error(`Failed to create Docker client for ${dockerHost}: ${getErrorMessage(error)}`, { cause: error });
			}
		} else if (dockerHost.startsWith("npipe:")) {
			const socketPath = dockerHost.substring(6);
			try {
				const agent = new SocketAgent(() => (0, node_net.createConnection)(socketPath));
				return new DockerClient(agent, userAgent, headers);
			} catch (error) {
				throw new Error(`Failed to create Docker client for ${dockerHost}: ${getErrorMessage(error)}`, { cause: error });
			}
		} else if (dockerHost.startsWith("tcp:")) {
			const defaultPort = certificates ? 2376 : 2375;
			const { host, port } = parseDockerHost(dockerHost, defaultPort);
			try {
				let agent;
				if (certificates) {
					if (typeof certificates === "string") {
						const tlsOptions = await TLS.loadCertificates(certificates);
						agent = new SocketAgent(() => (0, node_tls.connect)({
							host,
							port,
							...tlsOptions
						}));
					} else {
						agent = new SocketAgent(() => (0, node_tls.connect)({
							host,
							port,
							...certificates
						}));
					}
				} else {
					agent = new SocketAgent(() => (0, node_net.createConnection)({
						host,
						port
					}));
				}
				return new DockerClient(agent, userAgent, headers);
			} catch (error) {
				throw new Error(`Failed to create Docker client for ${dockerHost}: ${getErrorMessage(error)}`, { cause: error });
			}
		} else if (dockerHost.startsWith("ssh:")) {
			try {
				const socketFactory = await SSH.createSocketFactory(dockerHost);
				const agent = new SocketAgent(socketFactory);
				return new DockerClient(agent, userAgent, headers);
			} catch (error) {
				throw new Error(`Failed to create SSH Docker client for ${dockerHost}: ${getErrorMessage(error)}`, { cause: error });
			}
		} else {
			try {
				await node_fs.promises.access(dockerHost);
				const agent = new SocketAgent(() => (0, node_net.createConnection)(dockerHost));
				return new DockerClient(agent, userAgent, headers);
			} catch (error) {}
			throw new Error(`Unsupported Docker host format: ${dockerHost}. Must start with "unix:", "tcp:", "ssh:", or be a valid file path`);
		}
	}
	/**
	* Create a DockerClient instance from a Docker context name
	* @param contextName Docker context name to search for, or uses DOCKER_CONTEXT env var if not provided
	* @returns Promise that resolves to a connected DockerClient instance
	*/
	static async fromDockerContext(contextName, userAgent, headers) {
		const targetContext = contextName || process.env.DOCKER_CONTEXT;
		if (!targetContext) {
			throw new Error("No context name provided and DOCKER_CONTEXT environment variable is not set");
		}
		const configDir = process.env.DOCKER_CONFIG || (0, node_os.homedir)();
		const contextsDir = (0, node_path.join)(configDir, ".docker", "contexts", "meta");
		const tlsDir = (0, node_path.join)(configDir, ".docker", "contexts", "tls");
		try {
			const contextEntries = await node_fs.promises.readdir(contextsDir, { withFileTypes: true });
			const contextDirs = contextEntries.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);
			for (const contextDir of contextDirs) {
				const metaJsonPath = (0, node_path.join)(contextsDir, contextDir, "meta.json");
				try {
					const metaContent = await node_fs.promises.readFile(metaJsonPath, "utf8");
					const meta = JSON.parse(metaContent);
					if (meta.Name === targetContext) {
						if (meta.Endpoints && meta.Endpoints.docker && meta.Endpoints.docker.Host) {
							const dockerHost = meta.Endpoints.docker.Host;
							let certificates = undefined;
							const tls = (0, node_path.join)(tlsDir, contextDir);
							try {
								await node_fs.promises.access(tls);
								certificates = tls;
							} catch {}
							return await DockerClient.fromDockerHost(dockerHost, certificates, userAgent, headers);
						} else {
							throw new Error(`Docker context '${targetContext}' found but has no valid Docker endpoint`);
						}
					}
				} catch (parseError) {}
			}
			throw new Error(`Docker context '${targetContext}' not found`);
		} catch (error) {
			if (isFileNotFoundError(error)) {
				throw new Error(`Docker contexts directory not found: ${contextsDir}`, { cause: error });
			}
			throw error;
		}
	}
	/**
	* Create a DockerClient instance using the current context from Docker config
	* Reads config.json from DOCKER_CONFIG env var or ~/.docker/config.json to get the currentContext and connects to it
	* @returns Promise that resolves to a connected DockerClient instance
	*/
	static async fromDockerConfig(userAgent, headers) {
		if (process.env.DOCKER_HOST) {
			return DockerClient.fromDockerHost(process.env.DOCKER_HOST, process.env.DOCKER_TLS_CERTDIR, userAgent, headers);
		}
		const configPath = process.env.DOCKER_CONFIG || (0, node_path.join)((0, node_os.homedir)(), ".docker", "config.json");
		try {
			const configContent = await node_fs.promises.readFile(configPath, "utf8");
			const config = JSON.parse(configContent);
			if (config.currentContext && config.currentContext !== "default") {
				return await DockerClient.fromDockerContext(config.currentContext, userAgent, headers);
			} else {
				let dockerhost = "unix:/var/run/docker.sock";
				if (node_os.platform() === "win32") {
					dockerhost = "npipe:////./pipe/docker_engine";
				}
				return await DockerClient.fromDockerHost(dockerhost, undefined, userAgent, headers);
			}
		} catch (error) {
			if (isFileNotFoundError(error)) {
				return DockerClient.fromDockerHost("unix:/var/run/docker.sock");
			} else if (error instanceof SyntaxError) {
				throw new Error(`Invalid JSON in Docker config file: ${configPath}`, { cause: error });
			}
			throw error;
		}
	}
	/**
	* Close the Docker client connection
	* @returns Promise that resolves when the connection is closed
	*/
	close() {
		return this.api.close();
	}
	/**
	* Encode authentication credentials for registry access
	* @param credentials Authentication credentials object
	* @returns Base64 URL-safe encoded credentials string
	*/
	authCredentials(credentials) {
		const jsonString = JSON.stringify(credentials);
		const base64 = Buffer.from(jsonString, "utf8").toString("base64");
		return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
	}
	/**
	* Validate credentials for a registry and, if available, get an identity token for accessing the registry without password.
	* Check auth configuration
	* @param authConfig Authentication to check
	*/
	async systemAuth(authConfig) {
		const response = await this.api.post("/auth", authConfig, undefined, { accept: APPLICATION_JSON });
		return response.json();
	}
	/**
	* Get data usage information
	* @param type Object types, for which to compute and return data.
	*/
	async systemDataUsage(type) {
		return this.api.getJSON("/system/df", { type });
	}
	/**
	* Stream real-time events from the server.  Various objects within Docker report events when something happens to them.  Containers report these events: `attach`, `commit`, `copy`, `create`, `destroy`, `detach`, `die`, `exec_create`, `exec_detach`, `exec_start`, `exec_die`, `export`, `health_status`, `kill`, `oom`, `pause`, `rename`, `resize`, `restart`, `start`, `stop`, `top`, `unpause`, `update`, and `prune`  Images report these events: `create`, `delete`, `import`, `load`, `pull`, `push`, `save`, `tag`, `untag`, and `prune`  Volumes report these events: `create`, `mount`, `unmount`, `destroy`, and `prune`  Networks report these events: `create`, `connect`, `disconnect`, `destroy`, `update`, `remove`, and `prune`  The Docker daemon reports these events: `reload`  Services report these events: `create`, `update`, and `remove`  Nodes report these events: `create`, `update`, and `remove`  Secrets report these events: `create`, `update`, and `remove`  Configs report these events: `create`, `update`, and `remove`  The Builder reports `prune` events
	* Monitor events
	* @param options
	* @param options.since Show events created since this timestamp then stream new events.
	* @param options.until Show events created until this timestamp then stop streaming.
	* @param options.filters Filters to process on the event list. Available filters:  - 'config' config name or ID - 'container' container name or ID - 'daemon' daemon name or ID - 'event' event type - 'image' image name or ID - 'label' image or container label - 'network' network name or ID - 'node' node ID - 'plugin' plugin name or ID - 'scope' local or swarm - 'secret' secret name or ID - 'service' service name or ID - 'type' object to filter by, one of 'container', 'image', 'volume', 'network', 'daemon', 'plugin', 'node', 'service', 'secret' or 'config' - 'volume' volume name
	*/
	async *systemEvents(options) {
		const response = await this.api.get("/events", APPLICATION_NDJSON, options);
		yield* jsonMessages(response);
	}
	/**
	* This is a dummy endpoint you can use to test if the server is accessible.
	* @returns Promise that resolves when the connection is successful and returns API version
	*/
	async systemPing() {
		const response = await this.api.head("/_ping", { accept: "text/plain" });
		return response.headers.get("api-version");
	}
	/**
	* Get system information
	*/
	async systemInfo() {
		return this.api.getJSON("/info");
	}
	/**
	* Returns the version of Docker that is running and various information about the system that Docker is running on.
	* Get version
	*/
	async systemVersion() {
		return this.api.getJSON("/version");
	}
	/**
	* Get a tar archive of a resource in the filesystem of container id.
	* Get an archive of a filesystem resource in a container
	* @param id ID or name of the container
	* @param path Resource in the container’s filesystem to archive.
	* @param out stream to write container's filesystem content as a TAR archive
	*/
	async containerArchive(id, path, out) {
		const response = await this.api.get(`/containers/${id}/archive`, "application/x-tar", { path });
		await response.body?.pipeTo(out);
	}
	/**
	* A response header `X-Docker-Container-Path-Stat` is returned, containing a base64 - encoded JSON object with some filesystem header information about the path.
	* Get information about files in a container
	* @param id ID or name of the container
	* @param path Resource in the container’s filesystem to archive.
	*/
	async containerArchiveInfo(id, path) {
		const response = await this.api.head(`/containers/${id}/archive`, { params: { path } });
		const header = response.headers.get("x-docker-container-path-stat");
		if (!header) {
			throw new Error("X-Docker-Container-Path-Stat header not found");
		}
		const json = Buffer.from(header, "base64").toString("utf-8");
		return FileInfo.fromJSON(json);
	}
	/**
	* Attach to a container to read its output or send it input. You can attach to the same container multiple times and you can reattach to containers that have been detached.  Either the `stream` or `logs` parameter must be `true` for this endpoint to do anything.  See the [documentation for the `docker attach` command](https://docs.docker.com/engine/reference/commandline/attach/) for more details.  ### Hijacking  This endpoint hijacks the HTTP connection to transport `stdin`, `stdout`, and `stderr` on the same socket.  This is the response from the daemon for an attach request:  ``` HTTP/1.1 200 OK Content-Type: application/vnd.docker.raw-stream  [STREAM] ```  After the headers and two new lines, the TCP connection can now be used for raw, bidirectional communication between the client and server.  To hint potential proxies about connection hijacking, the Docker client can also optionally send connection upgrade headers.  For example, the client sends this request to upgrade the connection:  ``` POST /containers/16253994b7c4/attach?stream=1&stdout=1 HTTP/1.1 Upgrade: tcp Connection: Upgrade ```  The Docker daemon will respond with a `101 UPGRADED` response, and will similarly follow with the raw stream:  ``` HTTP/1.1 101 UPGRADED Content-Type: application/vnd.docker.raw-stream Connection: Upgrade Upgrade: tcp  [STREAM] ```  ### Stream format  When the TTY setting is disabled in [`POST /containers/create`](#operation/ContainerCreate), the HTTP Content-Type header is set to application/vnd.docker.multiplexed-stream and the stream over the hijacked connected is multiplexed to separate out `stdout` and `stderr`. The stream consists of a series of frames, each containing a header and a payload.  The header contains the information which the stream writes (`stdout` or `stderr`). It also contains the size of the associated frame encoded in the last four bytes (`uint32`).  It is encoded on the first eight bytes like this:  ```go header := [8]byte{STREAM_TYPE, 0, 0, 0, SIZE1, SIZE2, SIZE3, SIZE4} ```  `STREAM_TYPE` can be:  - 0: `stdin` (is written on `stdout`) - 1: `stdout` - 2: `stderr`  `SIZE1, SIZE2, SIZE3, SIZE4` are the four bytes of the `uint32` size encoded as big endian.  Following the header is the payload, which is the specified number of bytes of `STREAM_TYPE`.  The simplest way to implement this protocol is the following:  1. Read 8 bytes. 2. Choose `stdout` or `stderr` depending on the first byte. 3. Extract the frame size from the last four bytes. 4. Read the extracted size and output it on the correct output. 5. Goto 1.  ### Stream format when using a TTY  When the TTY setting is enabled in [`POST /containers/create`](#operation/ContainerCreate), the stream is not multiplexed. The data exchanged over the hijacked connection is simply the raw data from the process PTY and client\'s `stdin`.
	* Attach to a container
	* @param id ID or name of the container
	* @param stdout
	* @param stderr
	* @param options
	* @param options.detachKeys Override the key sequence for detaching a container.Format is a single character '[a-Z]' or 'ctrl-&lt;value&gt;' where '&lt;value&gt;' is one of: 'a-z', '@', '^', '[', ',' or '_'.
	* @param options.logs Replay previous logs from the container.  This is useful for attaching to a container that has started and you want to output everything since the container started.  If 'stream' is also enabled, once all the previous output has been returned, it will seamlessly transition into streaming current output.
	* @param options.stream Stream attached streams from the time the request was made onwards.
	* @param options.stdin Attach to 'stdin'
	* @param options.stdout Attach to 'stdout'
	* @param options.stderr Attach to 'stderr'
	*/
	async containerAttach(id, stdout, stderr, options) {
		const response = await this.api.upgrade(`/containers/${id}/attach`, options);
		switch (response.content) {
			case DOCKER_RAW_STREAM:
				response.socket.pipe(stdout);
				break;
			case DOCKER_MULTIPLEXED_STREAM:
				if (stderr === null) {
					throw new Error("stderr is required to process multiplexed stream");
				}
				response.socket.pipe(demultiplexStream(stdout, stderr));
				break;
			default: throw new Error("Unsupported content type: " + response.content);
		}
		return new Promise((resolve, reject) => {
			response.socket.once("error", reject);
			response.socket.once("close", resolve);
		});
	}
	/**
	* Returns which files in a container\'s filesystem have been added, deleted, or modified. The `Kind` of modification can be one of:  - `0`: Modified (\"C\") - `1`: Added (\"A\") - `2`: Deleted (\"D\")
	* Get changes on a container’s filesystem
	* @param id ID or name of the container
	*/
	async containerChanges(id) {
		return this.api.getJSON(`/containers/${id}/changes`);
	}
	/**
	* Create a container
	* @param spec Container to create
	* @param options
	* @param options.name Assign the specified name to the container. Must match '/?[a-zA-Z0-9][a-zA-Z0-9_.-]+'.
	* @param options.platform Platform in the format 'os[/arch[/variant]]' used for image lookup.  When specified, the daemon checks if the requested image is present in the local image cache with the given OS and Architecture, and otherwise returns a '404' status.  If the option is not set, the host\&#39;s native OS and Architecture are used to look up the image in the image cache. However, if no platform is passed and the given image does exist in the local image cache, but its OS or architecture does not match, the container is created with the available image, and a warning is added to the 'Warnings' field in the response, for example;      WARNING: The requested image\&#39;s platform (linux/arm64/v8) does not              match the detected host platform (linux/amd64) and no              specific platform was requested
	*/
	async containerCreate(spec, options) {
		spec.Image = this.parseDockerRef(spec.Image);
		const response = await this.api.post("/containers/create", options, spec);
		return response.json();
	}
	/**
	* Remove a container
	* @param id ID or name of the container
	* @param options
	* @param options.volumes Remove anonymous volumes associated with the container.
	* @param options.force If the container is running, kill it before removing it.
	* @param options.link Remove the specified link associated with the container.
	*/
	async containerDelete(id, options) {
		await this.api.delete(`/containers/${id}`, {
			v: options?.volumes,
			force: options?.force,
			link: options?.link
		});
	}
	/**
	* Export the contents of a container as a tarball.
	* Export a container
	* @param id ID or name of the container
	* @param w stream to write container's filesystem content as a TAR archive'
	*/
	async containerExport(id, w) {
		const response = await this.api.get(`/containers/${id}/export`, "application/x-tar");
		await response.body?.pipeTo(w);
	}
	/**
	* Return low-level information about a container.
	* Inspect a container
	* @param id ID or name of the container
	* @param options
	* @param options.size Return the size of container as fields 'SizeRw' and 'SizeRootFs'
	*/
	async containerInspect(id, options) {
		return this.api.getJSON(`/containers/${id}/json`, options);
	}
	/**
	* Send a POSIX signal to a container, defaulting to killing to the container.
	* Kill a container
	* @param id ID or name of the container
	* @param options
	* @param options.signal Signal to send to the container as an integer or string (e.g. 'SIGINT').
	*/
	async containerKill(id, options) {
		await this.api.post(`/containers/${id}/kill`, options);
	}
	/**
	* Returns a list of containers. For details on the format, see the [inspect endpoint](#operation/ContainerInspect).  Note that it uses a different, smaller representation of a container than inspecting a single container. For example, the list of linked containers is not propagated .
	* List containers
	* @param options
	* @param options.all Return all containers. By default, only running containers are shown.
	* @param options.limit Return this number of most recently created containers, including non-running ones.
	* @param options.size Return the size of container as fields 'SizeRw' and 'SizeRootFs'.
	* @param options.filters Filters to process on the container list, encoded as JSON (a 'map[string][]string'). For example, '{\&quot;status\&quot;: [\&quot;paused\&quot;]}' will only return paused containers.  Available filters:  - 'ancestor''('&lt;image-name&gt;[:&lt;tag&gt;]', '&lt;image id&gt;', or '&lt;image@digest&gt;') - 'before''('&lt;container id&gt;' or '&lt;container name&gt;') - 'expose''('&lt;port&gt;[/&lt;proto&gt;]'|'&lt;startport-endport&gt;/[&lt;proto&gt;]') - 'exited'&lt;int&gt;' containers with exit code of '&lt;int&gt;' - 'health''('starting'|'healthy'|'unhealthy'|'none') - 'id'&lt;ID&gt;' a container\&#39;s ID - 'isolation''('default'|'process'|'hyperv') (Windows daemon only) - 'is-task''('true'|'false') - 'label'key' or 'label'\&quot;key'value\&quot;' of a container label - 'name'&lt;name&gt;' a container\&#39;s name - 'network''('&lt;network id&gt;' or '&lt;network name&gt;') - 'publish''('&lt;port&gt;[/&lt;proto&gt;]'|'&lt;startport-endport&gt;/[&lt;proto&gt;]') - 'since''('&lt;container id&gt;' or '&lt;container name&gt;') - 'status''('created'|'restarting'|'running'|'removing'|'paused'|'exited'|'dead') - 'volume''('&lt;volume name&gt;' or '&lt;mount point destination&gt;')
	*/
	async containerList(options) {
		return this.api.getJSON("/containers/json", options);
	}
	/**
	* Get `stdout` and `stderr` logs from a container.  Note: This endpoint works only for containers with the `json-file` or `journald` logging driver.
	* Get container logs
	* @param id ID or name of the container
	* @param stdout
	* @param stderr
	* @param options
	* @param options.follow Keep connection after returning logs.
	* @param options.stdout Return logs from 'stdout'
	* @param options.stderr Return logs from 'stderr'
	* @param options.since Only return logs since this time, as a UNIX timestamp
	* @param options.until Only return logs before this time, as a UNIX timestamp
	* @param options.timestamps Add timestamps to every log line
	* @param options.tail Only return this number of log lines from the end of the logs. Specify as an integer or 'all' to output all log lines.
	*/
	async containerLogs(id, stdout, stderr, options) {
		const demux = demultiplexStream(stdout, stderr);
		const response = await this.api.get(`/containers/${id}/logs`, "application/vnd.docker.raw-stream", options);
		await response.body?.pipeTo(node_stream.Writable.toWeb(demux));
	}
	/**
	* Use the freezer cgroup to suspend all processes in a container.  Traditionally, when suspending a process the `SIGSTOP` signal is used, which is observable by the process being suspended. With the freezer cgroup the process is unaware, and unable to capture, that it is being suspended, and subsequently resumed.
	* Pause a container
	* @param id ID or name of the container
	*/
	async containerPause(id) {
		await this.api.post(`/containers/${id}/pause`);
	}
	/**
	* Delete stopped containers
	* @param options
	* @param options.filters Filters to process on the prune list, encoded as JSON (a 'map[string][]string').  Available filters: - 'until'&lt;timestamp&gt;' Prune containers created before this timestamp. The '&lt;timestamp&gt;' can be Unix timestamps, date formatted timestamps, or Go duration strings (e.g. '10m', '1h30m') computed relative to the daemon machine’s time. - 'label' ('label'&lt;key&gt;', 'label'&lt;key&gt;'&lt;value&gt;', 'label!'&lt;key&gt;', or 'label!'&lt;key&gt;'&lt;value&gt;') Prune containers with (or without, in case 'label!'...' is used) the specified labels.
	*/
	async containerPrune(options) {
		const response = await this.api.post("/containers/prune", options);
		return response.json();
	}
	/**
	* Rename a container
	* @param id ID or name of the container
	* @param name New name for the container
	*/
	async containerRename(id, name) {
		await this.api.post(`/containers/${id}/rename?name=${name}`);
	}
	/**
	* Resize the TTY for a container.
	* Resize a container TTY
	* @param id ID or name of the container
	* @param height Height of the TTY session in characters
	* @param width Width of the TTY session in characters
	*/
	async containerResize(id, width, height) {
		await this.api.post(`/containers/${id}/resize`, {
			w: width,
			h: height
		});
	}
	/**
	* Restart a container
	* @param id ID or name of the container
	* @param options
	* @param options.signal Signal to send to the container as an integer or string (e.g. 'SIGINT').
	* @param options.timeout Number of seconds to wait before killing the container
	*/
	async containerRestart(id, options) {
		await this.api.post(`/containers/${id}/restart`, {
			signal: options?.signal,
			t: options?.timeout
		});
	}
	/**
	* Start a container
	* @param id ID or name of the container
	* @param options
	* @param options.detachKeys Override the key sequence for detaching a container. Format is a single character '[a-Z]' or 'ctrl-&lt;value&gt;' where '&lt;value&gt;' is one of: 'a-z', '@', '^', '[', ',' or '_'.
	*/
	async containerStart(id, options) {
		await this.api.post(`/containers/${id}/start`, options);
	}
	/**
	* This endpoint returns a live stream of a container’s resource usage statistics.  The `precpu_stats` is the CPU statistic of the *previous* read, and is used to calculate the CPU usage percentage. It is not an exact copy of the `cpu_stats` field.  If either `precpu_stats.online_cpus` or `cpu_stats.online_cpus` is nil then for compatibility with older daemons the length of the corresponding `cpu_usage.percpu_usage` array should be used.  On a cgroup v2 host, the following fields are not set * `blkio_stats`: all fields other than `io_service_bytes_recursive` * `cpu_stats`: `cpu_usage.percpu_usage` * `memory_stats`: `max_usage` and `failcnt` Also, `memory_stats.stats` fields are incompatible with cgroup v1.  To calculate the values shown by the `stats` command of the docker cli tool the following formulas can be used: * used_memory = `memory_stats.usage - memory_stats.stats.cache` * available_memory = `memory_stats.limit` * Memory usage % = `(used_memory / available_memory) * 100.0` * cpu_delta = `cpu_stats.cpu_usage.total_usage - precpu_stats.cpu_usage.total_usage` * system_cpu_delta = `cpu_stats.system_cpu_usage - precpu_stats.system_cpu_usage` * number_cpus = `length(cpu_stats.cpu_usage.percpu_usage)` or `cpu_stats.online_cpus` * CPU usage % = `(cpu_delta / system_cpu_delta) * number_cpus * 100.0`
	* Get container stats based on resource usage
	* @param id ID or name of the container
	* @param options
	* @param options.stream Stream the output. If false, the stats will be output once and then it will disconnect.
	* @param options.oneShot Only get a single stat instead of waiting for 2 cycles. Must be used with 'stream'false'.
	*/
	async containerStats(id, options) {
		return this.api.getJSON(`/containers/${id}/stats`, {
			stream: false,
			oneShot: options?.oneShot
		});
	}
	/**
	* Stop a container
	* @param id ID or name of the container
	* @param options
	* @param options.signal Signal to send to the container as an integer or string (e.g. 'SIGINT').
	* @param options.timeout Number of seconds to wait before killing the container
	*/
	async containerStop(id, options) {
		await this.api.post(`/containers/${id}/stop`, {
			signal: options?.signal,
			t: options?.timeout
		});
	}
	/**
	* On Unix systems, this is done by running the `ps` command. This endpoint is not supported on Windows.
	* List processes running inside a container
	* @param id ID or name of the container
	* @param options
	* @param options.psArgs The arguments to pass to 'ps'. For example, 'aux'
	*/
	async containerTop(id, options) {
		return this.api.getJSON(`/containers/${id}/top`, { ps_args: options?.psArgs });
	}
	/**
	* Resume a container which has been paused.
	* Unpause a container
	* @param id ID or name of the container
	*/
	async containerUnpause(id) {
		await this.api.post(`/containers/${id}/unpause`);
	}
	/**
	* Change various configuration options of a container without having to recreate it.
	* Update a container
	* @param id ID or name of the container
	* @param update
	*/
	async containerUpdate(id, update) {
		const response = await this.api.post(`/containers/${id}/update`, update);
		return response.json();
	}
	/**
	* Block until a container stops, then returns the exit code.
	* Wait for a container
	* @param id ID or name of the container
	* @param options
	* @param options.condition Wait until a container state reaches the given condition.  Defaults to 'not-running' if omitted or empty.
	*/
	async containerWait(id, options) {
		const response = await this.api.post(`/containers/${id}/wait`, undefined, options);
		return response.json();
	}
	/**
	* Upload a tar archive to be extracted to a path in the filesystem of container id. `path` parameter is asserted to be a directory. If it exists as a file, 400 error will be returned with message \"not a directory\".
	* Extract an archive of files or folders to a directory in a container
	* @param id ID or name of the container
	* @param path Path to a directory in the container to extract the archive’s contents into.
	* @param tar The input stream must be a tar archive compressed with one of the following algorithms: 'identity' (no compression), 'gzip', 'bzip2', or 'xz'.
	* @param options
	* @param options.noOverwriteDirNonDir If '1', 'true', or 'True' then it will be an error if unpacking the given content would cause an existing directory to be replaced with a non-directory and vice versa.
	* @param options.copyUIDGID If '1', 'true', then it will copy UID/GID maps to the dest file or dir
	*/
	async putContainerArchive(id, path, tar, options) {
		await this.api.put(`/containers/${id}/archive`, {
			path,
			noOverwriteDirNonDir: options?.noOverwriteDirNonDir,
			copyUIDGID: options?.copyUIDGID
		}, tar, "application/x-tar");
	}
	/**
	* The network must be either a local-scoped network or a swarm-scoped network with the `attachable` option set. A network cannot be re-attached to a running container
	* Connect a container to a network
	* @param id Network ID or name
	* @param container
	*/
	async networkConnect(id, container) {
		await this.api.post(`/networks/${id}/connect`, container);
	}
	/**
	* Create a network
	* @param config Network configuration
	*/
	async networkCreate(config) {
		const response = await this.api.post("/networks/create", undefined, config);
		return response.json();
	}
	/**
	* Remove a network
	* @param id Network ID or name
	*/
	async networkDelete(id) {
		await this.api.delete(`/networks/${id}`);
	}
	/**
	* Disconnect a container from a network
	* @param id Network ID or name
	* @param container
	*/
	async networkDisconnect(id, container) {
		await this.api.post(`/networks/${id}/disconnect`, container);
	}
	/**
	* Inspect a network
	* @param id Network ID or name
	* @param options
	* @param options.verbose Detailed inspect output for troubleshooting
	* @param options.scope Filter the network by scope (swarm, global, or local)
	*/
	async networkInspect(id, options) {
		return this.api.getJSON(`/networks/${id}`, options);
	}
	/**
	* Returns a list of networks. For details on the format, see the [network inspect endpoint](#operation/NetworkInspect).  Note that it uses a different, smaller representation of a network than inspecting a single network. For example, the list of containers attached to the network is not propagated in API versions 1.28 and up.
	* List networks
	* @param options
	* @param options.filters JSON encoded value of the filters (a 'map[string][]string') to process on the networks list.  Available filters:  - 'dangling'&lt;boolean&gt;' When set to 'true' (or '1'), returns all    networks that are not in use by a container. When set to 'false'    (or '0'), only networks that are in use by one or more    containers are returned. - 'driver'&lt;driver-name&gt;' Matches a network\&#39;s driver. - 'id'&lt;network-id&gt;' Matches all or part of a network ID. - 'label'&lt;key&gt;' or 'label'&lt;key&gt;'&lt;value&gt;' of a network label. - 'name'&lt;network-name&gt;' Matches all or part of a network name. - 'scope'[\&quot;swarm\&quot;|\&quot;global\&quot;|\&quot;local\&quot;]' Filters networks by scope ('swarm', 'global', or 'local'). - 'type'[\&quot;custom\&quot;|\&quot;builtin\&quot;]' Filters networks by type. The 'custom' keyword returns all user-defined networks.
	*/
	async networkList(options) {
		return this.api.getJSON("/networks", options);
	}
	/**
	* Delete unused networks
	* @param filters Filters to process on the prune list, encoded as JSON (a 'map[string][]string').  Available filters: - 'until'&lt;timestamp&gt;' Prune networks created before this timestamp. The '&lt;timestamp&gt;' can be Unix timestamps, date formatted timestamps, or Go duration strings (e.g. '10m', '1h30m') computed relative to the daemon machine’s time. - 'label' ('label'&lt;key&gt;', 'label'&lt;key&gt;'&lt;value&gt;', 'label!'&lt;key&gt;', or 'label!'&lt;key&gt;'&lt;value&gt;') Prune networks with (or without, in case 'label!'...' is used) the specified labels.
	*/
	async networkPrune(filters) {
		const response = await this.api.post("/networks/prune", filters);
		return response.json();
	}
	/**
	* Create a volume
	* @param spec Volume configuration
	*/
	async volumeCreate(spec) {
		const response = await this.api.post("/volumes/create", undefined, spec, { Accept: "*/*" });
		return response.json();
	}
	/**
	* Instruct the driver to remove the volume.
	* Remove a volume
	* @param id Volume name or ID
	* @param options
	* @param options.force Force the removal of the volume
	*/
	async volumeDelete(id, options) {
		await this.api.delete(`/volumes/${id}`, options);
	}
	/**
	* Inspect a volume
	* @param id Volume name or ID
	*/
	async volumeInspect(id) {
		return this.api.getJSON(`/volumes/${id}`);
	}
	/**
	* List volumes
	* @param filters JSON encoded value of the filters (a 'map[string][]string') to process on the volumes list. Available filters:  - 'dangling'&lt;boolean&gt;' When set to 'true' (or '1'), returns all    volumes that are not in use by a container. When set to 'false'    (or '0'), only volumes that are in use by one or more    containers are returned. - 'driver'&lt;volume-driver-name&gt;' Matches volumes based on their driver. - 'label'&lt;key&gt;' or 'label'&lt;key&gt;:&lt;value&gt;' Matches volumes based on    the presence of a 'label' alone or a 'label' and a value. - 'name'&lt;volume-name&gt;' Matches all or part of a volume name.
	*/
	async volumeList(filters) {
		return this.api.getJSON(`/volumes`, { filters });
	}
	/**
	* Delete unused volumes
	* @param filters Filters to process on the prune list, encoded as JSON (a 'map[string][]string').  Available filters: - 'label' ('label'&lt;key&gt;', 'label'&lt;key&gt;'&lt;value&gt;', 'label!'&lt;key&gt;', or 'label!'&lt;key&gt;'&lt;value&gt;') Prune volumes with (or without, in case 'label!'...' is used) the specified labels. - 'all' ('all'true') - Consider all (local) volumes for pruning and not just anonymous volumes.
	*/
	async volumePrune(filters) {
		const response = await this.api.post("/volumes/prune", { filters });
		return response.json();
	}
	/**
	* Return image digest and platform information by contacting the registry.
	* Get image information from the registry
	* @param name Image name or id
	*/
	async distributionInspect(name) {
		return this.api.getJSON(`/distribution/${name}/json`);
	}
	/**
	* Delete builder cache
	* @param reservedSpace Amount of disk space in bytes to keep for cache
	* @param maxUsedSpace Maximum amount of disk space allowed to keep for cache
	* @param minFreeSpace Target amount of free disk space after pruning
	* @param all Remove all types of build cache
	* @param filters A JSON encoded value of the filters (a &#x60;map[string][]string&#x60;) to process on the list of build cache objects.  Available filters:  - &#x60;until&#x3D;&lt;timestamp&gt;&#x60; remove cache older than &#x60;&lt;timestamp&gt;&#x60;. The &#x60;&lt;timestamp&gt;&#x60; can be Unix timestamps, date formatted timestamps, or Go duration strings (e.g. &#x60;10m&#x60;, &#x60;1h30m&#x60;) computed relative to the daemon\&#39;s local time. - &#x60;id&#x3D;&lt;id&gt;&#x60; - &#x60;parent&#x3D;&lt;id&gt;&#x60; - &#x60;type&#x3D;&lt;string&gt;&#x60; - &#x60;description&#x3D;&lt;string&gt;&#x60; - &#x60;inuse&#x60; - &#x60;shared&#x60; - &#x60;private&#x60;
	*/
	async buildPrune(options) {
		const response = await this.api.post("/build/prune", options);
		return response.json();
	}
	/**
	* Build an image from a tar archive with a `Dockerfile` in it.  The `Dockerfile` specifies how the image is built from the tar archive. It is typically in the archive\'s root, but can be at a different path or have a different name by specifying the `dockerfile` parameter. [See the `Dockerfile` reference for more information](https://docs.docker.com/engine/reference/builder/).  The Docker daemon performs a preliminary validation of the `Dockerfile` before starting the build, and returns an error if the syntax is incorrect. After that, each instruction is run one-by-one until the ID of the new image is output.  The build is canceled if the client drops the connection by quitting or being killed.
	* Build an image
	*
	* @param buildContext A tar archive compressed with one of the following algorithms: identity (no compression), gzip, bzip2, xz.
	* @param options
	* @param options.dockerfile Path within the build context to the &#x60;Dockerfile&#x60;. This is ignored if &#x60;remote&#x60; is specified and points to an external &#x60;Dockerfile&#x60;.
	* @param options.t A name and optional tag to apply to the image in the &#x60;name:tag&#x60; format. If you omit the tag the default &#x60;latest&#x60; value is assumed. You can provide several &#x60;t&#x60; parameters.
	* @param options.extrahosts Extra hosts to add to /etc/hosts
	* @param options.remote A Git repository URI or HTTP/HTTPS context URI. If the URI points to a single text file, the file's contents are placed into a file called &#x60;Dockerfile&#x60; and the image is built from that file. If the URI points to a tarball, the file is downloaded by the daemon and the contents therein used as the context for the build. If the URI points to a tarball and the &#x60;dockerfile&#x60; parameter is also specified, there must be a file with the corresponding path inside the tarball.
	* @param options.q Suppress verbose build output.
	* @param options.nocache Do not use the cache when building the image.
	* @param options.cachefrom JSON array of images used for build cache resolution.
	* @param options.pull Attempt to pull the image even if an older image exists locally.
	* @param options.rm Remove intermediate containers after a successful build.
	* @param options.forcerm Always remove intermediate containers, even upon failure.
	* @param options.memory Set memory limit for build.
	* @param options.memswap Total memory (memory + swap). Set as &#x60;-1&#x60; to disable swap.
	* @param options.cpushares CPU shares (relative weight).
	* @param options.cpusetcpus CPUs in which to allow execution (e.g., &#x60;0-3&#x60;, &#x60;0,1&#x60;).
	* @param options.cpuperiod The length of a CPU period in microseconds.
	* @param options.cpuquota Microseconds of CPU time that the container can get in a CPU period.
	* @param options.buildargs JSON map of string pairs for build-time variables. Users pass these values at build-time. Docker uses the buildargs as the environment context for commands run via the &#x60;Dockerfile&#x60; RUN instruction, or for variable expansion in other &#x60;Dockerfile&#x60; instructions. This is not meant for passing secret values.  For example, the build arg &#x60;FOO&#x3D;bar&#x60; would become &#x60;{\&quot;FOO\&quot;:\&quot;bar\&quot;}&#x60; in JSON. This would result in the query parameter &#x60;buildargs&#x3D;{\&quot;FOO\&quot;:\&quot;bar\&quot;}&#x60;. Note that &#x60;{\&quot;FOO\&quot;:\&quot;bar\&quot;}&#x60; should be URI component encoded.  [Read more about the buildargs instruction.](https://docs.docker.com/engine/reference/builder/#arg)
	* @param options.shmsize Size of &#x60;/dev/shm&#x60; in bytes. The size must be greater than 0. If omitted the system uses 64MB.
	* @param options.squash Squash the resulting images layers into a single layer. *(Experimental release only.)*
	* @param options.labels Arbitrary key/value labels to set on the image, as a JSON map of string pairs.
	* @param options.networkmode Sets the networking mode for the run commands during build. Supported standard values are: &#x60;bridge&#x60;, &#x60;host&#x60;, &#x60;none&#x60;, and &#x60;container:&lt;name|id&gt;&#x60;. Any other value is taken as a custom network\&#39;s name or ID to which this container should connect to.
	* @param options.contentType
	* @param options.xRegistryConfig This is a base64-encoded JSON object with auth configurations for multiple registries that a build may refer to.  The key is a registry URL, and the value is an auth configuration object, [as described in the authentication section](#section/Authentication). For example:  &#x60;&#x60;&#x60; {   \&quot;docker.example.com\&quot;: {     \&quot;username\&quot;: \&quot;janedoe\&quot;,     \&quot;password\&quot;: \&quot;hunter2\&quot;   },   \&quot;https://index.docker.io/v1/\&quot;: {     \&quot;username\&quot;: \&quot;mobydock\&quot;,     \&quot;password\&quot;: \&quot;conta1n3rize14\&quot;   } } &#x60;&#x60;&#x60;  Only the registry domain name (and port if not the default 443) are required. However, for legacy reasons, the Docker Hub registry must be specified with both a &#x60;https://&#x60; prefix and a &#x60;/v1/&#x60; suffix even though Docker will prefer to use the v2 registry API.
	* @param options.platform Platform in the format os[/arch[/variant]]
	* @param options.target Target build stage
	* @param options.outputs BuildKit output configuration in the format of a stringified JSON array of objects. Each object must have two top-level properties: &#x60;Type&#x60; and &#x60;Attrs&#x60;. The &#x60;Type&#x60; property must be set to \&#39;moby\&#39;. The &#x60;Attrs&#x60; property is a map of attributes for the BuildKit output configuration. See https://docs.docker.com/build/exporters/oci-docker/ for more information.  Example:  &#x60;&#x60;&#x60; [{\&quot;Type\&quot;:\&quot;moby\&quot;,\&quot;Attrs\&quot;:{\&quot;type\&quot;:\&quot;image\&quot;,\&quot;force-compression\&quot;:\&quot;true\&quot;,\&quot;compression\&quot;:\&quot;zstd\&quot;}}] &#x60;&#x60;&#x60;
	* @param options.version Version of the builder backend to use.  - &#x60;1&#x60; is the first generation classic (deprecated) builder in the Docker daemon (default) - &#x60;2&#x60; is [BuildKit](https://github.com/moby/buildkit)
	*/
	imageBuild(buildContext, options) {
		const headers = {};
		headers["Content-Type"] = "application/x-tar";
		if (options?.credentials) {
			headers["X-Registry-Config"] = this.authCredentials(options.credentials);
		}
		const request = this.api.post("/build", {
			dockerfile: options?.dockerfile,
			t: options?.tag,
			extrahosts: options?.extrahosts,
			remote: options?.remote,
			q: options?.quiet,
			nocache: options?.nocache,
			cachefrom: options?.cachefrom,
			pull: options?.pull,
			rm: options?.rm,
			forcerm: options?.forcerm,
			memory: options?.memory,
			memswap: options?.memswap,
			cpushares: options?.cpushares,
			cpusetcpus: options?.cpusetcpus,
			cpuperiod: options?.cpuperiod,
			cpuquota: options?.cpuquota,
			buildargs: options?.buildargs,
			shmsize: options?.shmsize,
			squash: options?.squash,
			labels: options?.labels,
			networkmode: options?.networkmode,
			platform: options?.platform,
			target: options?.target,
			outputs: options?.outputs,
			version: options?.version || "2"
		}, buildContext, headers);
		return {
			messages: async function* () {
				const response = await request;
				yield* jsonMessages(response);
			},
			wait: async function() {
				let id = "";
				const response = await request;
				for await (const message of jsonMessages(response)) {
					if (message.errorDetail) {
						throw new Error(message.errorDetail?.message);
					}
					if (message.id === "moby.image.id") {
						id = message?.aux?.ID || "";
					}
				}
				return id;
			}
		};
	}
	/**
	* Create a new image from a container
	* @param container The ID or name of the container to commit
	* @param repo Repository name for the created image
	* @param tag Tag name for the create image
	* @param comment Commit message
	* @param author Author of the image (e.g., &#x60;John Hannibal Smith &lt;hannibal@a-team.com&gt;&#x60;)
	* @param pause Whether to pause the container before committing
	* @param changes &#x60;Dockerfile&#x60; instructions to apply while committing
	* @param containerConfig The container configuration
	*/
	async imageCommit(container, options) {
		const response = await this.api.post(`/commit`, {
			container,
			repo: options?.repo,
			tag: options?.tag,
			comment: options?.comment,
			author: options?.author,
			pause: options?.pause,
			changes: options?.changes,
			containerConfig: options?.containerConfig
		});
		return response.json();
	}
	/**
	* Pull or import an image.
	* Create an image
	* @param options
	* @param options.fromImage Name of the image to pull. If the name includes a tag or digest, specific behavior applies:  - If only 'fromImage' includes a tag, that tag is used. - If both 'fromImage' and 'tag' are provided, 'tag' takes precedence. - If 'fromImage' includes a digest, the image is pulled by digest, and 'tag' is ignored. - If neither a tag nor digest is specified, all tags are pulled.
	* @param options.fromSrc Source to import. The value may be a URL from which the image can be retrieved or '-' to read the image from the request body. This parameter may only be used when importing an image.
	* @param options.repo Repository name given to an image when it is imported. The repo may include a tag. This parameter may only be used when importing an image.
	* @param options.tag Tag or digest. If empty when pulling an image, this causes all tags for the given image to be pulled.
	* @param options.message Set commit message for imported image.
	* @param options.credentials A base64url-encoded auth configuration.  Refer to the [authentication section](#section/Authentication) for details.
	* @param options.changes Apply 'Dockerfile' instructions to the image that is created, for example: 'changes'ENV DEBUG'true'. Note that 'ENV DEBUG'true' should be URI component encoded.  Supported 'Dockerfile' instructions: 'CMD'|'ENTRYPOINT'|'ENV'|'EXPOSE'|'ONBUILD'|'USER'|'VOLUME'|'WORKDIR'
	* @param options.platform Platform in the format os[/arch[/variant]].  When used in combination with the 'fromImage' option, the daemon checks if the given image is present in the local image cache with the given OS and Architecture, and otherwise attempts to pull the image. If the option is not set, the host\&#39;s native OS and Architecture are used. If the given image does not exist in the local image cache, the daemon attempts to pull the image with the host\&#39;s native OS and Architecture. If the given image does exists in the local image cache, but its OS or architecture does not match, a warning is produced.  When used with the 'fromSrc' option to import an image from an archive, this option sets the platform information for the imported image. If the option is not set, the host\&#39;s native OS and Architecture are used for the imported image.
	* @param options.inputImage Image content if the value '-' has been specified in fromSrc query parameter
	*/
	imageCreate(options) {
		const headers = {};
		if (options?.credentials) {
			headers["X-Registry-Auth"] = this.authCredentials(options.credentials);
		}
		let ref = this.parseDockerRef(options?.fromImage);
		const request = this.api.post("/images/create", {
			fromImage: ref,
			fromSrc: options?.fromSrc,
			repo: options?.repo,
			tag: options?.tag || "latest",
			message: options?.message,
			changes: options?.changes,
			platform: options?.platform,
			inputImage: options?.inputImage
		}, undefined, headers);
		return {
			messages: async function* () {
				const response = await request;
				yield* jsonMessages(response);
			},
			wait: async function() {
				let digest = "";
				const response = await request;
				for await (const message of jsonMessages(response)) {
					if (message.errorDetail) {
						throw new Error(message.errorDetail?.message);
					}
					if (message.status?.startsWith("Digest: ")) {
						digest = message.status.substring(8);
					}
				}
				return digest;
			}
		};
	}
	parseDockerRef(ref) {
		if (ref && !ref.includes("/")) {
			ref = `docker.io/library/${ref}`;
		} else if (ref && ref.startsWith("docker.io/") && ref.split("/").length === 2) {
			ref = ref.replace("docker.io/", "docker.io/library/");
		}
		return ref;
	}
	/**
	* Remove an image, along with any untagged parent images that were referenced by that image.  Images can\'t be removed if they have descendant images, are being used by a running container or are being used by a build.
	* Remove an image
	* @param name Image name or ID
	* @param options
	* @param options.force Remove the image even if it is being used by stopped containers or has other tags
	* @param options.noprune Do not delete untagged parent images
	* @param options.platforms Select platform-specific content to delete. Multiple values are accepted. Each platform is a OCI platform encoded as a JSON string.
	*/
	async imageDelete(name, options) {
		const response = await this.api.delete(`/images/${name}`, options);
		return response.json();
	}
	/**
	* Get a tarball containing all images and metadata for a repository.  If `name` is a specific name and tag (e.g. `ubuntu:latest`), then only that image (and its parents) are returned. If `name` is an image ID, similarly only that image (and its parents) are returned, but with the exclusion of the `repositories` file in the tarball, as there were no image names referenced.  ### Image tarball format  An image tarball contains [Content as defined in the OCI Image Layout Specification](https://github.com/opencontainers/image-spec/blob/v1.1.1/image-layout.md#content).  Additionally, includes the manifest.json file associated with a backwards compatible docker save format.  If the tarball defines a repository, the tarball should also include a `repositories` file at the root that contains a list of repository and tag names mapped to layer IDs.  ```json {   \"hello-world\": {     \"latest\": \"565a9d68a73f6706862bfe8409a7f659776d4d60a8d096eb4a3cbce6999cc2a1\"   } } ```
	* Export an image
	* @param name Image name or ID
	* @param w stream to write the tarball to
	* @param platform JSON encoded OCI platform describing a platform which will be used to select a platform-specific image to be saved if the image is multi-platform. If not provided, the full multi-platform image will be saved.  Example: &#x60;{\&quot;os\&quot;: \&quot;linux\&quot;, \&quot;architecture\&quot;: \&quot;arm\&quot;, \&quot;variant\&quot;: \&quot;v5\&quot;}&#x60;
	*/
	async imageGet(name, w, platform) {
		const response = await this.api.get(`/images/${name}/get`, "application/x-tar", { platform });
		await response.body?.pipeTo(w);
	}
	/**
	* Get a tarball containing all images and metadata for several image repositories.  For each value of the `names` parameter: if it is a specific name and tag (e.g. `ubuntu:latest`), then only that image (and its parents) are returned; if it is an image ID, similarly only that image (and its parents) are returned and there would be no names referenced in the \'repositories\' file for this image ID.  For details on the format, see the [export image endpoint](#operation/ImageGet).
	* Export several images
	* @param names Image names to filter by
	* @param platform JSON encoded OCI platform(s) which will be used to select the platform-specific image(s) to be saved if the image is multi-platform. If not provided, the full multi-platform image will be saved.  Example: &#x60;{\&quot;os\&quot;: \&quot;linux\&quot;, \&quot;architecture\&quot;: \&quot;arm\&quot;, \&quot;variant\&quot;: \&quot;v5\&quot;}&#x60;
	*/
	async imageGetAll(names, platform) {
		const response = await this.api.get(`/images/get`, "application/x-tar", {
			names,
			platform
		});
		if (!response.body) {
			throw new Error("No response body");
		}
		return response.body;
	}
	/**
	* Return parent layers of an image.
	* Get the history of an image
	* @param name Image name or ID
	* @param options
	* @param options.platform JSON-encoded OCI platform to select the platform-variant. If omitted, it defaults to any locally available platform, prioritizing the daemon\&#39;s host platform.  If the daemon provides a multi-platform image store, this selects the platform-variant to show the history for. If the image is a single-platform image, or if the multi-platform image does not provide a variant matching the given platform, an error is returned.  Example: '{\&quot;os\&quot;: \&quot;linux\&quot;, \&quot;architecture\&quot;: \&quot;arm\&quot;, \&quot;variant\&quot;: \&quot;v5\&quot;}'
	*/
	async imageHistory(name, options) {
		return this.api.getJSON(`/image/${name}/history`, options);
	}
	/**
	* Return low-level information about an image.
	* Inspect an image
	* @param name Image name or id
	* @param options
	* @param options.manifests Include Manifests in the image summary.
	*/
	async imageInspect(name, options) {
		return this.api.getJSON(`/images/${name}/json`, options);
	}
	/**
	* Returns a list of images on the server. Note that it uses a different, smaller representation of an image than inspecting a single image.
	* List Images
	* @param options
	* @param options.all Show all images. Only images from a final layer (no children) are shown by default.
	* @param options.filters A JSON encoded value of the filters (a 'map[string][]string') to process on the images list.  Available filters:  - 'before''('&lt;image-name&gt;[:&lt;tag&gt;]',  '&lt;image id&gt;' or '&lt;image@digest&gt;') - 'dangling'true' - 'label'key' or 'label'\&quot;key'value\&quot;' of an image label - 'reference''('&lt;image-name&gt;[:&lt;tag&gt;]') - 'since''('&lt;image-name&gt;[:&lt;tag&gt;]',  '&lt;image id&gt;' or '&lt;image@digest&gt;') - 'until'&lt;timestamp&gt;'
	* @param options.sharedSize Compute and show shared size as a 'SharedSize' field on each image.
	* @param options.digests Show digest information as a 'RepoDigests' field on each image.
	* @param options.manifests Include 'Manifests' in the image summary.
	*/
	async imageList(options) {
		return this.api.getJSON("/images/json", options);
	}
	/**
	* Load a set of images and tags into a repository.  For details on the format, see the [export image endpoint](#operation/ImageGet).
	* Import images
	* @param quiet Suppress progress details during load.
	* @param platform JSON encoded OCI platform(s) which will be used to select the platform-specific image(s) to load if the image is multi-platform. If not provided, the full multi-platform image will be loaded.  Example: &#x60;{\&quot;os\&quot;: \&quot;linux\&quot;, \&quot;architecture\&quot;: \&quot;arm\&quot;, \&quot;variant\&quot;: \&quot;v5\&quot;}&#x60;
	* @param imagesTarball Tar archive containing images
	*/
	async imageLoad(imagesTarball, options) {
		await this.api.post(`/images/load`, options, imagesTarball, { "Content-Type": "application/x-tar" });
	}
	/**
	* Delete unused images
	* @param filters Filters to process on the prune list, encoded as JSON (a &#x60;map[string][]string&#x60;). Available filters:  - &#x60;dangling&#x3D;&lt;boolean&gt;&#x60; When set to &#x60;true&#x60; (or &#x60;1&#x60;), prune only    unused *and* untagged images. When set to &#x60;false&#x60;    (or &#x60;0&#x60;), all unused images are pruned. - &#x60;until&#x3D;&lt;string&gt;&#x60; Prune images created before this timestamp. The &#x60;&lt;timestamp&gt;&#x60; can be Unix timestamps, date formatted timestamps, or Go duration strings (e.g. &#x60;10m&#x60;, &#x60;1h30m&#x60;) computed relative to the daemon machine’s time. - &#x60;label&#x60; (&#x60;label&#x3D;&lt;key&gt;&#x60;, &#x60;label&#x3D;&lt;key&gt;&#x3D;&lt;value&gt;&#x60;, &#x60;label!&#x3D;&lt;key&gt;&#x60;, or &#x60;label!&#x3D;&lt;key&gt;&#x3D;&lt;value&gt;&#x60;) Prune images with (or without, in case &#x60;label!&#x3D;...&#x60; is used) the specified labels.
	*/
	async imagePrune(filters) {
		const response = await this.api.post(`/images/prune`, { filters });
		return response.json();
	}
	/**
	* Push an image to a registry.  If you wish to push an image on to a private registry, that image must already have a tag which references the registry. For example, `registry.example.com/myimage:latest`.  The push is cancelled if the HTTP connection is closed.
	* Push an image
	* @param name Name of the image to push. For example, &#x60;registry.example.com/myimage&#x60;. The image must be present in the local image store with the same name.  The name should be provided without tag; if a tag is provided, it is ignored. For example, &#x60;registry.example.com/myimage:latest&#x60; is considered equivalent to &#x60;registry.example.com/myimage&#x60;.  Use the &#x60;tag&#x60; parameter to specify the tag to push.
	* @param options push options including credentials
	* @param options.credentials A base64url-encoded auth configuration.  Refer to the [authentication section](#section/Authentication) for details.
	* @param options.tag Tag of the image to push. For example, &#x60;latest&#x60;. If no tag is provided, all tags of the given image that are present in the local image store are pushed.
	* @param options.platform JSON-encoded OCI platform to select the platform-variant to push. If not provided, all available variants will attempt to be pushed.  If the daemon provides a multi-platform image store, this selects the platform-variant to push to the registry. If the image is a single-platform image, or if the multi-platform image does not provide a variant matching the given platform, an error is returned.  Example: &#x60;{\&quot;os\&quot;: \&quot;linux\&quot;, \&quot;architecture\&quot;: \&quot;arm\&quot;, \&quot;variant\&quot;: \&quot;v5\&quot;}&#x60;
	*/
	imagePush(name, options) {
		const headers = {};
		if (options?.credentials) {
			headers["X-Registry-Auth"] = this.authCredentials(options.credentials);
		}
		const request = this.api.post(`/images/${name}/push`, {
			tag: options?.tag,
			platform: options?.platform
		}, undefined, headers);
		return {
			messages: async function* () {
				const response = await request;
				yield* jsonMessages(response);
			},
			wait: async function() {
				const response = await request;
				for await (const message of jsonMessages(response)) {
					if (message.errorDetail) {
						throw new Error(message.errorDetail?.message);
					}
				}
			}
		};
	}
	/**
	* Tag an image so that it becomes part of a repository.
	* Tag an image
	* @param name Image name or ID to tag.
	* @param repo The repository to tag in. For example, &#x60;someuser/someimage&#x60;.
	* @param tag The name of the new tag.
	*/
	async imageTag(name, repo, tag) {
		await this.api.post(`/images/${name}/tag`, {
			repo,
			tag
		});
	}
	/**
	* Run a command inside a running container
	* Create an exec instance
	* @param id ID or name of container
	* @param execConfig Exec configuration options
	* @returns Promise that resolves to exec instance ID response
	*/
	async containerExec(id, execConfig) {
		const response = await this.api.post(`/containers/${id}/exec`, undefined, execConfig);
		return response.json();
	}
	/**
	* Return low-level information about an exec instance
	* Inspect an exec instance
	* @param id Exec instance ID
	* @returns Promise that resolves to exec instance details
	*/
	async execInspect(id) {
		return this.api.getJSON(`/exec/${id}/json`);
	}
	/**
	* Resize the TTY session used by an exec instance
	* Resize an exec instance
	* @param id Exec instance ID
	* @param width Width of the TTY session in characters
	* @param height Height of the TTY session in characters
	* @returns Promise that resolves when the resize is complete
	*/
	async execResize(id, width, height) {
		await this.api.post(`/exec/${id}/resize`, {
			w: width,
			h: height
		});
	}
	/**
	* Start an exec instance
	* @param id Exec instance ID
	* @param stdout Optional stream to write stdout content
	* @param stderr Optional stream to write stderr content
	* @param execStartConfig Configuration options for starting the exec instance
	* @returns Promise that resolves when the exec instance completes
	*/
	async execStart(id, stdout, stderr, execStartConfig) {
		if (execStartConfig?.Detach) {
			await this.api.post(`/exec/${id}/start`, execStartConfig);
		} else {
			if (isWritable(stdout)) {
				const response = await this.api.upgrade(`/exec/${id}/start`, execStartConfig);
				switch (response.content) {
					case DOCKER_RAW_STREAM:
						response.socket.pipe(stdout);
						break;
					case DOCKER_MULTIPLEXED_STREAM: if (isWritable(stderr)) {
						response.socket.pipe(demultiplexStream(stdout, stderr));
						break;
					} else {
						throw new Error("stderr is required to process multiplexed stream");
					}
					default: throw new Error("Unsupported content type: " + response.content);
				}
				return new Promise((resolve, reject) => {
					response.socket.once("error", reject);
					response.socket.once("close", resolve);
				});
			} else {
				throw new Error("stdout is required to process stream");
			}
		}
	}
};
function isWritable(w) {
	return w !== null;
}

//#endregion
//#region lib/logs.ts
var Logger = class extends node_stream.Writable {
	buffer = "";
	callback;
	constructor(callback) {
		super({ objectMode: false });
		this.callback = callback;
	}
	_write(chunk, encoding, callback) {
		console.log(chunk.toString());
		try {
			this.buffer += chunk.toString();
			let newlineIndex;
			while ((newlineIndex = this.buffer.indexOf("\n")) !== -1) {
				const line = this.buffer.substring(0, newlineIndex);
				this.buffer = this.buffer.substring(newlineIndex + 1);
				this.callback(line);
			}
			callback();
		} catch (error) {
			callback(error instanceof Error ? error : new Error(String(error)));
		}
	}
	_final(callback) {
		try {
			if (this.buffer.length > 0) {
				this.callback(this.buffer);
				this.buffer = "";
			}
			callback();
		} catch (error) {
			callback(error instanceof Error ? error : new Error(String(error)));
		}
	}
};

//#endregion
//#region lib/registry.ts
/**
* OCI Distribution Specification media types
*/
const MediaTypes = {
	MANIFEST_V2: "application/vnd.docker.distribution.manifest.v2+json",
	MANIFEST_LIST_V2: "application/vnd.docker.distribution.manifest.list.v2+json",
	OCI_MANIFEST_V1: "application/vnd.oci.image.manifest.v1+json",
	OCI_INDEX_V1: "application/vnd.oci.image.index.v1+json",
	CONTAINER_IMAGE_V1: "application/vnd.docker.container.image.v1+json",
	OCI_CONFIG_V1: "application/vnd.oci.image.config.v1+json",
	IMAGE_LAYER: "application/vnd.docker.image.rootfs.diff.tar.gzip",
	IMAGE_LAYER_FOREIGN: "application/vnd.docker.image.rootfs.foreign.diff.tar.gzip",
	OCI_LAYER: "application/vnd.oci.image.layer.v1.tar+gzip"
};
/**
* Custom error class for registry-specific errors
*/
var RegistryError = class extends Error {
	code;
	statusCode;
	detail;
	constructor(message, code, statusCode, detail) {
		super(message);
		this.name = "RegistryError";
		this.code = code;
		this.statusCode = statusCode;
		this.detail = detail;
	}
};
/**
* OCI Registry Client
*
* Implements the OCI Distribution Specification for interacting with container registries.
* Supports manifest operations, blob operations, and tag management.
*
* @example
* ```typescript
* const client = new RegistryClient('https://registry-1.docker.io', {
*   username: 'myuser',
*   password: 'mypassword'
* });
*
* // Read a manifest
* const manifest = await client.getManifest('library/nginx', 'latest');
*
* // List tags
* const tags = await client.listTags('library/nginx');
* ```
*/
var RegistryClient = class {
	baseUrl;
	auth;
	agent;
	userAgent;
	bearerToken;
	tokenExpiry;
	/**
	* Create a new RegistryClient
	*
	* @param baseUrl - Base URL of the registry (e.g., 'https://registry-1.docker.io')
	* @param auth - Optional authentication credentials
	* @param agent - Optional undici Agent for custom connection handling
	* @param userAgent - Optional custom User-Agent header
	*/
	constructor(baseUrl, auth, agent, userAgent = "oci-registry-client/1.0") {
		this.baseUrl = baseUrl.replace(/\/$/, "");
		this.auth = auth;
		this.agent = agent;
		this.userAgent = userAgent;
	}
	/**
	* Close the client and cleanup resources
	*/
	async close() {
		if (this.agent) {
			await this.agent.destroy();
		}
	}
	/**
	* Get a manifest from the registry
	*
	* @param repository - Repository name (e.g., 'library/nginx')
	* @param reference - Tag or digest (e.g., 'latest' or 'sha256:...')
	* @returns The manifest object (either Manifest or Index depending on media type)
	*
	* @example
	* ```typescript
	* const manifest = await client.getManifest('library/nginx', 'latest');
	* console.log(manifest.config.digest);
	* ```
	*/
	async getManifest(repository, reference) {
		const url = `${this.baseUrl}/v2/${repository}/manifests/${reference}`;
		const headers = this.buildHeaders({ Accept: [
			MediaTypes.OCI_MANIFEST_V1,
			MediaTypes.OCI_INDEX_V1,
			MediaTypes.MANIFEST_V2,
			MediaTypes.MANIFEST_LIST_V2
		].join(", ") });
		const response = await this.fetch(url, { headers });
		await this.handleResponse(response);
		return response.json();
	}
	/**
	* Check if a manifest exists and get its digest
	*
	* @param repository - Repository name
	* @param reference - Tag or digest
	* @returns The manifest digest from the Docker-Content-Digest header
	*
	* @example
	* ```typescript
	* const digest = await client.headManifest('library/nginx', 'latest');
	* console.log(digest); // sha256:...
	* ```
	*/
	async resolve(repository, reference) {
		const url = `${this.baseUrl}/v2/${repository}/manifests/${reference}`;
		const headers = this.buildHeaders({ Accept: [
			MediaTypes.OCI_MANIFEST_V1,
			MediaTypes.OCI_INDEX_V1,
			MediaTypes.MANIFEST_V2,
			MediaTypes.MANIFEST_LIST_V2
		].join(", ") });
		const response = await this.fetch(url, {
			method: "HEAD",
			headers
		});
		await this.handleResponse(response);
		const digest = response.headers.get("Docker-Content-Digest");
		if (!digest) {
			throw new Error("Docker-Content-Digest header not found in response");
		}
		return digest;
	}
	/**
	* Push a manifest to the registry
	*
	* @param repository - Repository name
	* @param reference - Tag or digest
	* @param manifest - The manifest object to push
	* @returns The digest of the uploaded manifest
	*
	* @example
	* ```typescript
	* const manifest = {
	*   schemaVersion: 2,
	*   mediaType: MediaTypes.OCI_MANIFEST_V1,
	*   config: {...},
	*   layers: [...]
	* };
	* const digest = await client.putManifest('myrepo/myimage', 'v1.0', manifest);
	* ```
	*/
	async putManifest(repository, reference, manifest) {
		const url = `${this.baseUrl}/v2/${repository}/manifests/${reference}`;
		const body = JSON.stringify(manifest);
		const headers = this.buildHeaders({
			"Content-Type": manifest.mediaType || MediaTypes.OCI_MANIFEST_V1,
			"Content-Length": String(Buffer.byteLength(body))
		});
		const response = await this.fetch(url, {
			method: "PUT",
			headers,
			body
		});
		await this.handleResponse(response);
		const digest = response.headers.get("Docker-Content-Digest");
		if (!digest) {
			throw new Error("Docker-Content-Digest header not found in response");
		}
		return digest;
	}
	/**
	* Delete a manifest from the registry
	*
	* @param repository - Repository name
	* @param digest - Manifest digest (must be a digest, not a tag)
	*
	* @example
	* ```typescript
	* await client.deleteManifest('myrepo/myimage', 'sha256:abc123...');
	* ```
	*/
	async deleteManifest(repository, digest) {
		if (!digest.startsWith("sha256:") && !digest.startsWith("sha512:")) {
			throw new Error("deleteManifest requires a digest, not a tag");
		}
		const url = `${this.baseUrl}/v2/${repository}/manifests/${digest}`;
		const headers = this.buildHeaders();
		const response = await this.fetch(url, {
			method: "DELETE",
			headers
		});
		await this.handleResponse(response);
	}
	/**
	* Get a blob from the registry
	*
	* @param repository - Repository name
	* @param digest - Blob digest
	* @returns ReadableStream of the blob content
	*
	* @example
	* ```typescript
	* const stream = await client.getBlob('library/nginx', 'sha256:abc123...');
	* // Pipe to file or process the stream
	* ```
	*/
	async getBlob(repository, digest) {
		const url = `${this.baseUrl}/v2/${repository}/blobs/${digest}`;
		const headers = this.buildHeaders();
		const response = await this.fetch(url, { headers });
		await this.handleResponse(response);
		if (!response.body) {
			throw new Error("No response body received");
		}
		return response.body;
	}
	/**
	* Check if a blob exists
	*
	* @param repository - Repository name
	* @param digest - Blob digest
	* @returns Boolean indicating if the blob exists
	*
	* @example
	* ```typescript
	* const exists = await client.headBlob('library/nginx', 'sha256:abc123...');
	* if (!exists) {
	*   // Upload the blob
	* }
	* ```
	*/
	async headBlob(repository, digest) {
		const url = `${this.baseUrl}/v2/${repository}/blobs/${digest}`;
		const headers = this.buildHeaders();
		const response = await this.fetch(url, {
			method: "HEAD",
			headers
		});
		return response.status === 200;
	}
	/**
	* Delete a blob from the registry
	*
	* @param repository - Repository name
	* @param digest - Blob digest
	*
	* @example
	* ```typescript
	* await client.deleteBlob('myrepo/myimage', 'sha256:abc123...');
	* ```
	*/
	async deleteBlob(repository, digest) {
		const url = `${this.baseUrl}/v2/${repository}/blobs/${digest}`;
		const headers = this.buildHeaders();
		const response = await this.fetch(url, {
			method: "DELETE",
			headers
		});
		await this.handleResponse(response);
	}
	/**
	* Initiate a blob upload
	*
	* @param repository - Repository name
	* @returns Upload location URL
	*
	* @example
	* ```typescript
	* const uploadUrl = await client.initiateUpload('myrepo/myimage');
	* // Use uploadUrl for chunked upload or monolithic upload
	* ```
	*/
	async initiateUpload(repository) {
		const url = `${this.baseUrl}/v2/${repository}/blobs/uploads/`;
		const headers = this.buildHeaders();
		const response = await this.fetch(url, {
			method: "POST",
			headers
		});
		await this.handleResponse(response);
		const location = response.headers.get("Location");
		if (!location) {
			throw new Error("Location header not found in upload initiation response");
		}
		if (location.startsWith("http://") || location.startsWith("https://")) {
			return location;
		}
		return `${this.baseUrl}${location}`;
	}
	/**
	* Upload a blob in a single request (monolithic upload)
	*
	* @param repository - Repository name
	* @param blob - Blob content as ReadableStream or Buffer
	* @param digest - Expected digest of the blob
	* @returns The digest of the uploaded blob
	*
	* @example
	* ```typescript
	* const blobData = Buffer.from('layer content...');
	* const digest = await client.uploadBlob('myrepo/myimage', blobData, 'sha256:abc123...');
	* ```
	*/
	async uploadBlob(repository, blob, digest) {
		const uploadUrl = await this.initiateUpload(repository);
		const url = new URL(uploadUrl);
		url.searchParams.set("digest", digest);
		const headers = this.buildHeaders({ "Content-Type": "application/octet-stream" });
		const body = blob instanceof Buffer ? blob : blob;
		const response = await this.fetch(url.toString(), {
			method: "PUT",
			headers,
			body
		});
		await this.handleResponse(response);
		const resultDigest = response.headers.get("Docker-Content-Digest");
		if (!resultDigest) {
			throw new Error("Docker-Content-Digest header not found in response");
		}
		return resultDigest;
	}
	/**
	* List tags for a repository
	*
	* @param repository - Repository name
	* @param n - Maximum number of tags to return (optional)
	* @param last - Last tag from previous request for pagination (optional)
	* @returns TagsList containing repository name and array of tags
	*
	* @example
	* ```typescript
	* const tags = await client.listTags('library/nginx');
	* console.log(tags.tags); // ['latest', '1.21', '1.20', ...]
	*
	* // With pagination
	* const firstPage = await client.listTags('library/nginx', 10);
	* const secondPage = await client.listTags('library/nginx', 10, firstPage.tags[9]);
	* ```
	*/
	async listTags(repository, n, last) {
		const url = new URL(`${this.baseUrl}/v2/${repository}/tags/list`);
		if (n !== undefined) {
			url.searchParams.set("n", String(n));
		}
		if (last !== undefined) {
			url.searchParams.set("last", last);
		}
		const headers = this.buildHeaders();
		const response = await this.fetch(url.toString(), { headers });
		await this.handleResponse(response);
		return response.json();
	}
	/**
	* Check if the registry supports the OCI Distribution API
	*
	* @returns Boolean indicating if the v2 API is supported
	*
	* @example
	* ```typescript
	* const isSupported = await client.checkVersion();
	* if (!isSupported) {
	*   throw new Error('Registry does not support OCI Distribution API v2');
	* }
	* ```
	*/
	async checkVersion() {
		const url = `${this.baseUrl}/v2/`;
		const headers = this.buildHeaders();
		const response = await this.fetch(url, { headers });
		return response.status === 200;
	}
	/**
	* Ping the registry to check connectivity and authentication
	*
	* Sends a GET request to the /v2/ endpoint and verifies the response is 200 OK.
	* This is useful for checking if the registry is reachable and if credentials are valid.
	*
	* @returns Promise that resolves if the registry responds with 200 OK
	* @throws Error if the registry is not reachable or returns a non-200 status
	*
	* @example
	* ```typescript
	* try {
	*   await client.ping();
	*   console.log('Registry is reachable');
	* } catch (error) {
	*   console.error('Registry is not reachable:', error);
	* }
	* ```
	*/
	async ping() {
		const url = `${this.baseUrl}/v2/`;
		const headers = this.buildHeaders();
		const response = await this.fetch(url, { headers });
		if (response.status !== 200) {
			throw new Error(`Registry ping failed: ${response.status} ${response.statusText}`);
		}
	}
	/**
	* Build request headers with authentication
	*/
	buildHeaders(additional) {
		const headers = {
			"User-Agent": this.userAgent,
			...additional
		};
		if (this.bearerToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
			headers.Authorization = `Bearer ${this.bearerToken}`;
		} else if (this.auth?.token) {
			headers.Authorization = `Bearer ${this.auth.token}`;
		} else if (this.auth?.identityToken) {
			headers.Authorization = `Bearer ${this.auth.identityToken}`;
		} else if (this.auth?.username && this.auth?.password) {
			const credentials = Buffer.from(`${this.auth.username}:${this.auth.password}`).toString("base64");
			headers.Authorization = `Basic ${credentials}`;
		}
		return headers;
	}
	/**
	* Wrapper around fetch to use the configured agent
	*/
	async fetch(url, options) {
		const fetchOptions = {
			...options,
			dispatcher: this.agent
		};
		try {
			return await (0, undici.fetch)(url, fetchOptions);
		} catch (error) {
			if (error instanceof Error && error.message.includes("401")) {
				await this.handleAuthChallenge(url);
				return (0, undici.fetch)(url, {
					...fetchOptions,
					headers: this.buildHeaders(options?.headers)
				});
			}
			throw error;
		}
	}
	/**
	* Handle authentication challenges (WWW-Authenticate)
	*/
	async handleAuthChallenge(url) {
		const response = await (0, undici.fetch)(url, {
			dispatcher: this.agent,
			headers: { "User-Agent": this.userAgent }
		});
		if (response.status === 401) {
			const wwwAuth = response.headers.get("WWW-Authenticate");
			if (wwwAuth && wwwAuth.startsWith("Bearer ")) {
				const challenge = this.parseAuthChallenge(wwwAuth);
				if (challenge.realm) {
					await this.fetchBearerToken(challenge.realm, challenge.service, challenge.scope);
				}
			}
		}
	}
	/**
	* Parse WWW-Authenticate challenge header
	*/
	parseAuthChallenge(header) {
		const challenge = {};
		const params = header.substring(7);
		const regex = /(\w+)="([^"]+)"/g;
		let match;
		while ((match = regex.exec(params)) !== null) {
			const key = match[1];
			const value = match[2];
			if (key === "realm" || key === "service" || key === "scope") {
				challenge[key] = value;
			}
		}
		return challenge;
	}
	/**
	* Fetch a bearer token from the auth service
	*/
	async fetchBearerToken(realm, service, scope) {
		const url = new URL(realm);
		if (service) {
			url.searchParams.set("service", service);
		}
		if (scope) {
			url.searchParams.set("scope", scope);
		}
		const headers = { "User-Agent": this.userAgent };
		if (this.auth?.username && this.auth?.password) {
			const credentials = Buffer.from(`${this.auth.username}:${this.auth.password}`).toString("base64");
			headers.Authorization = `Basic ${credentials}`;
		}
		const response = await (0, undici.fetch)(url.toString(), {
			headers,
			dispatcher: this.agent
		});
		if (!response.ok) {
			throw new Error(`Failed to fetch bearer token: ${response.status}`);
		}
		const tokenResponse = await response.json();
		this.bearerToken = tokenResponse.token || tokenResponse.access_token;
		if (tokenResponse.expires_in) {
			this.tokenExpiry = Date.now() + tokenResponse.expires_in * 1e3;
		}
	}
	/**
	* Handle response errors
	*/
	async handleResponse(response) {
		if (!response.ok) {
			let errorMessage = `Registry request failed: ${response.status} ${response.statusText}`;
			let errorCode = "UNKNOWN";
			let detail = undefined;
			try {
				const contentType = response.headers.get("Content-Type");
				if (contentType?.includes("application/json")) {
					const errorResponse = await response.json();
					if (errorResponse.errors && errorResponse.errors.length > 0) {
						const firstError = errorResponse.errors[0];
						if (firstError) {
							errorMessage = firstError.message;
							errorCode = firstError.code;
							detail = firstError.detail;
						}
					}
				}
			} catch {}
			throw new RegistryError(errorMessage, errorCode, response.status, detail);
		}
	}
};

//#endregion
exports.APPLICATION_JSON = APPLICATION_JSON;
exports.APPLICATION_NDJSON = APPLICATION_NDJSON;
exports.ConflictError = ConflictError;
exports.DOCKER_MULTIPLEXED_STREAM = DOCKER_MULTIPLEXED_STREAM;
exports.DOCKER_RAW_STREAM = DOCKER_RAW_STREAM;
exports.DockerClient = DockerClient;
exports.FileInfo = FileInfo;
exports.Filter = Filter;
exports.HTTPClient = HTTPClient;
exports.Logger = Logger;
exports.MediaTypes = MediaTypes;
exports.NotFoundError = NotFoundError;
exports.RegistryClient = RegistryClient;
exports.RegistryError = RegistryError;
exports.SSH = SSH;
exports.SocketAgent = SocketAgent;
exports.TLS = TLS;
exports.UnauthorizedError = UnauthorizedError;
exports.demultiplexStream = demultiplexStream;
//# sourceMappingURL=index.cjs.map