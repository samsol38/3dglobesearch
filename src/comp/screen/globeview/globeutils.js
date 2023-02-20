import React, { Fragment, useState, useEffect, useRef } from "react";

import * as topojson from "topojson-client";
import versor from "versor";
import * as d3 from "d3";
import lodash from "lodash";

const getVisibility = (path, d) => {
	const visible = path({ type: "Point", coordinates: [d.long, d.lat] });

	return visible ? "visible" : "hidden";
};

const polygonContains = (polygon, point) => {
	let inside = false;

	let n = polygon.length;
	let p = polygon[n - 1];
	let x = point[0],
		y = point[1];
	let x0 = p[0],
		y0 = p[1];
	let x1, y1;
	for (let i = 0; i < n; ++i) {
		p = polygon[i];
		x1 = p[0];
		y1 = p[1];
		if (y1 > y !== y0 > y && x < ((x0 - x1) * (y - y1)) / (y0 - y1) + x1) {
			inside = !inside;
		}
		x0 = x1;
		y0 = y1;
	}

	return inside;
};

const fillLand = (refObj, obj, color) => {
	let { width, height, context, path } = refObj;

	context.beginPath();
	path(obj);
	context.shadowOffsetX = 3;
	context.shadowOffsetY = 3;
	context.shadowBlur = 5;
	context.shadowColor = "#0008";

	var lingrad = context.createLinearGradient(0, 0, width, height);

	// // addColorStop(position, color) position = 0.0 and 1.0
	lingrad.addColorStop(0, "#333");
	lingrad.addColorStop(0.2, "#000a");
	lingrad.addColorStop(0.4, "#333");
	lingrad.addColorStop(0.8, "#000d");
	lingrad.addColorStop(1, "#333");

	context.fillStyle = lingrad;
	context.fill();
};

const fillWater = (refObj, obj, color) => {
	let { context, path } = refObj;

	context.beginPath();
	path(obj);
	context.shadowOffsetX = 3;
	context.shadowOffsetY = 3;
	context.shadowBlur = 5;
	context.shadowColor = "#0008";

	const img = new Image();
	img.src = "./data/tt2.png";

	const pattern = context.createPattern(img, "repeat");
	context.fillStyle = pattern;
	// context.fillStyle = color
	context.fill();
};

const fill = (refObj, obj, color) => {
	let { context, path } = refObj;

	context.beginPath();
	path(obj);

	context.shadowOffsetX = 3;
	context.shadowOffsetY = 3;
	context.shadowBlur = 5;
	context.shadowColor = "#0008";

	context.fillStyle = color;
	context.fill();
};

const fillClippedPath = (refObj, obj, clippedObj, color, clippedColor) => {
	let { context, path } = refObj;

	context.beginPath();
	path(obj);

	context.shadowOffsetX = 3;
	context.shadowOffsetY = 3;
	context.shadowBlur = 5;
	context.shadowColor = "#0008";

	context.fillStyle = color;
	context.fill();
	context.clip();

	path(clippedObj);

	context.shadowOffsetX = 3;
	context.shadowOffsetY = 3;
	context.shadowBlur = 5;
	context.shadowColor = "#0008";

	context.fillStyle = clippedColor;
	context.fill();
};

const fillCity = (refObj, obj, scaleFactor, radius, color, opacity) => {
	let { context, path } = refObj;

	context.beginPath();
	context.arc(obj[0], obj[1], scaleFactor * radius * 2, 0, 360);

	context.fillStyle = color;
	context.fill();
};

const stroke = (refObj, obj, color) => {
	let { context, path } = refObj;

	context.beginPath();
	path(obj);
	context.shadowBlur = 0;
	context.shadowOffsetX = 0;
	context.shadowOffsetY = 0;
	context.lineWidth = 0.6;
	context.setLineDash([4, 2]);
	context.strokeStyle = color;
	context.stroke();
};

const strokePath = (refObj, obj, color) => {
	let { contextOp, pathOp } = refObj;

	contextOp.beginPath();
	pathOp(obj);
	contextOp.shadowBlur = 0;
	contextOp.shadowOffsetX = 0;
	contextOp.shadowOffsetY = 0;
	contextOp.lineWidth = 1.5;
	contextOp.setLineDash([4, 2]);
	contextOp.strokeStyle = color;
	contextOp.stroke();
};

const fillPath = (refObj, obj, color) => {
	let { contextOp, pathOp } = refObj;

	contextOp.beginPath();
	pathOp(obj);

	contextOp.shadowOffsetX = 3;
	contextOp.shadowOffsetY = 3;
	contextOp.shadowBlur = 5;
	contextOp.shadowColor = "#000";

	contextOp.fillStyle = color;
	contextOp.fill();
};

const hexToRgba = (hex, opacity = 1) => {
	hex = hex.toUpperCase();

	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);

	return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export {
	getVisibility,
	polygonContains,
	fillLand,
	fillWater,
	fill,
	fillClippedPath,
	fillCity,
	stroke,
	strokePath,
	fillPath,
};
