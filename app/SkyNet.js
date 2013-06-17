/*

SkyNet
by Graham Robertson

Abstracts communicating with an ARDrone to simple commands and events. This is
responsible for consuming all data (parsing, abstracting), as well as preparing
commands to be sent, but it doesn't do any of the actual sending. Instead, it
uses a passed ARDroneCommunicator as an argument (or some other object which
satisfies the same interface) to send and receive commands to and fro the drone.

**Requires**
	- ARDroneCommunicatorInterface
		Not a file you necessarily have to include. You could technically throw
		in a dictionary into "_droneCommunicator" and it would work. This
		interface satisfies how we are going to NETWORK using udp with the drone.
		Since JavaScript currently has no means to do this, this interface
		provides a way for chatting with platform specific functionality.  This
		exists within an interface as to abstract that functionality away from
		the SkyNet model so that it remains as platform independent as possible.
	- EventDispatcher
	- TypeUtil

*/
(function privateStaticScope() {
	/*
	
		PRIVATE CLASSES
		This is a collection of classes we need to make things easier.  You can
		find the Public SkyNet class and its API below this section.
		
	*/
	// Static class for sequencing (might make this static methods on Command)
	var Sequence = new (function Sequence() {
		var _sequence = 0;
		
		this.next = function() {
			return ++_sequence;
		};
		
		this.reset = function() {
			_sequence = 0;
		};
	})();
	//
	
	// Socket Classes
	function Socket(port, protocol, type) {
		this.socketID = null;
		this.port = port;
		this.protocol = protocol;
		this.type = type;
	};
	Socket.UDP = 'udp';
	Socket.TCP = 'tcp';
	Socket.CONNECT = 'connect';
	Socket.BIND = 'bind';
	
	function CommandSocket() {
		this.inheritFrom = Socket;
		this.inheritFrom(5559, Socket.UDP, Socket.CONNECT);
		delete this.inheritFrom;
	};
	
	function VideoSocket() {
		this.inheritFrom = Socket;
		this.inheritFrom(5555, Socket.TCP, Socket.CONNECT);
		delete this.inheritFrom;
	};
	
	function AtSocket() {
		this.inheritFrom = Socket;
		this.inheritFrom(5556, Socket.UDP, Socket.BIND);
		delete this.inheritFrom;
	};
	
	function NavSocket() {
		this.inheritFrom = Socket;
		this.inheritFrom(5554, Socket.UDP, Socket.BIND);
		delete this.inheritFrom;
	};
	//
	
	// Maintains data for sending commands to the drone
	function Command = function(command, parts) {
		this.command = command;
		this.parts = parts;
		
		// override default toString function
		this.toString = function() {
			var rtrnMe = 'AT*';
			rtrnMe += this.command;
			rtrnMe += '=';
			rtrnMe += Sequence.next();
			if (parts) {
				rtrnMe += ',';
				rtrnMe += parts.join(',');
				rtrnMe += '\r';
			}
		};
	};
	
	
	function FlightCommand = function(mode) {
		this.inheritFrom = Command;
		this.inheritFrom('REF', [mode]);
		delete this.inheritFrom;
	};
	FlightCommand.FLY = 290718208;
	FlightCommand.LAND = 290717696;
	
	
	function ConfigCommand = function(option, value) {
		this.inheritFrom = Command;
		this.inheritFrom('CONFIG', [option, '"' + value + '"']);
		delete this.inheritFrom;
	};
	ConfigCommand.OPTIONS = [
		'"control:euler_angle_max"',
		'"control:indoor_euler_angle_max"',
		'"control:outdoor_euler_angle_max"',
		'"control:outdoor"',
		'"general:navdata_demo"'
	];
	
	
	function NavCommand = function(enabled, verticalSpeed, angularSpeed, frontBackTilt, leftRightTilt) {
		this.inheritFrom = Command;
		this.inheritFrom('PCMD', [
			(enabled ? 1 : 0),
			TypeUtil.float32ToInt32(leftRightTilt),
			TypeUtil.float32ToInt32(frontBackTilt),
			TypeUtil.float32ToInt32(verticalSpeed),
			TypeUtil.float32ToInt32(angularSpeed)
		]);
		delete this.inheritFrom;
	};
	//
	
	// Event Classes
	function SkyNetEvent() {
		// Put stuff here for controls and views and junk
	};
	//
	/**/
	
	/*
	****************************************************************************
	
		K, now for the MOST important part.  The SKYNET part.  The MODEL!
	
	****************************************************************************
	*/
	
	/* Skynet Class */
	var SkyNet = window.SkyNet = function(_droneCommunicator) {
		var __self__ = this;
		
		/* INHERITENCE - EventDispatcher */
		this.inheritFrom = EventDispatcher;
		this.inheritFrom();
		delete this.inheritFrom;
		/**/
		
		/* PROPERTIES */
		var SENSITIVITY = 0.11;
		
		var NAV_COMMAND = 'PCMD';
		
		var INCREASE = 1.0;
		var DECREASE = -1.0;
		var RESET = 0.0;
		
		var _enabled = false;
		var _verticalSpeed = RESET;
		var _angularSpeed = RESET;
		var _frontBackTilt = RESET;
		var _leftRightTilt = RESET;
		var _mode = FlightCommand.LAND;
		
		var _sockets = {
			'command': new CommandSocket(),
			'at': new AtSocket(),
			'navigation': new NavSocket(),
			'video': new VideoSocket()
		};
		var _socketsToLoad = Object.keys(_sockets).length;
		var _socketsConnected = 0;
		/**/
		
		/* HELPERS AND HANDLERS */
		var onSocketConnected = function(e) {
			if (++_socketsConnected == _sockets.length) {
				sendKeepAliveCommand();
				sendFlatTrim();
				sendSensitivity();
				sendOutdoors(false);
				
				_enabled = true;
				
				__self__.dispatchEvent(SkyNet.CONNECTED, new SkyNetEvent());
			}
		};
		
		var onDataReveived = function(e) {
			if (e.data.byteLength > 0) {
				// Here must parse data kind of like so:
				/*
					navData.parseData(data.data);
					if (debug && prevState != navData.data.controlState) {
						console.log(navData.data);
						prevState = navData.data.controlState;
					}
				*/
				__self__.dispatchEvent(SkyNet.DATA_RECEIVED, new SkyNetEvent());
			}
		};
		
		var sendKeepAliveCommand = function() {
			var socket = _sockets['navigation'];
			var prevState = null;
			
			_droneCommunicator.send(socket, (new Uint8Array([1]).buffer));
			_droneCommunicator.read(socket, onDataReceived);
		};
		
		var sendFlatTrim = function() {
			sendCommands([new Command('FTRIM')]);
		};
		
		var sendSensitivity = function() {
			sendCommands([
				new ConfigCommand(ConfigCommand.OPTIONS[0], SENSITIVITY),
				new ConfigCommand(ConfigCommand.OPTIONS[1], SENSITIVITY),
				new ConfigCommand(ConfigCommand.OPTIONS[2], SENSITIVITY)
			]);
		};
		
		var sendOutdoors = function(isOutdoors) {
			sendCommands([
				new ConfigCommand(ConfigCommand.OPTIONS[3], isOutdoors ? 'TRUE' : 'FALSE');
			]);
		};
		
		var sendAllNavData = function() {
			sendCommands([
				new ConfigCommand(ConfigCommand.OPTIONS[4], 'FALSE');
			]);
		};
		
		var loop = function() {
			sendCommands([
				new FlightCommand(_mode),
				new NavCommand(
					_enabled,
					_verticalSpeed,
					_angularSpeed,
					_frontBackTilt,
					_leftRightTilt
				)
			]);
			sendKeepAliveCommand();
			setTimeout(loop, 60);
		};
		
		var sendCommands = function(commandArray) {
			var socket = _sockets['at'];
			var commandBuffer = Util.stringToArrayBuffer(commandArray.join(""));
			_droneCommunicator.send(socket, commandArray);
		};
		/**/
		
		/* API */
		// VERTICAL
		this.up = function() {
			_verticalSpeed = INCREASE;
		};
		
		this.down = function() {
			_verticalSpeed = DECREASE;
		};
		
		this.hover = function() {
			_verticalSpeed = RESET;
		};
		//
		
		// FORWARDS/BACKWARDS
		this.forward = function() {
			_frontBackTilt = INCREASE;
		};
		
		this.backward = function() {
			_frontBackTilt = DECREASE;
		};
		
		this.stop = function() {
			_frontBackTilt = RESET;
		};
		//
		
		// LEFT-RIGHT TILT
		this.leftTilt = function() {
			_leftRightTilt = DECREASE;
		};
		
		this.rightTilt = function() {
			_leftRightTilt = INCREASE;
		};
		
		this.noTilt = function() {
			_leftRightTilt = RESET;
		};
		//
		
		// ANGULAR SPEED
		this.rotateLeft = function() {
			_angularSpeed = DECREASE;
		};
		
		this.rotateRight = function() {
			_angularSpeed = INCREASE;
		};
		
		this.stopRotate = function() {
			_angularSpeed = RESET;
		};
		//
		
		// I'M OUT OF CONTROLL!!!!!!!
		this.panic = function() {
			// AHHHHHH!  STOP ALL THE THINGS!!
			_verticalSpeed = RESET;
			_frontBackTilt = RESET;
			_leftRightTilt = RESET;
			_angularSpeed = RESET;
			__self__.dispatchEvent(SkyNet.PANIC, new SkyNetEvent());
		};
		//
		
		// EITHER WE FLY OR LAND
		this.fly = function() {
			_mode = FlightCommand.FLY;
		};
		
		this.land = function() {
			_mode = FlightCommand.LAND;
		};
		//
		
		// MUST CALL THIS TO BEGIN -- add your event listeners beforehand :)
		this.connect = function() {
			_droneCommunicator.init(function() {
				for (var i = 0; i < _sockets.length; i++)
					_droneCommunicator.connectSocket(_socket[i], onSocketConnected);
			});
		};
		/**/
	};
	SkyNet.CONNECTED = 'connected';
	SkyNet.DATA_RECEIVED = 'data_received';
	SkyNet.PANIC = 'panic';
})();