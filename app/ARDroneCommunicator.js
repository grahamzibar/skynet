/*

ARDroneCommunicator
by Graham Robertson

This Communicator is a swappable class. Use this one, or build yourself another.
Essentially, the idea is the means by which we communicate with the ARDrone can
be easily replaced to cater to the platform you're building upon (be it this
class for BlackBerry 10 which hooks into the extensions created to chat with
BlackBerry 10's native layer or some other class that perhaps uses Chrome
extensions so this can be packaged as a chrome app).

**Requires**
	SocketInterface
		Not a file to include.  Just an interface you need to account for...

*/

// We won't be dispatching events anymore.. so how should we handle callbacks?
(function privateStaticScope() {
	function SocketConnectedEvent(socketID) {
		this.socketID = socketID;
	};
	
	function DataReceivedEvent(socketID, data) {
		this.socketID = socketID;
		this.data = data;
	};
	
	function InitializedEvent(success) {
		this.success = success;
		// usually false if there's no WiFi
	};
	
	window.ARDroneCommunicator = function() {
		var _droneIP = '192.168.1.1';
		var _clientIP = null;
		
		var getClientIP = function(callback) {
			// ask our native layer what the ip address is of our device.
		};
		
		var isConnected = function() {
			// Here, we must ensure we're connected via WiFi to our drone.
			// Show a toast if we have not.  Once we're connected, 
		};
		
		this.connectSocket = function(isocket, callback) {
			var ip = isocket.type == 'bind' ? _clientIP : _droneIP;
			// Call BlackBerry 10 custom extension
			isocket.id = 'TEST';
			callback(new SockedConnectedEvent(isocket.id));
		};
		
		this.send = function(socket, data) {
			// Call BlackBerry 10 custom extension
		};
		
		this.read = function(socket, callback) {
			callback(new DataReceivedEvent(socket.id, 'HELLO WORLD'));
		};
		
		this.init = function(callback) {
			// Any prep that needs to be done.  Here, it's mostly checking to
			// see if WebWorks is ready and then fetching the client's
			// IP Address for socketing purposes.
			callback(new InitializedEvent);
		};
	};
})();