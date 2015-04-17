(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Converter = require('./cadXML2GeoJSON.js');

var parsedData = {
	"type" : "FeatureCollection",
	// "crs": null,
	"features" : []

};

function run() {
	// https://bitbucket.org/surenrao/xml2json
	$.get('./testdata/doc8500717.xml', function(xml) {
		//var json = $.xml2json(xml).CadastralBlocks;
		// $("#data").html('<code>'+JSON.stringify(json)+'</code>');
		//console.log(json);
		Converter.getGeoJSON(xml);
	}).success(
			function() {
//				var vectorLayer = new ol.layer.Vector({
//					source : new ol.source.GeoJSON({
//						projection : 'EPSG:3857'// ,
//					// object: parsedData
//					})
//				});
//
//				var format = new ol.format.GeoJSON();
//				for (i = 0; i < parsedData.features.length; i++) {
//					var geometry = format
//							.readGeometry(parsedData.features[i].geometry);
//					var feature = new ol.Feature({
//						geometry : geometry,
//						propA : parsedData.features[i].properties.cadnumber
//					});
//					vectorLayer.getSource().addFeature(feature);
//				}
//
//				var map = new ol.Map({
//					target : 'map',
//					layers : [
//					// new ol.layer.Tile({
//					// source: new ol.source.OSM()
//					// }),
//					vectorLayer ],
//					view : new ol.View({
//						center : [ 0, 0 ],
//						zoom : 7
//					})
//				});
//				map.getView().fitExtent(vectorLayer.getSource().getExtent(),
//						map.getSize());
			});
            
 run();
}


},{"./cadXML2GeoJSON.js":2}],2:[function(require,module,exports){

var ES = requre('./cadastre/EntitySpatial.js');

module.exports = function() {
	var Parcels;
	var Quartal;
	var Zones;
	var Bounds;
	this.getGeoJSON = function (xmlData) {
		var AllData = $.xml2json(xmlData).CadastralBlocks;
		for(var i=0; i<AllData.Parcels.Parcel.length; i++) {
			ES.getEntitySpatial(AllData.Parcels.Parcel[i].EntitySpatial);
		}
	};
	return this;
};

//if (typeof module != "undefined" && module !== null && module.exports) 
//	module.exports = cadXML2GeoJSON;
//else if (typeof define === "function" && define.amd) 
//	define(function() {return cadXML2GeoJSON;});
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2NhZFhNTDJHZW9KU09OLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIFxuICogVG8gY2hhbmdlIHRoaXMgbGljZW5zZSBoZWFkZXIsIGNob29zZSBMaWNlbnNlIEhlYWRlcnMgaW4gUHJvamVjdCBQcm9wZXJ0aWVzLlxuICogVG8gY2hhbmdlIHRoaXMgdGVtcGxhdGUgZmlsZSwgY2hvb3NlIFRvb2xzIHwgVGVtcGxhdGVzXG4gKiBhbmQgb3BlbiB0aGUgdGVtcGxhdGUgaW4gdGhlIGVkaXRvci5cbiAqL1xuXG52YXIgQ29udmVydGVyID0gcmVxdWlyZSgnLi9jYWRYTUwyR2VvSlNPTi5qcycpO1xuXG52YXIgcGFyc2VkRGF0YSA9IHtcblx0XCJ0eXBlXCIgOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG5cdC8vIFwiY3JzXCI6IG51bGwsXG5cdFwiZmVhdHVyZXNcIiA6IFtdXG5cbn07XG5cbmZ1bmN0aW9uIHJ1bigpIHtcblx0Ly8gaHR0cHM6Ly9iaXRidWNrZXQub3JnL3N1cmVucmFvL3htbDJqc29uXG5cdCQuZ2V0KCcuL3Rlc3RkYXRhL2RvYzg1MDA3MTcueG1sJywgZnVuY3Rpb24oeG1sKSB7XG5cdFx0Ly92YXIganNvbiA9ICQueG1sMmpzb24oeG1sKS5DYWRhc3RyYWxCbG9ja3M7XG5cdFx0Ly8gJChcIiNkYXRhXCIpLmh0bWwoJzxjb2RlPicrSlNPTi5zdHJpbmdpZnkoanNvbikrJzwvY29kZT4nKTtcblx0XHQvL2NvbnNvbGUubG9nKGpzb24pO1xuXHRcdENvbnZlcnRlci5nZXRHZW9KU09OKHhtbCk7XG5cdH0pLnN1Y2Nlc3MoXG5cdFx0XHRmdW5jdGlvbigpIHtcbi8vXHRcdFx0XHR2YXIgdmVjdG9yTGF5ZXIgPSBuZXcgb2wubGF5ZXIuVmVjdG9yKHtcbi8vXHRcdFx0XHRcdHNvdXJjZSA6IG5ldyBvbC5zb3VyY2UuR2VvSlNPTih7XG4vL1x0XHRcdFx0XHRcdHByb2plY3Rpb24gOiAnRVBTRzozODU3Jy8vICxcbi8vXHRcdFx0XHRcdC8vIG9iamVjdDogcGFyc2VkRGF0YVxuLy9cdFx0XHRcdFx0fSlcbi8vXHRcdFx0XHR9KTtcbi8vXG4vL1x0XHRcdFx0dmFyIGZvcm1hdCA9IG5ldyBvbC5mb3JtYXQuR2VvSlNPTigpO1xuLy9cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBwYXJzZWREYXRhLmZlYXR1cmVzLmxlbmd0aDsgaSsrKSB7XG4vL1x0XHRcdFx0XHR2YXIgZ2VvbWV0cnkgPSBmb3JtYXRcbi8vXHRcdFx0XHRcdFx0XHQucmVhZEdlb21ldHJ5KHBhcnNlZERhdGEuZmVhdHVyZXNbaV0uZ2VvbWV0cnkpO1xuLy9cdFx0XHRcdFx0dmFyIGZlYXR1cmUgPSBuZXcgb2wuRmVhdHVyZSh7XG4vL1x0XHRcdFx0XHRcdGdlb21ldHJ5IDogZ2VvbWV0cnksXG4vL1x0XHRcdFx0XHRcdHByb3BBIDogcGFyc2VkRGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLmNhZG51bWJlclxuLy9cdFx0XHRcdFx0fSk7XG4vL1x0XHRcdFx0XHR2ZWN0b3JMYXllci5nZXRTb3VyY2UoKS5hZGRGZWF0dXJlKGZlYXR1cmUpO1xuLy9cdFx0XHRcdH1cbi8vXG4vL1x0XHRcdFx0dmFyIG1hcCA9IG5ldyBvbC5NYXAoe1xuLy9cdFx0XHRcdFx0dGFyZ2V0IDogJ21hcCcsXG4vL1x0XHRcdFx0XHRsYXllcnMgOiBbXG4vL1x0XHRcdFx0XHQvLyBuZXcgb2wubGF5ZXIuVGlsZSh7XG4vL1x0XHRcdFx0XHQvLyBzb3VyY2U6IG5ldyBvbC5zb3VyY2UuT1NNKClcbi8vXHRcdFx0XHRcdC8vIH0pLFxuLy9cdFx0XHRcdFx0dmVjdG9yTGF5ZXIgXSxcbi8vXHRcdFx0XHRcdHZpZXcgOiBuZXcgb2wuVmlldyh7XG4vL1x0XHRcdFx0XHRcdGNlbnRlciA6IFsgMCwgMCBdLFxuLy9cdFx0XHRcdFx0XHR6b29tIDogN1xuLy9cdFx0XHRcdFx0fSlcbi8vXHRcdFx0XHR9KTtcbi8vXHRcdFx0XHRtYXAuZ2V0VmlldygpLmZpdEV4dGVudCh2ZWN0b3JMYXllci5nZXRTb3VyY2UoKS5nZXRFeHRlbnQoKSxcbi8vXHRcdFx0XHRcdFx0bWFwLmdldFNpemUoKSk7XG5cdFx0XHR9KTtcbiAgICAgICAgICAgIFxuIHJ1bigpO1xufVxuXG4iLCJcbnZhciBFUyA9IHJlcXVyZSgnLi9jYWRhc3RyZS9FbnRpdHlTcGF0aWFsLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cdHZhciBQYXJjZWxzO1xuXHR2YXIgUXVhcnRhbDtcblx0dmFyIFpvbmVzO1xuXHR2YXIgQm91bmRzO1xuXHR0aGlzLmdldEdlb0pTT04gPSBmdW5jdGlvbiAoeG1sRGF0YSkge1xuXHRcdHZhciBBbGxEYXRhID0gJC54bWwyanNvbih4bWxEYXRhKS5DYWRhc3RyYWxCbG9ja3M7XG5cdFx0Zm9yKHZhciBpPTA7IGk8QWxsRGF0YS5QYXJjZWxzLlBhcmNlbC5sZW5ndGg7IGkrKykge1xuXHRcdFx0RVMuZ2V0RW50aXR5U3BhdGlhbChBbGxEYXRhLlBhcmNlbHMuUGFyY2VsW2ldLkVudGl0eVNwYXRpYWwpO1xuXHRcdH1cblx0fTtcblx0cmV0dXJuIHRoaXM7XG59O1xuXG4vL2lmICh0eXBlb2YgbW9kdWxlICE9IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlICE9PSBudWxsICYmIG1vZHVsZS5leHBvcnRzKSBcbi8vXHRtb2R1bGUuZXhwb3J0cyA9IGNhZFhNTDJHZW9KU09OO1xuLy9lbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkgXG4vL1x0ZGVmaW5lKGZ1bmN0aW9uKCkge3JldHVybiBjYWRYTUwyR2VvSlNPTjt9KTsiXX0=
