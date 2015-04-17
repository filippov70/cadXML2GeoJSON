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
    console.log('run is start');
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
            
 //run();
}


},{"./cadXML2GeoJSON.js":2}],2:[function(require,module,exports){

var ES = require('./cadastre/EntitySpatial.js');

module.exports = function() {
	var Parcels;
	var Quartal;
	var Zones;
	var Bounds;
	this.getGeoJSON = function (xmlData) {
		var AllData = $.xml2json(xmlData).CadastralBlocks;
		for(var i=0; i<AllData.Parcels.Parcel.length; i++) {
			ES.getEntitySpatial(AllData.Parcels.Parcel[i].EntitySpatial);
            console.log(AllData.Parcels.Parcel[i].EntitySpatial);
		}
	};
	return this;
};

//if (typeof module != "undefined" && module !== null && module.exports) 
//	module.exports = cadXML2GeoJSON;
//else if (typeof define === "function" && define.amd) 
//	define(function() {return cadXML2GeoJSON;});
},{"./cadastre/EntitySpatial.js":3}],3:[function(require,module,exports){
/**
 * Модуль обработки геометрии типа полигон.
 * Один внешний контур и 0 или более внутренних контуров-"дырок"
 * 
 * GeoJSON geometry
 * Зпросто может быть что внешний контур может быть не первым в XML!!!
 * 
 * 
 */
module.exports = function() {
	
	this.geometry = {
		coordinates: []
	};
	
	this.getEntitySpatial = function (EntitySpatialObj) {
		if (EntitySpatialObj !== undefined) {
			// утинная типизация для проверки наличия дырок в полигоне
			if (EntitySpatialObj.SpatialElement.splice) {
				 for (var k = 0; k < p.EntitySpatialObj.SpatialElement.length; k++) {
					var contour = p.EntitySpatialObj.SpatialElement[k];
					for (var j = 0; j < contour.SpelementUnit.length; j++) {
						var point = contour.SpelementUnit[j];
					}
				}
			} else {
				var contour = EntitySpatialObj.SpatialElement;
				var geoContour = [];
				for (var j = 0; j < contour.SpelementUnit.length; j++) {
					var point = contour.SpelementUnit[j];
					console.log("object " + point.Ordinate.X);
					var coords = [];
					coords.push(point.Ordinate.Y);
					coords.push(point.Ordinate.X);
					geoContour.push(coords);
				}
				this.geometry.coordinates.push(geoContour);
			}
		}
	};
	
	return this;
	
};

//if (typeof module != "undefined" && module !== null && module.exports) module.exports = entitySpatial;
//else if (typeof define === "function" && define.amd) define(function() {return entitySpatial;});
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2NhZFhNTDJHZW9KU09OLmpzIiwic3JjL2NhZGFzdHJlL0VudGl0eVNwYXRpYWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIFxuICogVG8gY2hhbmdlIHRoaXMgbGljZW5zZSBoZWFkZXIsIGNob29zZSBMaWNlbnNlIEhlYWRlcnMgaW4gUHJvamVjdCBQcm9wZXJ0aWVzLlxuICogVG8gY2hhbmdlIHRoaXMgdGVtcGxhdGUgZmlsZSwgY2hvb3NlIFRvb2xzIHwgVGVtcGxhdGVzXG4gKiBhbmQgb3BlbiB0aGUgdGVtcGxhdGUgaW4gdGhlIGVkaXRvci5cbiAqL1xuXG52YXIgQ29udmVydGVyID0gcmVxdWlyZSgnLi9jYWRYTUwyR2VvSlNPTi5qcycpO1xuXG52YXIgcGFyc2VkRGF0YSA9IHtcblx0XCJ0eXBlXCIgOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG5cdC8vIFwiY3JzXCI6IG51bGwsXG5cdFwiZmVhdHVyZXNcIiA6IFtdXG5cbn07XG5cbmZ1bmN0aW9uIHJ1bigpIHtcbiAgICBjb25zb2xlLmxvZygncnVuIGlzIHN0YXJ0Jyk7XG5cdC8vIGh0dHBzOi8vYml0YnVja2V0Lm9yZy9zdXJlbnJhby94bWwyanNvblxuXHQkLmdldCgnLi90ZXN0ZGF0YS9kb2M4NTAwNzE3LnhtbCcsIGZ1bmN0aW9uKHhtbCkge1xuXHRcdC8vdmFyIGpzb24gPSAkLnhtbDJqc29uKHhtbCkuQ2FkYXN0cmFsQmxvY2tzO1xuXHRcdC8vICQoXCIjZGF0YVwiKS5odG1sKCc8Y29kZT4nK0pTT04uc3RyaW5naWZ5KGpzb24pKyc8L2NvZGU+Jyk7XG5cdFx0Ly9jb25zb2xlLmxvZyhqc29uKTtcblx0XHRDb252ZXJ0ZXIuZ2V0R2VvSlNPTih4bWwpO1xuXHR9KS5zdWNjZXNzKFxuXHRcdFx0ZnVuY3Rpb24oKSB7XG4vL1x0XHRcdFx0dmFyIHZlY3RvckxheWVyID0gbmV3IG9sLmxheWVyLlZlY3Rvcih7XG4vL1x0XHRcdFx0XHRzb3VyY2UgOiBuZXcgb2wuc291cmNlLkdlb0pTT04oe1xuLy9cdFx0XHRcdFx0XHRwcm9qZWN0aW9uIDogJ0VQU0c6Mzg1NycvLyAsXG4vL1x0XHRcdFx0XHQvLyBvYmplY3Q6IHBhcnNlZERhdGFcbi8vXHRcdFx0XHRcdH0pXG4vL1x0XHRcdFx0fSk7XG4vL1xuLy9cdFx0XHRcdHZhciBmb3JtYXQgPSBuZXcgb2wuZm9ybWF0Lkdlb0pTT04oKTtcbi8vXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgcGFyc2VkRGF0YS5mZWF0dXJlcy5sZW5ndGg7IGkrKykge1xuLy9cdFx0XHRcdFx0dmFyIGdlb21ldHJ5ID0gZm9ybWF0XG4vL1x0XHRcdFx0XHRcdFx0LnJlYWRHZW9tZXRyeShwYXJzZWREYXRhLmZlYXR1cmVzW2ldLmdlb21ldHJ5KTtcbi8vXHRcdFx0XHRcdHZhciBmZWF0dXJlID0gbmV3IG9sLkZlYXR1cmUoe1xuLy9cdFx0XHRcdFx0XHRnZW9tZXRyeSA6IGdlb21ldHJ5LFxuLy9cdFx0XHRcdFx0XHRwcm9wQSA6IHBhcnNlZERhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5jYWRudW1iZXJcbi8vXHRcdFx0XHRcdH0pO1xuLy9cdFx0XHRcdFx0dmVjdG9yTGF5ZXIuZ2V0U291cmNlKCkuYWRkRmVhdHVyZShmZWF0dXJlKTtcbi8vXHRcdFx0XHR9XG4vL1xuLy9cdFx0XHRcdHZhciBtYXAgPSBuZXcgb2wuTWFwKHtcbi8vXHRcdFx0XHRcdHRhcmdldCA6ICdtYXAnLFxuLy9cdFx0XHRcdFx0bGF5ZXJzIDogW1xuLy9cdFx0XHRcdFx0Ly8gbmV3IG9sLmxheWVyLlRpbGUoe1xuLy9cdFx0XHRcdFx0Ly8gc291cmNlOiBuZXcgb2wuc291cmNlLk9TTSgpXG4vL1x0XHRcdFx0XHQvLyB9KSxcbi8vXHRcdFx0XHRcdHZlY3RvckxheWVyIF0sXG4vL1x0XHRcdFx0XHR2aWV3IDogbmV3IG9sLlZpZXcoe1xuLy9cdFx0XHRcdFx0XHRjZW50ZXIgOiBbIDAsIDAgXSxcbi8vXHRcdFx0XHRcdFx0em9vbSA6IDdcbi8vXHRcdFx0XHRcdH0pXG4vL1x0XHRcdFx0fSk7XG4vL1x0XHRcdFx0bWFwLmdldFZpZXcoKS5maXRFeHRlbnQodmVjdG9yTGF5ZXIuZ2V0U291cmNlKCkuZ2V0RXh0ZW50KCksXG4vL1x0XHRcdFx0XHRcdG1hcC5nZXRTaXplKCkpO1xuXHRcdFx0fSk7XG4gICAgICAgICAgICBcbiAvL3J1bigpO1xufVxuXG4iLCJcbnZhciBFUyA9IHJlcXVpcmUoJy4vY2FkYXN0cmUvRW50aXR5U3BhdGlhbC5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXHR2YXIgUGFyY2Vscztcblx0dmFyIFF1YXJ0YWw7XG5cdHZhciBab25lcztcblx0dmFyIEJvdW5kcztcblx0dGhpcy5nZXRHZW9KU09OID0gZnVuY3Rpb24gKHhtbERhdGEpIHtcblx0XHR2YXIgQWxsRGF0YSA9ICQueG1sMmpzb24oeG1sRGF0YSkuQ2FkYXN0cmFsQmxvY2tzO1xuXHRcdGZvcih2YXIgaT0wOyBpPEFsbERhdGEuUGFyY2Vscy5QYXJjZWwubGVuZ3RoOyBpKyspIHtcblx0XHRcdEVTLmdldEVudGl0eVNwYXRpYWwoQWxsRGF0YS5QYXJjZWxzLlBhcmNlbFtpXS5FbnRpdHlTcGF0aWFsKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKEFsbERhdGEuUGFyY2Vscy5QYXJjZWxbaV0uRW50aXR5U3BhdGlhbCk7XG5cdFx0fVxuXHR9O1xuXHRyZXR1cm4gdGhpcztcbn07XG5cbi8vaWYgKHR5cGVvZiBtb2R1bGUgIT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUgIT09IG51bGwgJiYgbW9kdWxlLmV4cG9ydHMpIFxuLy9cdG1vZHVsZS5leHBvcnRzID0gY2FkWE1MMkdlb0pTT047XG4vL2Vsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSBcbi8vXHRkZWZpbmUoZnVuY3Rpb24oKSB7cmV0dXJuIGNhZFhNTDJHZW9KU09OO30pOyIsIi8qKlxuICog0JzQvtC00YPQu9GMINC+0LHRgNCw0LHQvtGC0LrQuCDQs9C10L7QvNC10YLRgNC40Lgg0YLQuNC/0LAg0L/QvtC70LjQs9C+0L0uXG4gKiDQntC00LjQvSDQstC90LXRiNC90LjQuSDQutC+0L3RgtGD0YAg0LggMCDQuNC70Lgg0LHQvtC70LXQtSDQstC90YPRgtGA0LXQvdC90LjRhSDQutC+0L3RgtGD0YDQvtCyLVwi0LTRi9GA0L7QulwiXG4gKiBcbiAqIEdlb0pTT04gZ2VvbWV0cnlcbiAqINCX0L/RgNC+0YHRgtC+INC80L7QttC10YIg0LHRi9GC0Ywg0YfRgtC+INCy0L3QtdGI0L3QuNC5INC60L7QvdGC0YPRgCDQvNC+0LbQtdGCINCx0YvRgtGMINC90LUg0L/QtdGA0LLRi9C8INCyIFhNTCEhIVxuICogXG4gKiBcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcblx0XG5cdHRoaXMuZ2VvbWV0cnkgPSB7XG5cdFx0Y29vcmRpbmF0ZXM6IFtdXG5cdH07XG5cdFxuXHR0aGlzLmdldEVudGl0eVNwYXRpYWwgPSBmdW5jdGlvbiAoRW50aXR5U3BhdGlhbE9iaikge1xuXHRcdGlmIChFbnRpdHlTcGF0aWFsT2JqICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdC8vINGD0YLQuNC90L3QsNGPINGC0LjQv9C40LfQsNGG0LjRjyDQtNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQvdCw0LvQuNGH0LjRjyDQtNGL0YDQvtC6INCyINC/0L7Qu9C40LPQvtC90LVcblx0XHRcdGlmIChFbnRpdHlTcGF0aWFsT2JqLlNwYXRpYWxFbGVtZW50LnNwbGljZSkge1xuXHRcdFx0XHQgZm9yICh2YXIgayA9IDA7IGsgPCBwLkVudGl0eVNwYXRpYWxPYmouU3BhdGlhbEVsZW1lbnQubGVuZ3RoOyBrKyspIHtcblx0XHRcdFx0XHR2YXIgY29udG91ciA9IHAuRW50aXR5U3BhdGlhbE9iai5TcGF0aWFsRWxlbWVudFtrXTtcblx0XHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNvbnRvdXIuU3BlbGVtZW50VW5pdC5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRcdFx0dmFyIHBvaW50ID0gY29udG91ci5TcGVsZW1lbnRVbml0W2pdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyIGNvbnRvdXIgPSBFbnRpdHlTcGF0aWFsT2JqLlNwYXRpYWxFbGVtZW50O1xuXHRcdFx0XHR2YXIgZ2VvQ29udG91ciA9IFtdO1xuXHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNvbnRvdXIuU3BlbGVtZW50VW5pdC5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRcdHZhciBwb2ludCA9IGNvbnRvdXIuU3BlbGVtZW50VW5pdFtqXTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcIm9iamVjdCBcIiArIHBvaW50Lk9yZGluYXRlLlgpO1xuXHRcdFx0XHRcdHZhciBjb29yZHMgPSBbXTtcblx0XHRcdFx0XHRjb29yZHMucHVzaChwb2ludC5PcmRpbmF0ZS5ZKTtcblx0XHRcdFx0XHRjb29yZHMucHVzaChwb2ludC5PcmRpbmF0ZS5YKTtcblx0XHRcdFx0XHRnZW9Db250b3VyLnB1c2goY29vcmRzKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0aGlzLmdlb21ldHJ5LmNvb3JkaW5hdGVzLnB1c2goZ2VvQ29udG91cik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRcblx0cmV0dXJuIHRoaXM7XG5cdFxufTtcblxuLy9pZiAodHlwZW9mIG1vZHVsZSAhPSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZSAhPT0gbnVsbCAmJiBtb2R1bGUuZXhwb3J0cykgbW9kdWxlLmV4cG9ydHMgPSBlbnRpdHlTcGF0aWFsO1xuLy9lbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKGZ1bmN0aW9uKCkge3JldHVybiBlbnRpdHlTcGF0aWFsO30pOyJdfQ==
