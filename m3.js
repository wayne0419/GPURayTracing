var m3 = {
	multiply: function(a, b) {
		var a00 = a[0 * 3 + 0];
		var a01 = a[0 * 3 + 1];
		var a02 = a[0 * 3 + 2];
		var a10 = a[1 * 3 + 0];
		var a11 = a[1 * 3 + 1];
		var a12 = a[1 * 3 + 2];
		var a20 = a[2 * 3 + 0];
		var a21 = a[2 * 3 + 1];
		var a22 = a[2 * 3 + 2];

		var b00 = b[0 * 3 + 0];
		var b01 = b[0 * 3 + 1];
		var b02 = b[0 * 3 + 2];
		var b10 = b[1 * 3 + 0];
		var b11 = b[1 * 3 + 1];
		var b12 = b[1 * 3 + 2];
		var b20 = b[2 * 3 + 0];
		var b21 = b[2 * 3 + 1];
		var b22 = b[2 * 3 + 2];

		return [
			a00*b00 + a01*b10 + a02*b20, a00*b01 + a01*b11 + a02*b21, a00*b02 + a01*b12 + a02*b22,
			a10*b00 + a11*b10 + a12*b20, a10*b01 + a11*b11 + a12*b21, a10*b02 + a11*b12 + a12*b22,
			a20*b00 + a21*b10 + a22*b20, a20*b01 + a21*b11 + a22*b21, a20*b02 + a21*b12 + a22*b22
		];
	},
	transpose: function(m) {
		var m00 = m[0];
		var m01 = m[1];
		var m02 = m[2];
		var m10 = m[3];
		var m11 = m[4];
		var m12 = m[5];
		var m20 = m[6];
		var m21 = m[7];
		var m22 = m[8];
		
		return [
			m00, m10, m20,
			m01, m11, m21,
			m02, m12, m22
		]
	}
	,
	translate: function(tx, ty) {
		return [1, 0, tx,
				0, 1, ty,
				0, 0, 1];
	},
	scale: function(sx, sy) {
		return [sx, 0, 0,
				0, sy, 0,
				0, 0, 1];
	},
	rotate: function(degree) {
		r = degree/180.0 * Math.PI;
		c = Math.cos(r);
		s = Math.sin(r);
		return [c, s, 0,
				-s, c, 0,
				0, 0, 1];
	},
	identity: function() {
		return [1, 0, 0,
				0, 1, 0,
				0, 0, 1];
	},
	projection: function(x_resolution, y_resolution) {
		var projection_matrix = m3.scale(1/x_resolution, 1/y_resolution);
		projection_matrix = m3.multiply(m3.scale(2, 2), projection_matrix);
		projection_matrix = m3.multiply(m3.translate(-1, -1), projection_matrix);
		return projection_matrix;
	}

}