//! GLSL matrix are stored in column-major order, which means matrix is stored as its transpose, for example: a K*N matrix is stored inside matNxK.
//! but matrix computation sill works the same, 
//! for example: matNxK * matMxN equals to a K*N matrix multiplied with a N*M matrix and result is a K*M matrix stored inside a matMxK.
const int MAX_LIGHTS = 5;

attribute vec3 a_position;
attribute vec3 a_color;
attribute vec3 a_normal;

uniform mat4 u_view;
uniform mat4 u_projection;
uniform mat4 u_transform;
uniform mat4 u_inverseTransposeTransform;
uniform mat4 u_moveOrigin;
uniform int u_numLights;
uniform vec3 u_lightPosition[MAX_LIGHTS];
uniform float u_lightIntensity[MAX_LIGHTS];
uniform vec3 u_lightColor[MAX_LIGHTS]; 
uniform vec3 u_cameraPosition;

varying vec4 v_color;


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

	vec4 worldPosition = u_transform * u_moveOrigin * vec4(a_position, 1);

	// Lights

	float shiness = 150.0;

	vec3 color = vec3(0.0, 0.0, 0.0);
	vec3 ambient_color = vec3(0.0, 0.2, 0.2) * a_color.rgb;
	color += ambient_color;
	for(int i=0; i<MAX_LIGHTS; i++) {
		if (i>=u_numLights) break;
		vec3 lightPosition = u_lightPosition[i];
		vec3 toLightDir = normalize(lightPosition - (worldPosition/worldPosition.w).xyz);
		vec3 toCameraDir = normalize(u_cameraPosition - (worldPosition/worldPosition.w).xyz);
		vec3 relfectedLightDir = normalize(reflect(-toLightDir,  normalize(normal.xyz)));
		float diffuse_light = max(dot(toLightDir, normalize(normal.xyz)), 0.0);
		float specular_light = pow(max(dot(relfectedLightDir, toCameraDir), 0.0), shiness);
		vec3 color_from_this_light = (a_color.rgb * diffuse_light + specular_light) * u_lightIntensity[i] * u_lightColor[i];
		color += color_from_this_light;
	}

	v_color = vec4(color, 1);
}