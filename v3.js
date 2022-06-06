v3 = {
	subtract: function(a, b) {
		return [a[0]-b[0],
				a[1]-b[1], 
				a[2]-b[2]];
	},
	cross: function(a, b) {
		return [a[1] * b[2] - a[2] * b[1],
          		a[2] * b[0] - a[0] * b[2],
          		a[0] * b[1] - a[1] * b[0]];
	},
	normalize: function(v) {
		var length = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
		length = Math.max(length, 0.00001);
		return [v[0]/length, v[1]/length, v[2]/length];
	},
	random: function() {
		return [Math.random(), Math.random(), Math.random()];
	},
	length: function(v) {
		return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
	},
	multiply: function(a, b) {
		return [a[0]*b[0], a[1]*b[1], a[2]*b[2]];
	},
	multiplyScalar: function(v, s) {
		return [s*v[0], s*v[1], s*v[2]];
	},
	add: function(a, b) {
		return [a[0]+b[0],
				a[1]+b[1], 
				a[2]+b[2]];
	},
	addScalar: function(v, s) {
		return [s + v[0], s + v[1], s + v[2]];
	},

};