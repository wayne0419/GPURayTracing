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

	// Match viewport/clipspace resolution to canvas resolution
	gl.canvas.width = 800;
	gl.canvas.height = 450;
	webglUtils.resizeCanvasToDisplaySize(gl.canvas);

	// Tell WebGL how to convert from clip space to pixels
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

	// Enalbe back-side culling, depth-buffer
	// gl.enable(gl.CULL_FACE);
	gl.enable(gl.DEPTH_TEST);

	//* Load shaders to build programs dictionary
	var programs = {};
	programs.phongShading = await createProgramGivenShaderFiles(gl, "phong_vert.glsl", "phong_frag.glsl");



	

	

	// Draw scene
	drawScene(gl, objects, lights);
}

function drawScene(gl, objects, lights) {
	// Draw a new scene, erase previous stuff
	gl.clearColor(0.0, 0.2, 0.2, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// Draw objects
	for(var i=0; i<objects.length; i++) {
		drawObject(gl, objects[i], lights);
	}
	

}
function drawObject(/** @type {WebGLRenderingContext} */gl, object, lights) {
	
	// Write data into view uniform
	setViewMatUniform(gl, object.program, object.view_cameraRotateRadius, object.view_cameraRotateAngle);

	// Write data into projection uniform
	// var projection_matrix = m4.ortho_projection(left, right, bottom, top, near, far);
	var projection_matrix = m4.perspective_projection(object.projection_fov, object.projection_aspect_ration, 
														object.projection_near, object.projection_far);
	gl.useProgram(object.program);
	gl.uniformMatrix4fv(gl.getUniformLocation(object.program, "u_projection"), false, m4.transpose(projection_matrix));

	// Set initial data for positionBuffer and moveOrigin uniform, colorBuffer, normalBuffer, transform uniform, lightDir uniform
	var drawCount = object.vertexCount;
	
	setDataForGeometry(gl, object.program, object.positionBuffer);

	setBufferDataForColor(gl, object.program, object.colorBuffer);

	setBufferDataForNormal(gl, object.program, object.normalBuffer);

	setTransformMatUniform(gl, object.program, object.transform_translation, object.transform_rotation, object.transform_scale, object.transform_shear);

	gl.useProgram(object.program);


	// Draw
	draw(gl, object.program, drawCount);
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

