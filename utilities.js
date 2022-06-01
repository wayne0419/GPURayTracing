/* eslint no-console:0 consistent-return:0 */
"use strict";
function randomInt(range) {
	return Math.floor(Math.random() * range);
}

function UISetSlider(obj_id, param_id, min, max, step, init_value, controlFunction) {
	var slider = document.querySelector("#" + String(obj_id) + " > #" + String(param_id) + " > input");
	var rangeValue = document.querySelector("#" + String(obj_id) + " > #" + String(param_id) + " > .rangeValue");
	slider.min = min;
	slider.max = max;
	slider.step = step;
	slider.value = init_value;
	rangeValue.innerHTML = slider.value;
	slider.oninput = function() {
		controlFunction(slider.value);
		rangeValue.innerHTML = slider.value;
	};
}

function UISetPicker(obj_id, param_id, init_checked, controlFunction) {
	var picker = document.querySelector("#" + String(obj_id) + " > #" + String(param_id) + " > input");
	picker.oninput = function() {
		controlFunction(picker.value);
	};
	picker.checked = init_checked;
}

function UISetColorPicker(obj_id, param_id, init_value, controlFunction) {
	var color_picker = document.querySelector("#" + String(obj_id) + " > #" + String(param_id) + " > input");
	color_picker.value = init_value;
	color_picker.oninput = function() {
		controlFunction(color_picker.value);
	};
}

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}
  
function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
	  r: parseInt(result[1], 16),
	  g: parseInt(result[2], 16),
	  b: parseInt(result[3], 16)
	} : null;
}
