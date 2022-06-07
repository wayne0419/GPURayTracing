/* eslint no-console:0 consistent-return:0 */
"use strict";

function createShader(/** @type {WebGLRenderingContext} */gl, type, source) {
	var shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	if (success) {
		return shader;
	}

	console.log(gl.getShaderInfoLog(shader));
	gl.deleteShader(shader);
}

function createProgram(/** @type {WebGLRenderingContext} */gl, vertexShader, fragmentShader) {
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	var success = gl.getProgramParameter(program, gl.LINK_STATUS);
	if (success) {
		return program;
	}

	console.log(gl.getProgramInfoLog(program));
	gl.deleteProgram(program);
}

async function createProgramGivenShaderFiles(/** @type {WebGLRenderingContext} */gl, vert_file, frag_file) {
	// Get the strings for our GLSL shaders
	// var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
	let response = await fetch(vert_file);
	var vertexShaderSource = await response.text();

	// var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;
	var fragmentShaderSource = await (await fetch(frag_file)).text();


	// Create GLSL shaders, upload the GLSL source, compile the shaders
	var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
	var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

	// Link the two shaders into a program
	var program = createProgram(gl, vertexShader, fragmentShader);

	return program;
}

function setObjectsUniforms(/** @type {WebGLRenderingContext} */gl, program, objects) {
	gl.useProgram(program);
	var numSpheres = objects.length;
	gl.uniform1i(gl.getUniformLocation(program, "u_numSpheres"), numSpheres);
	for(var i=0; i<numSpheres; i++) {
		var sphere = objects[i];
		var sphereName = "u_spheres[" + String(i) + "]";
		gl.uniform3fv(gl.getUniformLocation(program, sphereName + ".center"), sphere.center);
		gl.uniform1f(gl.getUniformLocation(program, sphereName + ".radius"), sphere.radius);
		var sphereMaterialName = sphereName + ".mat";
		gl.uniform1i(gl.getUniformLocation(program, sphereMaterialName + ".mat_index"), sphere.mat.mat_index);
		gl.uniform3fv(gl.getUniformLocation(program, sphereMaterialName + ".albedo"), sphere.mat.albedo);
		gl.uniform1f(gl.getUniformLocation(program, sphereMaterialName + ".metal_fuzz"), sphere.mat.metal_fuzz);
		gl.uniform1f(gl.getUniformLocation(program, sphereMaterialName + ".index_of_refraction"), sphere.mat.index_of_refraction);

	}
}


async function main() {
	// Get A WebGL context
	/** @type {HTMLCanvasElement} */
	var canvas = document.querySelector("#c");
	/** @type {WebGLRenderingContext} */
	var gl = canvas.getContext("webgl");
	if (!gl) {
		return;
	}
	gl.getExtension('OES_standard_derivatives');
	gl.getExtension('GOOGLE_include_directive');

	// Match viewport/clipspace resolution to canvas resolution
	gl.canvas.width = 400;
	gl.canvas.height = 225;
	webglUtils.resizeCanvasToDisplaySize(gl.canvas);

	// Tell WebGL how to convert from clip space to pixels
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	// Enalbe back-side culling, depth-buffer
	// gl.enable(gl.CULL_FACE);
	gl.enable(gl.DEPTH_TEST);

	// Load shaders to build programs dictionary
	var program = await createProgramGivenShaderFiles(gl, "raytrace.vert", "raytrace.frag");
	

	// Store vertices data into buffer
	gl.useProgram(program);
	var positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	var positions = [
		-1, -1,
		-1, 1,
		1, 1,
		-1, -1,
		1, 1,
		1, -1
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	// Bind buffer to attrib
	gl.useProgram(program);
	var positionAttribLocation = gl.getAttribLocation(program, "a_position");
	gl.enableVertexAttribArray(positionAttribLocation);
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	var size = 2;          // 2 components per iteration
	var type = gl.FLOAT;   // the data is 32bit floats
	var normalize = false; // don't normalize the data
	var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
	var offset = 0;        // start at the beginning of the buffer
	gl.vertexAttribPointer(positionAttribLocation, size, type, normalize, stride, offset);

	// Set uniforms
	gl.uniform2fv(gl.getUniformLocation(program, "u_resolution"), [gl.canvas.width, gl.canvas.height]);
	var objects = random_scene2();
	setObjectsUniforms(gl, program, objects);
	
	// Draw scene
	drawScene(gl, program);
}

function drawScene(/** @type {WebGLRenderingContext} */gl, program) {
	// Draw a new scene, erase previous stuff
	gl.clearColor(0.0, 0.2, 0.2, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	draw(gl, program, 6);
}

function draw(/** @type {WebGLRenderingContext} */gl, program, drawCount) {
	// Draw
	gl.useProgram(program);
	var primitiveType = gl.TRIANGLES;
	var offset = 0;
	var count = drawCount;
	gl.drawArrays(primitiveType, offset, count);
}

main();

