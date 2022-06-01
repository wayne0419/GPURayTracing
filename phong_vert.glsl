//! GLSL matrix are stored in column-major order, which means matrix is stored as its transpose, for example: a K*N matrix is stored inside matNxK.
//! but matrix computation sill works the same, 
//! for example: matNxK * matMxN equals to a K*N matrix multiplied with a N*M matrix and result is a K*M matrix stored inside a matMxK.
attribute vec3 a_position;
attribute vec3 a_color;
attribute vec3 a_normal;

uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat4 u_transform;
uniform mat4 u_inverseTransposeTransform;
uniform mat4 u_moveOrigin;

varying vec4 v_color;
varying vec3 v_normal;
varying vec4 v_worldPosition;

// all shaders have a main function
void main() {
	// gl_Position is a special variable a vertex shader
	// is responsible for setting
	
	// Transform
	vec4 position = u_transform * u_moveOrigin * vec4(a_position, 1);
	vec4 normal = u_inverseTransposeTransform *  vec4(a_normal, 0);	//! Set a_normal.w to 0 to neglect translation part in the transform
	// View: inverse of camera transform
	position = u_view * position;
	// Projection
	position = u_projection * position;

	// Pixel space to clip space
	//! For gl_position, if any of xyz value is outside [-1,1], that pixel will not be drawn.
	
	gl_Position = position;
	v_color = vec4(a_color, 1);
	v_normal = normal.xyz;
	v_worldPosition = u_transform * u_moveOrigin * vec4(a_position, 1);
}