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

StartParse();

function StartParse() {
	// https://bitbucket.org/surenrao/xml2json
    // http://www.chrome-allow-file-access-from-file.com/
    var VectorData;
	$.get('./testdata/null-quartall.xml', function(xml) {
		//var json = $.xml2json(xml).CadastralBlocks;
		// $("#data").html('<code>'+JSON.stringify(json)+'</code>');
		//console.log(Converter.GeoJSON);
		Converter.GeoJSON(xml);

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
}


},{"./cadXML2GeoJSON.js":2}],2:[function(require,module,exports){
var ES = require('./cadastre/EntitySpatial.js');

module.exports.GeoJSON = function (xmlData) {
//	var Parcels;
//	var Quartal;
//	var Zones;
//	var Bounds;
    console.log('start parse');
    var AllData = $.xml2json(xmlData).CadastralBlocks.CadastralBlock;
    for(var i=0; i<AllData.Parcels.Parcel.length; i++) {
        ES.getEntitySpatial(AllData.Parcels.Parcel[i].EntitySpatial);
        console.log(AllData.Parcels.Parcel[i].EntitySpatial);
    }
};
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
module.exports.getEntitySpatial = function(EntitySpatialObj) {
	
	this.geometry = {
		coordinates: []
	};
	if (EntitySpatialObj !== undefined) {
			// утинная типизация для проверки наличия дырок в полигоне
			if (EntitySpatialObj.SpatialElement.splice) {
				 for (var k = 0; k < EntitySpatialObj.SpatialElement.length; k++) {
					var contour = EntitySpatialObj.SpatialElement[k];
					for (var j = 0; j < contour.SpelementUnit.length; j++) {
						var point = contour.SpelementUnit[j];
					}
				}
			} else {
				var contour = EntitySpatialObj.SpatialElement;
				var geoContour = [];
				for (var j = 0; j < contour.SpelementUnit.length; j++) {
					var point = contour.SpelementUnit[j];
					var coords = [];
					coords.push(point.Ordinate.Y);
					coords.push(point.Ordinate.X);
					geoContour.push(coords);
				}
				this.geometry.coordinates.push(geoContour);
			}
		};
};

//if (typeof module != "undefined" && module !== null && module.exports) module.exports = entitySpatial;
//else if (typeof define === "function" && define.amd) define(function() {return entitySpatial;});
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2NhZFhNTDJHZW9KU09OLmpzIiwic3JjL2NhZGFzdHJlL0VudGl0eVNwYXRpYWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIFxuICogVG8gY2hhbmdlIHRoaXMgbGljZW5zZSBoZWFkZXIsIGNob29zZSBMaWNlbnNlIEhlYWRlcnMgaW4gUHJvamVjdCBQcm9wZXJ0aWVzLlxuICogVG8gY2hhbmdlIHRoaXMgdGVtcGxhdGUgZmlsZSwgY2hvb3NlIFRvb2xzIHwgVGVtcGxhdGVzXG4gKiBhbmQgb3BlbiB0aGUgdGVtcGxhdGUgaW4gdGhlIGVkaXRvci5cbiAqL1xuXG52YXIgQ29udmVydGVyID0gcmVxdWlyZSgnLi9jYWRYTUwyR2VvSlNPTi5qcycpO1xuXG52YXIgcGFyc2VkRGF0YSA9IHtcblx0XCJ0eXBlXCIgOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG5cdC8vIFwiY3JzXCI6IG51bGwsXG5cdFwiZmVhdHVyZXNcIiA6IFtdXG5cbn07XG5cblN0YXJ0UGFyc2UoKTtcblxuZnVuY3Rpb24gU3RhcnRQYXJzZSgpIHtcblx0Ly8gaHR0cHM6Ly9iaXRidWNrZXQub3JnL3N1cmVucmFvL3htbDJqc29uXG4gICAgLy8gaHR0cDovL3d3dy5jaHJvbWUtYWxsb3ctZmlsZS1hY2Nlc3MtZnJvbS1maWxlLmNvbS9cbiAgICB2YXIgVmVjdG9yRGF0YTtcblx0JC5nZXQoJy4vdGVzdGRhdGEvbnVsbC1xdWFydGFsbC54bWwnLCBmdW5jdGlvbih4bWwpIHtcblx0XHQvL3ZhciBqc29uID0gJC54bWwyanNvbih4bWwpLkNhZGFzdHJhbEJsb2Nrcztcblx0XHQvLyAkKFwiI2RhdGFcIikuaHRtbCgnPGNvZGU+JytKU09OLnN0cmluZ2lmeShqc29uKSsnPC9jb2RlPicpO1xuXHRcdC8vY29uc29sZS5sb2coQ29udmVydGVyLkdlb0pTT04pO1xuXHRcdENvbnZlcnRlci5HZW9KU09OKHhtbCk7XG5cblx0fSkuc3VjY2Vzcyhcblx0XHRmdW5jdGlvbigpIHtcbi8vXHRcdFx0XHR2YXIgdmVjdG9yTGF5ZXIgPSBuZXcgb2wubGF5ZXIuVmVjdG9yKHtcbi8vXHRcdFx0XHRcdHNvdXJjZSA6IG5ldyBvbC5zb3VyY2UuR2VvSlNPTih7XG4vL1x0XHRcdFx0XHRcdHByb2plY3Rpb24gOiAnRVBTRzozODU3Jy8vICxcbi8vXHRcdFx0XHRcdC8vIG9iamVjdDogcGFyc2VkRGF0YVxuLy9cdFx0XHRcdFx0fSlcbi8vXHRcdFx0XHR9KTtcbi8vXG4vL1x0XHRcdFx0dmFyIGZvcm1hdCA9IG5ldyBvbC5mb3JtYXQuR2VvSlNPTigpO1xuLy9cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBwYXJzZWREYXRhLmZlYXR1cmVzLmxlbmd0aDsgaSsrKSB7XG4vL1x0XHRcdFx0XHR2YXIgZ2VvbWV0cnkgPSBmb3JtYXRcbi8vXHRcdFx0XHRcdFx0XHQucmVhZEdlb21ldHJ5KHBhcnNlZERhdGEuZmVhdHVyZXNbaV0uZ2VvbWV0cnkpO1xuLy9cdFx0XHRcdFx0dmFyIGZlYXR1cmUgPSBuZXcgb2wuRmVhdHVyZSh7XG4vL1x0XHRcdFx0XHRcdGdlb21ldHJ5IDogZ2VvbWV0cnksXG4vL1x0XHRcdFx0XHRcdHByb3BBIDogcGFyc2VkRGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLmNhZG51bWJlclxuLy9cdFx0XHRcdFx0fSk7XG4vL1x0XHRcdFx0XHR2ZWN0b3JMYXllci5nZXRTb3VyY2UoKS5hZGRGZWF0dXJlKGZlYXR1cmUpO1xuLy9cdFx0XHRcdH1cbi8vXG4vL1x0XHRcdFx0dmFyIG1hcCA9IG5ldyBvbC5NYXAoe1xuLy9cdFx0XHRcdFx0dGFyZ2V0IDogJ21hcCcsXG4vL1x0XHRcdFx0XHRsYXllcnMgOiBbXG4vL1x0XHRcdFx0XHQvLyBuZXcgb2wubGF5ZXIuVGlsZSh7XG4vL1x0XHRcdFx0XHQvLyBzb3VyY2U6IG5ldyBvbC5zb3VyY2UuT1NNKClcbi8vXHRcdFx0XHRcdC8vIH0pLFxuLy9cdFx0XHRcdFx0dmVjdG9yTGF5ZXIgXSxcbi8vXHRcdFx0XHRcdHZpZXcgOiBuZXcgb2wuVmlldyh7XG4vL1x0XHRcdFx0XHRcdGNlbnRlciA6IFsgMCwgMCBdLFxuLy9cdFx0XHRcdFx0XHR6b29tIDogN1xuLy9cdFx0XHRcdFx0fSlcbi8vXHRcdFx0XHR9KTtcbi8vXHRcdFx0XHRtYXAuZ2V0VmlldygpLmZpdEV4dGVudCh2ZWN0b3JMYXllci5nZXRTb3VyY2UoKS5nZXRFeHRlbnQoKSxcbi8vXHRcdFx0XHRcdFx0bWFwLmdldFNpemUoKSk7XG5cdFx0XHR9KTtcbn1cblxuIiwidmFyIEVTID0gcmVxdWlyZSgnLi9jYWRhc3RyZS9FbnRpdHlTcGF0aWFsLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzLkdlb0pTT04gPSBmdW5jdGlvbiAoeG1sRGF0YSkge1xuLy9cdHZhciBQYXJjZWxzO1xuLy9cdHZhciBRdWFydGFsO1xuLy9cdHZhciBab25lcztcbi8vXHR2YXIgQm91bmRzO1xuICAgIGNvbnNvbGUubG9nKCdzdGFydCBwYXJzZScpO1xuICAgIHZhciBBbGxEYXRhID0gJC54bWwyanNvbih4bWxEYXRhKS5DYWRhc3RyYWxCbG9ja3MuQ2FkYXN0cmFsQmxvY2s7XG4gICAgZm9yKHZhciBpPTA7IGk8QWxsRGF0YS5QYXJjZWxzLlBhcmNlbC5sZW5ndGg7IGkrKykge1xuICAgICAgICBFUy5nZXRFbnRpdHlTcGF0aWFsKEFsbERhdGEuUGFyY2Vscy5QYXJjZWxbaV0uRW50aXR5U3BhdGlhbCk7XG4gICAgICAgIGNvbnNvbGUubG9nKEFsbERhdGEuUGFyY2Vscy5QYXJjZWxbaV0uRW50aXR5U3BhdGlhbCk7XG4gICAgfVxufTsiLCIvKipcbiAqINCc0L7QtNGD0LvRjCDQvtCx0YDQsNCx0L7RgtC60Lgg0LPQtdC+0LzQtdGC0YDQuNC4INGC0LjQv9CwINC/0L7Qu9C40LPQvtC9LlxuICog0J7QtNC40L0g0LLQvdC10YjQvdC40Lkg0LrQvtC90YLRg9GAINC4IDAg0LjQu9C4INCx0L7Qu9C10LUg0LLQvdGD0YLRgNC10L3QvdC40YUg0LrQvtC90YLRg9GA0L7Qsi1cItC00YvRgNC+0LpcIlxuICogXG4gKiBHZW9KU09OIGdlb21ldHJ5XG4gKiDQl9C/0YDQvtGB0YLQviDQvNC+0LbQtdGCINCx0YvRgtGMINGH0YLQviDQstC90LXRiNC90LjQuSDQutC+0L3RgtGD0YAg0LzQvtC20LXRgiDQsdGL0YLRjCDQvdC1INC/0LXRgNCy0YvQvCDQsiBYTUwhISFcbiAqIFxuICogXG4gKi9cbm1vZHVsZS5leHBvcnRzLmdldEVudGl0eVNwYXRpYWwgPSBmdW5jdGlvbihFbnRpdHlTcGF0aWFsT2JqKSB7XG5cdFxuXHR0aGlzLmdlb21ldHJ5ID0ge1xuXHRcdGNvb3JkaW5hdGVzOiBbXVxuXHR9O1xuXHRpZiAoRW50aXR5U3BhdGlhbE9iaiAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHQvLyDRg9GC0LjQvdC90LDRjyDRgtC40L/QuNC30LDRhtC40Y8g0LTQu9GPINC/0YDQvtCy0LXRgNC60Lgg0L3QsNC70LjRh9C40Y8g0LTRi9GA0L7QuiDQsiDQv9C+0LvQuNCz0L7QvdC1XG5cdFx0XHRpZiAoRW50aXR5U3BhdGlhbE9iai5TcGF0aWFsRWxlbWVudC5zcGxpY2UpIHtcblx0XHRcdFx0IGZvciAodmFyIGsgPSAwOyBrIDwgRW50aXR5U3BhdGlhbE9iai5TcGF0aWFsRWxlbWVudC5sZW5ndGg7IGsrKykge1xuXHRcdFx0XHRcdHZhciBjb250b3VyID0gRW50aXR5U3BhdGlhbE9iai5TcGF0aWFsRWxlbWVudFtrXTtcblx0XHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNvbnRvdXIuU3BlbGVtZW50VW5pdC5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRcdFx0dmFyIHBvaW50ID0gY29udG91ci5TcGVsZW1lbnRVbml0W2pdO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyIGNvbnRvdXIgPSBFbnRpdHlTcGF0aWFsT2JqLlNwYXRpYWxFbGVtZW50O1xuXHRcdFx0XHR2YXIgZ2VvQ29udG91ciA9IFtdO1xuXHRcdFx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNvbnRvdXIuU3BlbGVtZW50VW5pdC5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRcdHZhciBwb2ludCA9IGNvbnRvdXIuU3BlbGVtZW50VW5pdFtqXTtcblx0XHRcdFx0XHR2YXIgY29vcmRzID0gW107XG5cdFx0XHRcdFx0Y29vcmRzLnB1c2gocG9pbnQuT3JkaW5hdGUuWSk7XG5cdFx0XHRcdFx0Y29vcmRzLnB1c2gocG9pbnQuT3JkaW5hdGUuWCk7XG5cdFx0XHRcdFx0Z2VvQ29udG91ci5wdXNoKGNvb3Jkcyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dGhpcy5nZW9tZXRyeS5jb29yZGluYXRlcy5wdXNoKGdlb0NvbnRvdXIpO1xuXHRcdFx0fVxuXHRcdH07XG59O1xuXG4vL2lmICh0eXBlb2YgbW9kdWxlICE9IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlICE9PSBudWxsICYmIG1vZHVsZS5leHBvcnRzKSBtb2R1bGUuZXhwb3J0cyA9IGVudGl0eVNwYXRpYWw7XG4vL2Vsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZnVuY3Rpb24oKSB7cmV0dXJuIGVudGl0eVNwYXRpYWw7fSk7Il19
