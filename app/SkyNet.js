/*

SkyNet
by Graham Robertson

Abstracts communicating with an ARDrone to simple commands and data reading.
This is responsible for consuming all data (parsing, abstracting), as well as
preparing commands to be sent, but it doesn't do any of the actual sending.
Instead, it uses a passed ARCommunicator as an argument to send and
receive commands to and fro the drone.

*/
function SkyNet(_communicator) {
	var __self__ = this;
	
	var SENSITIVITY = 0.11;
	
	
};