/*

TypeUtil

A utility class that helps covert things from one type to another (primarily for
networking data purposes)

*/

TypeUtil = (function TypeUtil() {
	this.stringToArrayBuffer = function(string) {
		var buffer = new ArrayBuffer(string.length);
		var view = new Uint8Array(buffer);

		for (var i = 0; i < string.length; i++)
			view[i] = string.charCodeAt(i);

		return buffer;
	};

	this.float32ToInt32 = function(floatValue) {
		var buffer = new ArrayBuffer(4)
		var view = new DataView(buffer);

		view.setFloat32(0, floatValue, true);
		return view.getInt32(0, true);
	};

	this.uint8ToArrayBuffer = function(intValue) {
		return (new Uint8Array([intValue])).buffer;
	};

	this.uint8ArrayToString = function(uintArrayValue) {
		var string = "";
		for (var i = 0; i < uintArrayValue.length; i++)
			string += String.fromCharCode(uintArrayValue[i]);
		return string;
	};

	this.uint8ArrayToHex = function(uintArrayValue) {
		var string = "";

		for (var i = 0; i < uintArrayValue.length; i++) {
			if (i)
				string += " ";
			string += uintArrayValue[i].toString(16)
		}
		return string;
	};
})();