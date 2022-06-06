// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision mediump float;


const float INF = 9999999999.9;
const float PI = 3.1415926535897932385;
const int MAX_NUM_SPHERES = 10;
const int NUM_AA_SAMPLES = 100;
const int MAX_NUM_RAY_BOUNCE = 50;

uniform vec2 u_resolution;

// Debug
bool DEBUG_MARK = false;

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
// Material
struct Material{
	int mat_index;	// 0: diffuse
					// 1: metal
					// 2: dielectric/glass
	vec3 albedo;
	float metal_fuzz;
	float index_of_refraction;
};

// Objects
struct Sphere{
	vec3 center;
	float radius;
	Material mat;
};


//  Hit
struct Hit_record{
	vec3 p;
	vec3 normal;
	bool front_face;
	float t;
	Material mat;
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
	rec.mat = sphere.mat;

	return true;
}
bool hit_spheres(Ray r, Sphere spheres[MAX_NUM_SPHERES], int numSpheres, float t_min, float t_max, out Hit_record rec) {
	bool hit = false;
	float closest_t = INF;
	Hit_record closest_hit_rec;
	for(int i=0; i<MAX_NUM_SPHERES; i++) {
		if (i >= numSpheres) break;
		Hit_record rec_tmp;
		if(hit_sphere(r, spheres[i], t_min, t_max, rec_tmp) && rec_tmp.t < closest_t) {
			hit = true;
			closest_t = rec_tmp.t;
			closest_hit_rec = rec_tmp;
		}
	}
	rec = closest_hit_rec;
	return hit;
}

// Random
float RAND_SEED = 1.0;
float rand() {
	RAND_SEED = RAND_SEED + 0.01;
	return fract(sin(RAND_SEED * dot(gl_FragCoord.xy / u_resolution, vec2(12.9898, 78.233))) * 43758.5453);
}
vec3 rand3() {
	return vec3(rand(), rand(), rand());
}
vec3 rand3_in_unit_sphere() {
	float r = rand();
	float theta = rand() * PI;
	float phi = rand() * 2.0 * PI;
	float x = r * cos(phi) * sin(theta);
	float y = r * sin(phi) * sin(theta);
	float z = r * cos(theta);
	return vec3(x,y,z);

}
vec3 rand3_unit() {
	float r = 1.0;
	float theta = rand() * PI;
	float phi = rand() * 2.0 * PI;
	float x = r * cos(phi) * sin(theta);
	float y = r * sin(phi) * sin(theta);
	float z = r * cos(theta);
	return vec3(x,y,z);
	// return normalize(rand3_in_unit_sphere());	//! normalize a zero vector cause bugs	//! TODO: document this avoiding-bug method
}

// Utilities
bool near_zero(vec3 v) {
	float s = 1e-8;
	return (abs(v[0]) < s) && (abs(v[1]) < s) && (abs(v[2]) < s);
}


// RayTrace
bool diffuseScatter(Ray in_r, Hit_record rec, out Ray out_r, out vec3 attenuation) {
	vec3 direction = rec.normal + rand3_unit();
	if (near_zero(direction))	//! TODO: document this avoiding-bug method
		direction = rec.normal;
	out_r = Ray(rec.p, normalize(direction));
	attenuation = rec.mat.albedo;
	return true;
}

bool metalScatter(Ray in_r, Hit_record rec, out Ray out_r, out vec3 attenuation) {
	vec3 reflected = reflect(in_r.direction, rec.normal) + rec.mat.metal_fuzz * rand3_in_unit_sphere();
	out_r = Ray(rec.p, normalize(reflected));
	attenuation = rec.mat.albedo;
	return (dot(out_r.direction, rec.normal) > 0.0);
}

float reflectance(vec3 in_dir, vec3 normal, float refraction_ratio) {
	// Use Schlick's approximation for reflectance.
	float cosine = min(dot(-in_dir, normal), 1.0);
	float r0 = (1.0-refraction_ratio) / (1.0+refraction_ratio);
	r0 = r0*r0;
	return r0 + (1.0-r0)*pow((1.0 - cosine),5.0);
}

bool glassScatter(Ray in_r, Hit_record rec, out Ray out_r, out vec3 attenuation) {
	attenuation = vec3(1.0, 1.0, 1.0);
	float refraction_ratio = rec.front_face ? (1.0/rec.mat.index_of_refraction) : rec.mat.index_of_refraction;
	vec3 refracted = refract(in_r.direction, rec.normal, refraction_ratio);
	vec3 direction;
	bool cannot_refract = (refracted==vec3(0,0,0));
	if (cannot_refract || reflectance(in_r.direction, rec.normal, refraction_ratio) > rand())
        direction = reflect(in_r.direction, rec.normal);
    else
        direction = refracted;
	out_r = Ray(rec.p, normalize(direction));
	return true;
}

vec3 RayColor(Ray r, Sphere spheres[MAX_NUM_SPHERES], int numSpheres) {
	// RayTrace
	Hit_record rec;
	vec3 total_attenuation = vec3(1,1,1);
	Ray current_ray = r;
	// If hit
	for(int i=0; i<MAX_NUM_RAY_BOUNCE; i++) {
		if(!hit_spheres(current_ray, spheres, numSpheres, 0.001, INF, rec))		//! TODO: document this avoiding-bug method -> t_min cant be zero
			break;
		vec3 attenuation;
		if (rec.mat.mat_index == 0)
			diffuseScatter(current_ray, rec, current_ray, attenuation);
		else if (rec.mat.mat_index == 1)
			metalScatter(current_ray, rec, current_ray, attenuation);
		else if (rec.mat.mat_index == 2)
			glassScatter(current_ray, rec, current_ray, attenuation);
		total_attenuation = total_attenuation * attenuation;
	}
	// If no hit, show sky color
	vec3 unit_direction = normalize(current_ray.direction);
    float t = 0.5 * (unit_direction.y + 1.0);
	vec3 sky_color = (1.0-t)*vec3(1.0, 1.0, 1.0) + t*vec3(0.5, 0.7, 1.0);
	
    return total_attenuation * sky_color;
}



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
	Sphere spheres[MAX_NUM_SPHERES];
	int numSpheres = 5;
	Material material_ground = Material(0, vec3(0.8, 0.8, 0.0), 0.0, 0.0);
    Material material_center = Material(0, vec3(0.1, 0.2, 0.5), 0.0,  0.0);
    Material material_left   = Material(2, vec3(0.8, 0.8, 0.8), 0.3,  1.5);
    Material material_right  = Material(1, vec3(0.8, 0.6, 0.2), 0.0,  0.0);

	spheres[0] = Sphere(vec3( 0.0, -100.5, -1.0), 100.0, material_ground);
    spheres[1] = Sphere(vec3( 0.0, 0.0, -1.0), 0.5, material_center);
	spheres[2] = Sphere(vec3( -1.0, 0.0, -1.0), 0.5, material_left);
	spheres[3] = Sphere(vec3( -1.0, 0.0, -1.0), -0.4, material_left);
	spheres[4] = Sphere(vec3( 1.0, 0.0, -1.0), 0.5, material_right);

	// Shoot Ray
	vec3 pixel_color = vec3(0,0,0);
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
	pixel_color = pixel_color/float(NUM_AA_SAMPLES);
	pixel_color = sqrt(pixel_color);	// gamma-2 correction
	
	gl_FragColor = vec4(pixel_color, 1);

	// // test {
	// if (DEBUG_MARK)
	// 	gl_FragColor = vec4(1,0,0,1);
	// else
	// 	gl_FragColor = vec4(0,1,0,1);
	// // test }
	
}