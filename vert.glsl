//! GLSL matrix are stored in column-major order, which means matrix is stored as its transpose, for example: a K*N matrix is stored inside matNxK.
//! but matrix computation sill works the same, 
//! for example: matNxK * matMxN equals to a K*N matrix multiplied with a N*M matrix and result is a K*M matrix stored inside a matMxK.
attribute vec2 a_position;


// all shaders have a main function
void main() {
	// gl_Position is a special variable a vertex shader
	// is responsible for setting
	
	gl_Position = vec4(a_position.xy, 0, 1);

}