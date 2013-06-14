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
	(not a file to include.  Just an interface you need to
	account for...)
EventDispatcher

*/
(function privateStaticScope() {
	function SocketConnectedEvent(socketID) {
		this.socketID = socketID;
	};
	
	function DataReceivedEvent(socketID, data) {
		this.socketID = socketID;
		this.data = data;
	};
	
	window.ARDroneCommunicator = function() {
		var __self__ = this;
		
		this.inheritFrom = EventDispatcher;
		this.inheritFrom();
		delete this.inheritFrom;
		
		var onSocketConnected = function(e) {
			__self__.dispatchEvent(
				ARDroneCommunicator.SOCKET_CONNECTED,
				{}//new SocketConnectedEvent(e.socketID)
			);
		};
		
		var onDataReceived = function(e) {
			__self__.dispatchEvent(
				ARDroneCommunicator.DATA_RECEIVED,
				{}//new DataReceivedEvent(e.socketID, e.data)
			);
		};
		
		this.connect = function(socketInterface) {
			// Call BlackBerry 10 custom extension
		};
		
		this.send = function(socket, data) {
			// Call BlackBerry 10 custom extension
		};
		
	};
	ARDroneCommunicator.SOCKET_CONNECTED = 1;
	ARDroneCommunicator.DATA_RECEIVED = 2;
})();