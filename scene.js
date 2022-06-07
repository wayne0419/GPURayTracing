/* eslint no-console:0 consistent-return:0 */
"use strict";

class Material{
	constructor(mat_index, albedo, metal_fuzz, index_of_refraction)
	{
		this.mat_index = mat_index;	// 0: diffuse
									// 1: metal
									// 2: dielectric/glass
		this.albedo = albedo;	// vec3
		this.metal_fuzz = metal_fuzz;	// float
		this.index_of_refraction = index_of_refraction;	// float
	}
}

class Sphere{
	constructor(center, radius, mat)
	{
		this.center = center;	// vec3
		this.radius = radius;	// float
		this.mat = mat;	// Material
	}

}

function random_scene2() {

	var world = [];

    var ground_material = new Material(0, [0.5, 0.5, 0.5], 0, 0);
    world.push(new Sphere([0,-1000,0], 1000, ground_material));

    for (var a = -3; a < 3; a++) {
        for (var b = -3; b < 3; b++) {
            var choose_mat = Math.random();
            var center = [2*a + 4.0 + 0.9*Math.random(), 0.2, 1*b + 0.9*Math.random()];
            if (v3.length(v3.subtract(center, [4, 0.2, 0])) > 0.9 && v3.length(v3.subtract(center, [3, 0.2, 2])) > 0.9) {

                if (choose_mat < 0.8) {
                    // diffuse
                    var albedo = v3.multiply(v3.random(), v3.random());
                    world.push(new Sphere(center, 0.2, new Material(0, albedo, 0, 0)));
                } else if (choose_mat < 0.95) {
                    // metal
                    var albedo = v3.addScalar(v3.multiplyScalar(v3.random(), 0.5), 0.5);
                    var fuzz = 0.5 * Math.random();
                    world.push(new Sphere(center, 0.2, new Material(1, albedo, fuzz, 0)));
                } else {
                    // glass
                    world.push(new Sphere(center, 0.2, new Material(2, [0,0,0], 0, 1.5)));
                }
            }
        }
    }

    var material1 = new Material(2, [0,0,0], 0, 1.5);
    world.push(new Sphere([3, 1, 2], 1.0, material1));

    var material3 = new Material(1, [0.7, 0.6, 0.5], 0, 0);
    world.push(new Sphere([4, 1, 0], 1.0, material3));

	
    return world;
}

function random_scene3() {

	var world = [];

    var ground_material = new Material(0, [0.5, 0.5, 0.5], 0, 0);
    world.push(new Sphere([0,-1000,0], 1000, ground_material));

    for (var a = -3; a < 3; a++) {
        for (var b = -3; b < 3; b++) {
            var choose_mat = Math.random();
            var center = [a + 4.0 + 0.9*Math.random(), 0.2, b + 0.9*Math.random()];
            if (v3.length(v3.subtract(center, [4, 0.2, 0])) > 0.9) {

                if (choose_mat < 0.8) {
                    // diffuse
                    var albedo = v3.multiply(v3.random(), v3.random());
                    world.push(new Sphere(center, 0.2, new Material(0, albedo, 0, 0)));
                } else if (choose_mat < 0.95) {
                    // metal
                    var albedo = v3.addScalar(v3.multiplyScalar(v3.random(), 0.5), 0.5);
                    var fuzz = 0.5 * Math.random();
                    world.push(new Sphere(center, 0.2, new Material(1, albedo, fuzz, 0)));
                } else {
                    // glass
                    world.push(new Sphere(center, 0.2, new Material(2, [0,0,0], 0, 1.5)));
                }
            }
        }
    }

    var material1 = new Material(2, [0,0,0], 0, 1.5);
    world.push(new Sphere([0, 1, 0], 1.0, material1));

    var material2 = new Material(0, [0.4, 0.2, 0.1], 0, 0);
    world.push(new Sphere([-4, 1, 0], 1.0, material2));

    var material3 = new Material(1, [0.7, 0.6, 0.5], 0, 0);
    world.push(new Sphere([4, 1, 0], 1.0, material3));

	
    return world;
}
function random_scene4() {

	var world = [];

    var ground_material = new Material(0, [0.5, 0.5, 0.5], 0, 0);
    world.push(new Sphere([0,-1000,0], 1000, ground_material));

    for (var a = -3; a < 3; a++) {
        for (var b = -3; b < 3; b++) {
            var choose_mat = Math.random();
            var center = [2*a + 4.0 + 0.9*Math.random(), 0.2, 1*b + 0.9*Math.random()];
            if (v3.length(v3.subtract(center, [4, 0.2, 0])) > 0.9 && v3.length(v3.subtract(center, [3, 0.2, 2])) > 0.9) {

                if (choose_mat < 0.8) {
                    // diffuse
                    var albedo = v3.multiply(v3.random(), v3.random());
                    world.push(new Sphere(center, 0.2, new Material(0, albedo, 0, 0)));
                } else if (choose_mat < 0.95) {
                    // metal
                    var albedo = v3.addScalar(v3.multiplyScalar(v3.random(), 0.5), 0.5);
                    var fuzz = 0.5 * Math.random();
                    world.push(new Sphere(center, 0.2, new Material(1, albedo, fuzz, 0)));
                } else {
                    // glass
                    world.push(new Sphere(center, 0.2, new Material(2, [0,0,0], 0, 1.5)));
                }
            }
        }
    }

    var material1 = new Material(2, [0,0,0], 0, 1.5);
    world.push(new Sphere([3, 1, 2], 1.0, material1));

    var material3 = new Material(1, [0.7, 0.6, 0.5], 0, 0);
    world.push(new Sphere([4, 1, 0], 1.0, material3));

	
    return world;
}

