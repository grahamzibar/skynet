/*

ARCommunicator
by Graham Robertson

Abstracts communicating with an ARDrone to simple commands and data reading.
This is responsible for consuming all data (parsing, abstracting), as well as
preparing commands to be sent, but it doesn't do any of the actual sending.
Instead, it uses a passed ARDroneCommunicator as an argument to send and
receive commands from the drone.

*/