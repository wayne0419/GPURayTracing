var m4 = {
	multiply: function(a, b) {
		var a00 = a[0 * 4 + 0];
		var a01 = a[0 * 4 + 1];
		var a02 = a[0 * 4 + 2];
		var a03 = a[0 * 4 + 3];
		var a10 = a[1 * 4 + 0];
		var a11 = a[1 * 4 + 1];
		var a12 = a[1 * 4 + 2];
		var a13 = a[1 * 4 + 3];
		var a20 = a[2 * 4 + 0];
		var a21 = a[2 * 4 + 1];
		var a22 = a[2 * 4 + 2];
		var a23 = a[2 * 4 + 3];
		var a30 = a[3 * 4 + 0];
		var a31 = a[3 * 4 + 1];
		var a32 = a[3 * 4 + 2];
		var a33 = a[3 * 4 + 3];

		var b00 = b[0 * 4 + 0];
		var b01 = b[0 * 4 + 1];
		var b02 = b[0 * 4 + 2];
		var b03 = b[0 * 4 + 3];
		var b10 = b[1 * 4 + 0];
		var b11 = b[1 * 4 + 1];
		var b12 = b[1 * 4 + 2];
		var b13 = b[1 * 4 + 3];
		var b20 = b[2 * 4 + 0];
		var b21 = b[2 * 4 + 1];
		var b22 = b[2 * 4 + 2];
		var b23 = b[2 * 4 + 3];
		var b30 = b[3 * 4 + 0];
		var b31 = b[3 * 4 + 1];
		var b32 = b[3 * 4 + 2];
		var b33 = b[3 * 4 + 3];

		return [
			a00*b00 + a01*b10 + a02*b20 + a03*b30, 
			a00*b01 + a01*b11 + a02*b21 + a03*b31, 
			a00*b02 + a01*b12 + a02*b22 + a03*b32, 
			a00*b03 + a01*b13 + a02*b23 + a03*b33,

			a10*b00 + a11*b10 + a12*b20 + a13*b30, 
			a10*b01 + a11*b11 + a12*b21 + a13*b31, 
			a10*b02 + a11*b12 + a12*b22 + a13*b32,
			a10*b03 + a11*b13 + a12*b23 + a13*b33,

			a20*b00 + a21*b10 + a22*b20 + a23*b30, 
			a20*b01 + a21*b11 + a22*b21 + a23*b31, 
			a20*b02 + a21*b12 + a22*b22 + a23*b32, 
			a20*b03 + a21*b13 + a22*b23 + a23*b33,

			a30*b00 + a31*b10 + a32*b20 + a33*b30, 
			a30*b01 + a31*b11 + a32*b21 + a33*b31, 
			a30*b02 + a31*b12 + a32*b22 + a33*b32, 
			a30*b03 + a31*b13 + a32*b23 + a33*b33
		];
	},
	transpose: function(m) {
		var m00 = m[0];
		var m01 = m[1];
		var m02 = m[2];
		var m03 = m[3];
		var m10 = m[4];
		var m11 = m[5];
		var m12 = m[6];
		var m13 = m[7];
		var m20 = m[8];
		var m21 = m[9];
		var m22 = m[10];
		var m23 = m[11];
		var m30 = m[12];
		var m31 = m[13];
		var m32 = m[14];
		var m33 = m[15];
		
		return [
			m00, m10, m20, m30,
			m01, m11, m21, m31,
			m02, m12, m22, m32,
			m03, m13, m23, m33
		];
	}
	,
	translate: function(tx, ty, tz) {
		return [1, 0, 0, tx,
				0, 1, 0, ty,
				0, 0, 1, tz,
				0, 0, 0, 1];
	},
	scale: function(sx, sy, sz) {
		return [sx, 0, 0, 0,
				0, sy, 0, 0,
				0, 0, sz, 0,
				0, 0, 0, 1];
	},
	shearX: function(shy, shz) {
		return [1, 0, 0, 0,
				shy, 1, 0, 0,
				shz, 0, 1, 0,
				0, 0, 0, 1];
	},
	shearY: function(shx, shz) {
		return [1, shx, 0, 0,
				0, 1, 0, 0,
				0, shz, 1, 0,
				0, 0, 0, 1];
	},
	shearZ: function(shx, shy) {
		return [1, 0, shx, 0,
				0, 1, shy, 0,
				0, 0, 1, 0,
				0, 0, 0, 1];
	},
	rotateX: function(degree) {
		r = degree/180.0 * Math.PI;
		c = Math.cos(r);
		s = Math.sin(r);
		return [1, 0, 0, 0,
				0, c, -s, 0,
				0, s, c, 0,
				0, 0, 0, 1];
	},
	rotateY: function(degree) {
		r = degree/180.0 * Math.PI;
		c = Math.cos(r);
		s = Math.sin(r);
		return [c, 0, s, 0,
				0, 1, 0, 0,
				-s, 0, c, 0,
				0, 0, 0, 1];
	},
	rotateZ: function(degree) {
		r = degree/180.0 * Math.PI;
		c = Math.cos(r);
		s = Math.sin(r);
		return [c, -s, 0, 0,
				s, c, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1];
	},
	identity: function() {
		return [1, 0, 0, 0,
				0, 1, 0, 0,
				0, 0, 1, 0,
				0, 0, 0, 1];
	},
	inverse: function(m) {
		var m00 = m[0 * 4 + 0];
		var m01 = m[0 * 4 + 1];
		var m02 = m[0 * 4 + 2];
		var m03 = m[0 * 4 + 3];
		var m10 = m[1 * 4 + 0];
		var m11 = m[1 * 4 + 1];
		var m12 = m[1 * 4 + 2];
		var m13 = m[1 * 4 + 3];
		var m20 = m[2 * 4 + 0];
		var m21 = m[2 * 4 + 1];
		var m22 = m[2 * 4 + 2];
		var m23 = m[2 * 4 + 3];
		var m30 = m[3 * 4 + 0];
		var m31 = m[3 * 4 + 1];
		var m32 = m[3 * 4 + 2];
		var m33 = m[3 * 4 + 3];
		var tmp_0  = m22 * m33;
		var tmp_1  = m32 * m23;
		var tmp_2  = m12 * m33;
		var tmp_3  = m32 * m13;
		var tmp_4  = m12 * m23;
		var tmp_5  = m22 * m13;
		var tmp_6  = m02 * m33;
		var tmp_7  = m32 * m03;
		var tmp_8  = m02 * m23;
		var tmp_9  = m22 * m03;
		var tmp_10 = m02 * m13;
		var tmp_11 = m12 * m03;
		var tmp_12 = m20 * m31;
		var tmp_13 = m30 * m21;
		var tmp_14 = m10 * m31;
		var tmp_15 = m30 * m11;
		var tmp_16 = m10 * m21;
		var tmp_17 = m20 * m11;
		var tmp_18 = m00 * m31;
		var tmp_19 = m30 * m01;
		var tmp_20 = m00 * m21;
		var tmp_21 = m20 * m01;
		var tmp_22 = m00 * m11;
		var tmp_23 = m10 * m01;

		var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
			(tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
		var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
			(tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
		var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
			(tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
		var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
			(tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

		var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

		return ([	// test
			d * t0,
			d * t1,
			d * t2,
			d * t3,
			d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
					(tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
			d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
					(tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
			d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
					(tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
			d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
					(tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
			d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
					(tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
			d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
					(tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
			d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
					(tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
			d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
					(tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
			d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
					(tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
			d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
					(tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
			d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
					(tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
			d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
					(tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
		]);
	}
	,
	projection: function(x_resolution, y_resolution, depth) {
		var projection_matrix = m4.scale(1/x_resolution, 1/y_resolution, 1/depth);	// pixel-space to [0,1]
		projection_matrix = m4.multiply(m4.scale(2, 2, 2), projection_matrix);	// [0,1] to [0,2]
		projection_matrix = m4.multiply(m4.translate(-1, -1, -1), projection_matrix);	// [0,2] to [-1, 1]
		projection_matrix = m4.multiply(m4.scale(1, 1, -1), projection_matrix);	// make xyz coordinate follow right-hand-rule
		return projection_matrix;
	},
	ortho_projection: function(left, right, bottom, top, near, far) {	// TODO: explain what is orthographic projection
		return [
			2/(right-left), 0, 0, -(right+left)/(right-left),
			0, 2/(top-bottom), 0, -(top+bottom)/(top-bottom),
			0, 0, 2/(far-near), -(far+near)/(far-near),
			0, 0, 0, 1
		];
	},
	perspective_projection: function(fov, aspect_ration, near, far) {	// TODO: explain what is perspective projection
		var fovRad = fov / 180.0 * Math.PI;
		var e = 1/Math.tan(fovRad/2.0);
		return [
			e/aspect_ration, 0, 0, 0,
			0, e, 0, 0,
			0, 0, (far+near)/(near-far), 2*far*near/(near-far),
			0, 0, -1, 0
		];
	},
	lookAt: function(lookFrom, lookAt, up) {	// TODO: explain what is a lookAt matrix? what each column of it means?
		// Transform matrix that rotate X,Y,Z to make local -z axis go along (lookAt-lookFrom) direction and then translate to position lookFrom.
		var zAxis = v3.normalize(v3.subtract(lookFrom, lookAt));
		var xAxis = v3.normalize(v3.cross(up, zAxis));
		var yAxis = v3.normalize(v3.cross(zAxis, xAxis));
		return [
			xAxis[0], yAxis[0], zAxis[0], lookFrom[0],
			xAxis[1], yAxis[1], zAxis[1], lookFrom[1],
			xAxis[2], yAxis[2], zAxis[2], lookFrom[2],
			0,        0,        0,        1
		];
	}
};