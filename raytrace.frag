// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision mediump float;
#define color4 vec4
#define color3 vec3
#define point3 vec3

const float INF = 9999999999.9;
const float PI = 3.1415926535897932385;
const int MAX_NUM_SPHERES = 100000;
const int NUM_AA_SAMPLES = 100;

// Camera
struct Camera{
	vec3 origin;
	float focal_length;
	float aspect_ratio;
	float fov;
	float viewport_width;
	float viewport_height;
	vec3 lower_left_corner;
	vec3 horizontal;
	vec3 vertical;
};

// Ray
struct Ray{
	vec3 origin;
	vec3 direction;
};

vec3 ray_at(Ray r, float t) {
	return r.origin + t * r.direction;
}

// Objects
struct Sphere{
	vec3 center;
	float radius;
};

//  Hit
struct Hit_record{
	vec3 p;
	vec3 normal;
	bool front_face;
	float t;
};

void set_face_normal(inout Hit_record rec, vec3 outward_normal, Ray r) {
	rec.front_face = (dot(outward_normal, r.direction) < 0.0);
	if (rec.front_face) {
		rec.normal = outward_normal;
	}
	else {
		rec.normal = -outward_normal;
	}
}

bool hit_sphere(Ray r, Sphere sphere, float t_min, float t_max, out Hit_record rec) {
	vec3 c_to_o = r.origin - sphere.center;
	float a = dot(r.direction, r.direction);
	float b = 2.0 * dot(r.direction, c_to_o);
	float c = dot(c_to_o, c_to_o) - sphere.radius * sphere.radius;

	float discriminant = b*b - 4.0*a*c;
	if (discriminant < 0.0) {
		return false;
	}
	
	float sqrtd = sqrt(discriminant);
	float root1 = (-b - sqrtd) / (2.0*a);
	float root2 = (-b + sqrtd) / (2.0*a);
	float root;
	if (root1 >= t_min && root1 <= t_max) {
		root = root1;
	}
	else if (root2 >= t_min && root2 <= t_max) {
		root = root2;
	}
	else {
		return false;
	}

	rec.t = root;
	rec.p = ray_at(r, rec.t);
	vec3 outward_normal = (rec.p - sphere.center) / sphere.radius;
	set_face_normal(rec, outward_normal, r);

	return true;
}

// Utilities
float RAND_SEED = 0.0;
float rand() {
	RAND_SEED += 1.0;
	return fract(RAND_SEED * sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
}



// RayTrace
color3 RayColor(Ray r, Sphere spheres[2], int numSpheres) {
	// Find closest hit
	bool hit = false;
	float closest_t = INF;
	Hit_record closest_hit_rec;
	for(int i=0; i<MAX_NUM_SPHERES; i++) {
		if (i >= numSpheres) break;
		Hit_record rec;
		if(hit_sphere(r, spheres[i], 0.0, INF, rec) && rec.t < closest_t) {
			hit = true;
			closest_t = rec.t;
			closest_hit_rec = rec;
		}
	}

	// If hit
	if(hit) {
		return 0.5 * (closest_hit_rec.normal + vec3(1.0, 1.0, 1.0));
	}
	// If no hit, show sky color
	vec3 unit_direction = normalize(r.direction);
    float t = 0.5 * (unit_direction.y + 1.0);
    return (1.0-t)*color3(1.0, 1.0, 1.0) + t*color3(0.5, 0.7, 1.0);
}

uniform vec2 u_resolution;

void main() {
	// Camera
	Camera cam;
	cam.origin = vec3(0, 0, 0);
	cam.focal_length = 1.0;
	cam.aspect_ratio = 16.0/9.0;
	cam.fov = 90.0;
	cam.viewport_width = cam.focal_length * tan(cam.fov / 2.0) * 2.0;
	cam.viewport_height = cam.viewport_width / cam.aspect_ratio;
	cam.lower_left_corner = cam.origin - vec3(0, 0, cam.focal_length) 
									   - vec3(cam.viewport_width/2.0, 0.0, 0.0) 
									   - vec3(0.0, cam.viewport_height/2.0, 0.0);
	cam.horizontal = vec3(cam.viewport_width, 0.0, 0.0);
	cam.vertical = vec3(0.0, cam.viewport_height, 0.0);

	// Spheres
	Sphere spheres[2];
	spheres[0] = Sphere(vec3(0, 0, -1), 0.5);
	spheres[1] = Sphere(vec3(0,-100.5,-1), 100.0);
	int numSpheres = 2;

	// Shoot Ray
	color3 pixel_color = color3(0,0,0);
	for(int i=0; i<NUM_AA_SAMPLES; i++) {
		Ray r;
		r.origin = cam.origin;
		r.direction = ((gl_FragCoord.x + rand()) / u_resolution.x) * cam.horizontal
					+ ((gl_FragCoord.y + rand()) / u_resolution.y) * cam.vertical
					+ cam.lower_left_corner
					- cam.origin;
		r.direction = normalize(r.direction);
		pixel_color = pixel_color + RayColor(r, spheres, numSpheres);
	}

	gl_FragColor = vec4(pixel_color/float(NUM_AA_SAMPLES), 1);

	
}