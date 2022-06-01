// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
const int MAX_LIGHTS = 5;

#extension GL_OES_standard_derivatives : enable
precision mediump float;
uniform int u_numLights;
uniform vec3 u_lightPosition[MAX_LIGHTS];
uniform float u_lightIntensity[MAX_LIGHTS];
uniform vec3 u_lightColor[MAX_LIGHTS];
uniform vec3 u_cameraPosition;

varying vec4 v_color;
varying vec4 v_worldPosition;


void main() {
	// gl_FragColor is a special variable a fragment shader 
	// is responsible for setting

	// Compute flat normal
	vec3 U = dFdx(v_worldPosition.xyz);                     
   	vec3 V = dFdy(v_worldPosition.xyz);                 
   	vec3 normal = normalize(cross(U,V));

	float shiness = 150.0;
	
	vec3 color = vec3(0.0, 0.0, 0.0);
	vec3 ambient_color = vec3(0.0, 0.2, 0.2) * v_color.rgb;
	color += ambient_color;
	for(int i=0; i<MAX_LIGHTS; i++) {
		if (i>=u_numLights) break;
		vec3 lightPosition = u_lightPosition[i];
		vec3 toLightDir = normalize(lightPosition - (v_worldPosition/v_worldPosition.w).xyz);
		vec3 toCameraDir = normalize(u_cameraPosition - (v_worldPosition/v_worldPosition.w).xyz);
		vec3 relfectedLightDir = normalize(reflect(-toLightDir,  normalize(normal)));
		float diffuse_light = max(dot(toLightDir, normalize(normal)), 0.0);
		float specular_light = pow(max(dot(relfectedLightDir, toCameraDir), 0.0), shiness);
		vec3 color_from_this_light = (v_color.rgb * diffuse_light + specular_light) * u_lightIntensity[i] * u_lightColor[i];
		color += color_from_this_light;
	}
	
	//! For gl_FragColor, all channels' value are clamped to [0,1].
	gl_FragColor = vec4(color, 1);
}