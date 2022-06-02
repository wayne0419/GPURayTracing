// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision mediump float;

void main() {
	// gl_FragColor is a special variable a fragment shader 
	// is responsible for setting


	//! For gl_FragColor, all channels' value are clamped to [0,1].
	gl_FragColor = vec4(0, 1, 0, 1);
}