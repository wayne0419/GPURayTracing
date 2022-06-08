# Ray Tracing : CPU version vs CPU + Bounding Box + BVH version vs GPU version

## Author

- 網媒所 王哲瑋 Che Wei Wang R10944037


## Code Structure

- `main.js`：setting up rendering scene using webgl.
- `raytrace.frag`, `raytrace.vert`：fragment shader and vertex shader where ray tracing is implemented.
- `m3.js`, `m4.js`, `v3.js`：some 3D maths functions.
- `utilities.js`：some convenient utility functions.
- `index.html`：web page that hold the render canvas.

## How To Execute/Demo
- visit https://wayne0419.github.io/GPURayTracing/ for a demo of the GPU version.


## About The Project

In this project, three versions of Ray Tracer are being implemented.
1. CPU version
2. CPU version + Bounding Box & Binary Volume Hierarchy Optimization.
3. GPU version (WebGL fragment shader).
I will give a brief introduction of the implementation of the ray tracer and then do a render speed comparison between them.

## Implemented Features Details Of The Ray Tracer (For all 3 versions)

### Anti-Aliasing

![img](https://github.com/wayne0419/GPURayTracing/blob/main/readme_material/antialiasing.png?raw=true)

### Three Materials

#### Diffuse

Three different diffuse method are being implemented.
- unit_sphere diffuse

![img](https://github.com/wayne0419/GPURayTracing/blob/main/readme_material/6-3unit_sphere_diffuse.png?raw=true)

- hemisphere diffuse

![img](https://github.com/wayne0419/GPURayTracing/blob/main/readme_material/6-5hemisphere_diffuse.png?raw=true)

- lambertian diffuse

![img](https://github.com/wayne0419/GPURayTracing/blob/main/readme_material/6-4lambertian_diffuse.png?raw=true)


Forward, I throw these pixels inside `lib.solve_debevec` to calculate the g function for R,G,B channels: `g_r`, `g_g`, `g_b`, and then derive the radiance map for each channel: `irradiance_r`, `irradiance_g`, `irradiance_b`. By stacking them, I get the HDR image.

To tone-map the HDR image, I implement the Reinhard's Method but only the global operator part. 

![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/readme_material/reinhard1.png?raw=true)

![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/readme_material/reinhard3.png?raw=true)

![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/readme_material/reinhard4.png?raw=true)

First I calculate the output tone-mapped luminosity `L_w` using the above three formula and the original HDR luminosity `L_d`.

`key a` and `L_white` are user-defined parameters for different tone-mapped result.

Various combination of `key a` and `L_white` have been experimented with and the result will be presented in later part of the report.

After getting `L_w`, I use the below formula to scale the RGB channels of our HDR image and get the tone-mapped result.

![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/readme_material/reinhard2.png?raw=true)

## Result

Below are the 10 input images with different exposure time.

| ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Images/night_street/0.jpg?raw=true) | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Images/night_street/1.jpg?raw=true) | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Images/night_street/2.jpg?raw=true) |
| ------------------------------------- | ------------------------------------- | ------------------------------------- |
| ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Images/night_street/3.jpg?raw=true) | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Images/night_street/4.jpg?raw=true) | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Images/night_street/5.jpg?raw=true) |
| ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Images/night_street/6.jpg?raw=true) | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Images/night_street/7.jpg?raw=true) | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Images/night_street/8.jpg?raw=true) |
| ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Images/night_street/9.jpg?raw=true) |

The parameter I choose to use 
- lambda = 100
- weighting function : linear-hat

The below plot shows the mapping function g I get for each channel. Can see they are quite matching too each other.

![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/g_function_L100.png?raw=true)

Tone mapped result (Reinhard's Method global operaotr, with a=0.5, L_white=inf)：

![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/tone_mapped_a0.5_whiteinf.png?raw=true)

## Experiments

###  Using Different Lambda

To observe the influence of different lambda on the result. I make the tone-mapping parameters(a, L_white) fixed and modify lambda.

| Lambda | g                                        | Tone mapped                            |
| ------ | ---------------------------------------- | -------------------------------------- |
| 10      | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/g_function_L10.png?raw=true)  | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/readme_material/tone_mapped_L10.png?raw=true)  |
| 20      | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/g_function_L20.png?raw=true)  | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/readme_material/tone_mapped_L20.png?raw=true)  |
| 50      | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/g_function_L50.png?raw=true)  | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/readme_material/tone_mapped_L50.png?raw=true)  |
| 100     | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/g_function_L100.png?raw=true) | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/readme_material/tone_mapped_L100.png?raw=true) |
| 200     | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/g_function_L200.png?raw=true) | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/readme_material/tone_mapped_L200.png?raw=true) |
| 400     | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/g_function_L400.png?raw=true) | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/readme_material/tone_mapped_L400.png?raw=true) |

We can see that as lambda goes up, the mapping function g become smoother, but the tone-mapped results have almost no difference.

### Using Different Parameters(a, L_white) For Reinhard's Tone-mapping Method

|             | a=0.18      | a=0.3     | a=0.4     | a=0.5     | a=0.75    |
| --------    | ----------- | ----------| ----------| ----------| ----------|
| L_white=0.5 | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/tone_mapped_a0.18_white0.5.png?raw=true) | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/tone_mapped_a0.3_white0.5.png?raw=true) | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/tone_mapped_a0.4_white0.5.png?raw=true) | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/tone_mapped_a0.5_white0.5.png?raw=true) | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/tone_mapped_a0.75_white0.5.png?raw=true) |
| L_white=1.5 | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/tone_mapped_a0.18_white1.5.png?raw=true) | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/tone_mapped_a0.3_white1.5.png?raw=true) | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/tone_mapped_a0.4_white1.5.png?raw=true) | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/tone_mapped_a0.5_white1.5.png?raw=true) | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/tone_mapped_a0.75_white1.5.png?raw=true) |
| L_white=3   | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/tone_mapped_a0.18_white3.png?raw=true) | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/tone_mapped_a0.3_white3.png?raw=true) | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/tone_mapped_a0.4_white3.png?raw=true) | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/tone_mapped_a0.5_white3.png?raw=true) | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/tone_mapped_a0.75_white3.png?raw=true) |
| L_white=inf | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/tone_mapped_a0.18_whiteinf.png?raw=true) | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/tone_mapped_a0.3_whiteinf.png?raw=true) | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/tone_mapped_a0.4_whiteinf.png?raw=true) | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/tone_mapped_a0.5_whiteinf.png?raw=true) | ![img](https://github.com/wayne0419/NTUVFX/blob/main/proj1/Test_result/night_street_hdr/tone_mapped_a0.75_whiteinf.png?raw=true) |
 