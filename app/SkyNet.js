/*

SkyNet
by Graham Robertson

Abstracts communicating with an ARDrone to simple commands and events. This is
responsible for consuming all data (parsing, abstracting), as well as preparing
commands to be sent, but it doesn't do any of the actual sending. Instead, it
uses a passed ARDroneCommunicator as an argument (or some other object which
satisfies the same interface) to send and receive commands to and fro the drone.

**Requires**
ARDroneCommunicatorInterface
	(not a file you necessarily have to include.  You could technically throw
	in a dictionary into "_droneCommunicator" and it would work).

*/
(function privateStaticScope() {
	var DRONE_IP = '192.168.1.1';
	
	/*
		A Thought...
		
		I might switch this Socket *logic* to another file... perhaps this
		should be a part of the communicator interface?? Then maybe we could
		include connect() and send() in the Socket class itself?  That makes a
		whole lot of sense!
		
		This would make Socket the ARDroneCommunicator.  *TODO!*
	 */
	function Socket(ip, port, protocol, type) {
		this.socketID = null;
		this.ip = ip;
		this.port = port;
		this.protocol = protocol;
		this.type = type;
	};
	
	/*
		Continuing the above comments, CommandSocket and VideoSocket would each
		be an instance of our interchangeable Communicator class.. which would
		be interesting!  Not sure how intuitive that would be though... much
		to think about!
	 */
	function CommandSocket() {
		this.inheritFrom = Socket;
		this.inheritFrom(DRONE_IP, 5559, 'udp', 'connect');
		delete this.inheritFrom;
	};
	
	function VideoSocket() {
		this.inheritFrom = Socket;
		this.inheritFrom(DRONE_IP, 5555, 'tcp', 'connect');
		delete this.inheritFrom;
	};
	
	/* Skynet Class */
	window.SkyNet = function(_droneCommunicator) {
		var __self__ = this;
		
		/* PROPERTIES */
		var FLY =  290718208;
		var LAND = 290717696;
		var SENSITIVITY = 0.11;
		
		var CONFIG_COMMAND = 'CONFIG';
		var FLIGHT_COMMAND = 'REF';
		var NAV_COMMAND = 'PCMD';
		
		var CONFIG_OPTIONS = [
			'control:euler_angle_max',
			'control:indoor_euler_angle_max',
			'control:outdoor_euler_angle_max',
			'control:outdoor'
		];
		
		var NAV_OPTIONS = [
			'general:navdata_demo'
		];
		
		
		
		/**/
		
		/* HELPERS AND HANDLERS */
		
		/**/
		
		/* API */
		this.adjustSpeed = function() {
			
		};
		
		this.setSpeed = function() {
			
		};
		
		this.adjustAltitude = function() {
			
		};
		
		this.setAltitude = function() {
			
		};
		
		this.fly = function() {
			
		};
		
		this.land = function() {
			
		};
		
		this.connect = function() {
			
		};
		/**/
	};
})();