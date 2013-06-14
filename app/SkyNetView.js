/*

SkyNetView Interface
by Graham Robertson

Provides a layer of abstraction for communicating with the view of this
application.  This simply makes creation of the controller more feasible and
helps keep code DRY, dude.

*/

function SkyNetView() {
	/* Global Vars */
	var _html = document.getElementsByTagName('html')[0];
	var _statusLabels = document.getElementById('status_feedback').getElementsByTagName('li');
	
	var _videoPicker = document.getElementById('video_picker');
	var _videoOptions = _videoPicker.getElementsByTagName('input');
	
	var _flightControl = document.getElementById('flight_controls');
	var _flightControlButtons = _flightControl.getElementsByTagName('a');
	
	var _video = document.getElementById('video_feed');
	
	
	var _timer = false;
	var _pendingState = false;
	
	var _isLoading = true;
	var _isFlying = false;
	
	/* Helpers and Handlers */
	var constructor = function() {
		addClass('Loading');
		_video.autoplay = true;
	};
	
	var addClass = function(newClass) {
		var classes = _html.className.split(' ');
		var size = classes.length;
		if (!size) {
			_html.className = newClass;
			return;
		}
		
		for (var i = 0; i < size; i++) {
			if (newClass == classes[i])
				return;
		}
		_html.className += ' ' + newClass;
	};
	
	var replaceClass = function(oldClass, newClass) {
		var classes = _html.className.split(' ');
		var size = classes.length;
		if (!size) {
			_html.className = newClass;
			return;
		}
		
		for (var i = 0; i < size; i++) {
			if (newClass == classes[i])
				return;
			else if (oldClass == classes[i]) {
				classes.splice(i, 1);
				i--;
			}
		}
		
		_html.className = classes.join(' ') + ' ' + newClass;
	};
	
	var removeClass = function(oldClass) {
		var classes = _html.className.split(' ');
		var size = classes.length;
		if (!size)
			return;
		
		for (var i = 0; i < size; i++) {
			if (oldClass == classes[i]) {
				classes.splice(i, 1);
				i--;
			}
		}
		
		_html.className = classes.join(' ');
	};
	
	var onTimer = function() {
		clearTimeout(_timer);
		_timer = false;
		if (_pendingState) {
			var state = _pendingState;
			_pendingState = false;
			setState(state);
		}
	};
	
	/* API */
	this.getVideo = function() {
		return _video;
	};
	
	this.getFlightControls = function() {
		return _flightControlButtons;
	};
	
	this.getVideoPicker = function() {
		return _videoPicker;
	};
	
	this.getVideoOptions = function() {
		return _videoPickerOptions;
	};
	
	this.setAltitude = function(height) {
		_statusLabels[1].innerHTML = height + 'm';
	};
	
	this.setSpeed = function(speed) {
		_statusLabels[2].innerHTML = speed;
	};
	
	this.setPitch = function(angle) {
		_statusLabels[3].innerHTML = angle + '&deg;';
	};
	
	this.setRoll = function(angle) {
		_statusLabels[4].innerHTML = angle + '&deg;';
	};
	
	this.setBattery = function(level) {
		_statusLabels[0].innerHTML = level + '%';
	};
	
	this.load = function() {
		setState('Loading');
	};
	
	this.panic = function() {
		setState('Panic');
	};
	
	this.stopPanic = function() {
		removeClass('Panic');
	};
	
	this.fly = function() {
		setState('Flying');
	};
	
	this.land = function() {
		setState('Landed');
	};
	
	this.showAltitudeControl = function() {
		setState('Altitude');
	};
	
	this.hideAltitudeControl = function() {
		removeClass('Altitude');
	};
	
	this.openVideoPicker = function() {
		setState('Video');
	};
	
	this.closeVideoPicker = function() {
		removeClass('Video');
	};
	
	var setState = this.setState = function(state) {
		if (_timer)
			_pendingState = state;
		else if (!_isLoading && state == SkyNetView.LOADING_STATE) {
			addClass('Loading');
			_isLoading = true;
			_timer = setTimeout(onTimer, 1000);
		} else {
			switch (state) {
				case SkyNetView.FLYING_STATE:
					if (!_isFlying)
						replaceClass('Landed', state);
					else
						addClass(state);
					_isFlying = true;
					break;
				case SkyNetView.LANDING_STATE:
					if (_isFlying)
						replaceClass('Flying', state);
					else
						addClass(state);
					_isFlying = false;
					break;
				case SkyNetView.ALTITUDE_STATE:
					if (_isFlying)
						addClass(state);
					break;
				case SkyNetView.PANIC_STATE:
					if (_isFlying)
						addClass(state);
					break;
				case SkyNetView.VIDEO_STATE:
					addClass(state);
					break;
				default:
					_html.className = state;
					break;
			}
			if (_isLoading) {
				_isLoading = false;
				removeClass('Loading');
			}
		}
	};
	
	constructor();
};
// STATE CONSTANTS
SkyNetView.LOADING_STATE = 'Loading';
SkyNetView.FLYING_STATE = 'Flying';
SkyNetView.LANDING_STATE = 'Landed';
SkyNetView.ALTITUDE_STATE = 'Altitude';
SkyNetView.PANIC_STATE = 'Panic';
SkyNetView.VIDEO_STATE = 'Video';