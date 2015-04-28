(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Converter = require('./cadXML2GeoJSON.js');

StartParse();

function StartParse() {
	// https://bitbucket.org/surenrao/xml2json
    // http://www.chrome-allow-file-access-from-file.com/
    var VectorData;
	$.get('./testdata/doc8500717.xml', function(xml) {
		//var json = $.xml2json(xml).CadastralBlocks;
		// $("#data").html('<code>'+JSON.stringify(json)+'</code>');
		//console.log(Converter.GeoJSON);
		console.log(Converter.GeoJSON(xml));

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
var ES = require('./spatial/EntitySpatial.js');

module.exports.GeoJSON = function (xmlData) {
//	var Parcels;
//	var Quartal;
//	var Zones;
//	var Bounds;
    
    var geoJSON = {
        type: "FeatureCollection",
        features : []
    };
    
    var AllData = $.xml2json(xmlData).CadastralBlocks.CadastralBlock;
    console.log(AllData.Parcels);
    for(var i=0; i<AllData.Parcels.Parcel.length; i++) {
        if (AllData.Parcels.Parcel[i].EntitySpatial !== null) {
            geoJSON.features.push(ES.getEntitySpatial(AllData.Parcels.Parcel[i].EntitySpatial));
            //console.log(AllData.Parcels.Parcel[i].EntitySpatial);
        }
        // Многоконтурный
        else if (AllData.Parcels.Parcel[i].Contours) {
            
        }
        else {
            console.log('Нет описания пространственной составляющей');
        }
    }
    return geoJSON;
};
},{"./spatial/EntitySpatial.js":3}],3:[function(require,module,exports){
/**
 * Модуль обработки геометрии типа полигон.
 * Один внешний контур и 0 или более внутренних контуров-"дырок"
 * 
 * GeoJSON geometry
 * Зпросто может быть что внешний контур может быть не первым в XML!!!
 * 
 * 
 */

//"geometry": {
//    "type": "Polygon",
//    "coordinates": [
//      [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
//        [100.0, 1.0], [100.0, 0.0] ]
//      ]
//  }

module.exports.getEntitySpatial = function(EntitySpatialObj, partOfMultu) {
	
//	this.geometry = {
//        type: '',
//		coordinates: []
//	};
    
    //var EntitySpatial = [];
    var Area = 0.0;
    
    function polygonArea(Xs, Ys, numPoints) { 
        area = 0;   
        j = numPoints-1;
        for (i=0; i<numPoints; i++)
        { area = area +  (Xs[j]+Xs[i]) * (Ys[j]-Ys[i]); 
            j = i;  //j is previous vertex to i
        }
        return area/2;
    }
    
    function createContour(SpatialElement) {
        var xs = [];
        var ys = [];
        var contour = [];
        var pts = [];
        for (var j = 0; j < SpatialElement.SpelementUnit.length; j++) {
            var point = SpatialElement.SpelementUnit[j];
            var coords = [];
            xs.push(point.Ordinate.Y);
            ys.push(point.Ordinate.X);
            coords.push(point.Ordinate.Y);
            coords.push(point.Ordinate.X);
            pts.push(coords);
        }
        contour.push(pts);
        this.Area = polygonArea(xs, ys, xs.length);
        console.log();
        return contour;
    }
    
	if (EntitySpatialObj !== undefined) {
        // Утинная типизация для проверки наличия дырок в полигоне
        // В Росреестре не следят за порядком контуров полигона
        if (EntitySpatialObj.SpatialElement.splice) {
            var cntrs = [];
            var MaxArea;
            var MaxAreaIdx = 0;
            for (var k = 0; k < EntitySpatialObj.SpatialElement.length; k++) {
                var contour = EntitySpatialObj.SpatialElement[k];
                var cnt = createContour(contour);
                cntrs.push(cnt);
                if(this.Area > MaxArea) {
                    MaxArea = this.Area;
                    MaxAreaIdx = k;
                }
            }
            if (MaxAreaIdx > 0) {
                var mainCnt = cntrs.splice(MaxAreaIdx, 1);
                cntrs.splice(0, 0, mainCnt);
                console.log('Номер основного контура был ' + MaxAreaIdx);
            }
            return cntrs;
        } else {
            var contour = EntitySpatialObj.SpatialElement;
            return createContour(contour);
        }
    }
};
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2NhZFhNTDJHZW9KU09OLmpzIiwic3JjL3NwYXRpYWwvRW50aXR5U3BhdGlhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogXG4gKiBUbyBjaGFuZ2UgdGhpcyBsaWNlbnNlIGhlYWRlciwgY2hvb3NlIExpY2Vuc2UgSGVhZGVycyBpbiBQcm9qZWN0IFByb3BlcnRpZXMuXG4gKiBUbyBjaGFuZ2UgdGhpcyB0ZW1wbGF0ZSBmaWxlLCBjaG9vc2UgVG9vbHMgfCBUZW1wbGF0ZXNcbiAqIGFuZCBvcGVuIHRoZSB0ZW1wbGF0ZSBpbiB0aGUgZWRpdG9yLlxuICovXG5cbnZhciBDb252ZXJ0ZXIgPSByZXF1aXJlKCcuL2NhZFhNTDJHZW9KU09OLmpzJyk7XG5cblN0YXJ0UGFyc2UoKTtcblxuZnVuY3Rpb24gU3RhcnRQYXJzZSgpIHtcblx0Ly8gaHR0cHM6Ly9iaXRidWNrZXQub3JnL3N1cmVucmFvL3htbDJqc29uXG4gICAgLy8gaHR0cDovL3d3dy5jaHJvbWUtYWxsb3ctZmlsZS1hY2Nlc3MtZnJvbS1maWxlLmNvbS9cbiAgICB2YXIgVmVjdG9yRGF0YTtcblx0JC5nZXQoJy4vdGVzdGRhdGEvZG9jODUwMDcxNy54bWwnLCBmdW5jdGlvbih4bWwpIHtcblx0XHQvL3ZhciBqc29uID0gJC54bWwyanNvbih4bWwpLkNhZGFzdHJhbEJsb2Nrcztcblx0XHQvLyAkKFwiI2RhdGFcIikuaHRtbCgnPGNvZGU+JytKU09OLnN0cmluZ2lmeShqc29uKSsnPC9jb2RlPicpO1xuXHRcdC8vY29uc29sZS5sb2coQ29udmVydGVyLkdlb0pTT04pO1xuXHRcdGNvbnNvbGUubG9nKENvbnZlcnRlci5HZW9KU09OKHhtbCkpO1xuXG5cdH0pLnN1Y2Nlc3MoXG5cdFx0ZnVuY3Rpb24oKSB7XG4vL1x0XHRcdFx0dmFyIHZlY3RvckxheWVyID0gbmV3IG9sLmxheWVyLlZlY3Rvcih7XG4vL1x0XHRcdFx0XHRzb3VyY2UgOiBuZXcgb2wuc291cmNlLkdlb0pTT04oe1xuLy9cdFx0XHRcdFx0XHRwcm9qZWN0aW9uIDogJ0VQU0c6Mzg1NycvLyAsXG4vL1x0XHRcdFx0XHQvLyBvYmplY3Q6IHBhcnNlZERhdGFcbi8vXHRcdFx0XHRcdH0pXG4vL1x0XHRcdFx0fSk7XG4vL1xuLy9cdFx0XHRcdHZhciBmb3JtYXQgPSBuZXcgb2wuZm9ybWF0Lkdlb0pTT04oKTtcbi8vXHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgcGFyc2VkRGF0YS5mZWF0dXJlcy5sZW5ndGg7IGkrKykge1xuLy9cdFx0XHRcdFx0dmFyIGdlb21ldHJ5ID0gZm9ybWF0XG4vL1x0XHRcdFx0XHRcdFx0LnJlYWRHZW9tZXRyeShwYXJzZWREYXRhLmZlYXR1cmVzW2ldLmdlb21ldHJ5KTtcbi8vXHRcdFx0XHRcdHZhciBmZWF0dXJlID0gbmV3IG9sLkZlYXR1cmUoe1xuLy9cdFx0XHRcdFx0XHRnZW9tZXRyeSA6IGdlb21ldHJ5LFxuLy9cdFx0XHRcdFx0XHRwcm9wQSA6IHBhcnNlZERhdGEuZmVhdHVyZXNbaV0ucHJvcGVydGllcy5jYWRudW1iZXJcbi8vXHRcdFx0XHRcdH0pO1xuLy9cdFx0XHRcdFx0dmVjdG9yTGF5ZXIuZ2V0U291cmNlKCkuYWRkRmVhdHVyZShmZWF0dXJlKTtcbi8vXHRcdFx0XHR9XG4vL1xuLy9cdFx0XHRcdHZhciBtYXAgPSBuZXcgb2wuTWFwKHtcbi8vXHRcdFx0XHRcdHRhcmdldCA6ICdtYXAnLFxuLy9cdFx0XHRcdFx0bGF5ZXJzIDogW1xuLy9cdFx0XHRcdFx0Ly8gbmV3IG9sLmxheWVyLlRpbGUoe1xuLy9cdFx0XHRcdFx0Ly8gc291cmNlOiBuZXcgb2wuc291cmNlLk9TTSgpXG4vL1x0XHRcdFx0XHQvLyB9KSxcbi8vXHRcdFx0XHRcdHZlY3RvckxheWVyIF0sXG4vL1x0XHRcdFx0XHR2aWV3IDogbmV3IG9sLlZpZXcoe1xuLy9cdFx0XHRcdFx0XHRjZW50ZXIgOiBbIDAsIDAgXSxcbi8vXHRcdFx0XHRcdFx0em9vbSA6IDdcbi8vXHRcdFx0XHRcdH0pXG4vL1x0XHRcdFx0fSk7XG4vL1x0XHRcdFx0bWFwLmdldFZpZXcoKS5maXRFeHRlbnQodmVjdG9yTGF5ZXIuZ2V0U291cmNlKCkuZ2V0RXh0ZW50KCksXG4vL1x0XHRcdFx0XHRcdG1hcC5nZXRTaXplKCkpO1xuXHRcdFx0fSk7XG59XG5cbiIsInZhciBFUyA9IHJlcXVpcmUoJy4vc3BhdGlhbC9FbnRpdHlTcGF0aWFsLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzLkdlb0pTT04gPSBmdW5jdGlvbiAoeG1sRGF0YSkge1xuLy9cdHZhciBQYXJjZWxzO1xuLy9cdHZhciBRdWFydGFsO1xuLy9cdHZhciBab25lcztcbi8vXHR2YXIgQm91bmRzO1xuICAgIFxuICAgIHZhciBnZW9KU09OID0ge1xuICAgICAgICB0eXBlOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG4gICAgICAgIGZlYXR1cmVzIDogW11cbiAgICB9O1xuICAgIFxuICAgIHZhciBBbGxEYXRhID0gJC54bWwyanNvbih4bWxEYXRhKS5DYWRhc3RyYWxCbG9ja3MuQ2FkYXN0cmFsQmxvY2s7XG4gICAgY29uc29sZS5sb2coQWxsRGF0YS5QYXJjZWxzKTtcbiAgICBmb3IodmFyIGk9MDsgaTxBbGxEYXRhLlBhcmNlbHMuUGFyY2VsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChBbGxEYXRhLlBhcmNlbHMuUGFyY2VsW2ldLkVudGl0eVNwYXRpYWwgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGdlb0pTT04uZmVhdHVyZXMucHVzaChFUy5nZXRFbnRpdHlTcGF0aWFsKEFsbERhdGEuUGFyY2Vscy5QYXJjZWxbaV0uRW50aXR5U3BhdGlhbCkpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhBbGxEYXRhLlBhcmNlbHMuUGFyY2VsW2ldLkVudGl0eVNwYXRpYWwpO1xuICAgICAgICB9XG4gICAgICAgIC8vINCc0L3QvtCz0L7QutC+0L3RgtGD0YDQvdGL0LlcbiAgICAgICAgZWxzZSBpZiAoQWxsRGF0YS5QYXJjZWxzLlBhcmNlbFtpXS5Db250b3Vycykge1xuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygn0J3QtdGCINC+0L/QuNGB0LDQvdC40Y8g0L/RgNC+0YHRgtGA0LDQvdGB0YLQstC10L3QvdC+0Lkg0YHQvtGB0YLQsNCy0LvRj9GO0YnQtdC5Jyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGdlb0pTT047XG59OyIsIi8qKlxuICog0JzQvtC00YPQu9GMINC+0LHRgNCw0LHQvtGC0LrQuCDQs9C10L7QvNC10YLRgNC40Lgg0YLQuNC/0LAg0L/QvtC70LjQs9C+0L0uXG4gKiDQntC00LjQvSDQstC90LXRiNC90LjQuSDQutC+0L3RgtGD0YAg0LggMCDQuNC70Lgg0LHQvtC70LXQtSDQstC90YPRgtGA0LXQvdC90LjRhSDQutC+0L3RgtGD0YDQvtCyLVwi0LTRi9GA0L7QulwiXG4gKiBcbiAqIEdlb0pTT04gZ2VvbWV0cnlcbiAqINCX0L/RgNC+0YHRgtC+INC80L7QttC10YIg0LHRi9GC0Ywg0YfRgtC+INCy0L3QtdGI0L3QuNC5INC60L7QvdGC0YPRgCDQvNC+0LbQtdGCINCx0YvRgtGMINC90LUg0L/QtdGA0LLRi9C8INCyIFhNTCEhIVxuICogXG4gKiBcbiAqL1xuXG4vL1wiZ2VvbWV0cnlcIjoge1xuLy8gICAgXCJ0eXBlXCI6IFwiUG9seWdvblwiLFxuLy8gICAgXCJjb29yZGluYXRlc1wiOiBbXG4vLyAgICAgIFsgWzEwMC4wLCAwLjBdLCBbMTAxLjAsIDAuMF0sIFsxMDEuMCwgMS4wXSxcbi8vICAgICAgICBbMTAwLjAsIDEuMF0sIFsxMDAuMCwgMC4wXSBdXG4vLyAgICAgIF1cbi8vICB9XG5cbm1vZHVsZS5leHBvcnRzLmdldEVudGl0eVNwYXRpYWwgPSBmdW5jdGlvbihFbnRpdHlTcGF0aWFsT2JqLCBwYXJ0T2ZNdWx0dSkge1xuXHRcbi8vXHR0aGlzLmdlb21ldHJ5ID0ge1xuLy8gICAgICAgIHR5cGU6ICcnLFxuLy9cdFx0Y29vcmRpbmF0ZXM6IFtdXG4vL1x0fTtcbiAgICBcbiAgICAvL3ZhciBFbnRpdHlTcGF0aWFsID0gW107XG4gICAgdmFyIEFyZWEgPSAwLjA7XG4gICAgXG4gICAgZnVuY3Rpb24gcG9seWdvbkFyZWEoWHMsIFlzLCBudW1Qb2ludHMpIHsgXG4gICAgICAgIGFyZWEgPSAwOyAgIFxuICAgICAgICBqID0gbnVtUG9pbnRzLTE7XG4gICAgICAgIGZvciAoaT0wOyBpPG51bVBvaW50czsgaSsrKVxuICAgICAgICB7IGFyZWEgPSBhcmVhICsgIChYc1tqXStYc1tpXSkgKiAoWXNbal0tWXNbaV0pOyBcbiAgICAgICAgICAgIGogPSBpOyAgLy9qIGlzIHByZXZpb3VzIHZlcnRleCB0byBpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFyZWEvMjtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gY3JlYXRlQ29udG91cihTcGF0aWFsRWxlbWVudCkge1xuICAgICAgICB2YXIgeHMgPSBbXTtcbiAgICAgICAgdmFyIHlzID0gW107XG4gICAgICAgIHZhciBjb250b3VyID0gW107XG4gICAgICAgIHZhciBwdHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBTcGF0aWFsRWxlbWVudC5TcGVsZW1lbnRVbml0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICB2YXIgcG9pbnQgPSBTcGF0aWFsRWxlbWVudC5TcGVsZW1lbnRVbml0W2pdO1xuICAgICAgICAgICAgdmFyIGNvb3JkcyA9IFtdO1xuICAgICAgICAgICAgeHMucHVzaChwb2ludC5PcmRpbmF0ZS5ZKTtcbiAgICAgICAgICAgIHlzLnB1c2gocG9pbnQuT3JkaW5hdGUuWCk7XG4gICAgICAgICAgICBjb29yZHMucHVzaChwb2ludC5PcmRpbmF0ZS5ZKTtcbiAgICAgICAgICAgIGNvb3Jkcy5wdXNoKHBvaW50Lk9yZGluYXRlLlgpO1xuICAgICAgICAgICAgcHRzLnB1c2goY29vcmRzKTtcbiAgICAgICAgfVxuICAgICAgICBjb250b3VyLnB1c2gocHRzKTtcbiAgICAgICAgdGhpcy5BcmVhID0gcG9seWdvbkFyZWEoeHMsIHlzLCB4cy5sZW5ndGgpO1xuICAgICAgICBjb25zb2xlLmxvZygpO1xuICAgICAgICByZXR1cm4gY29udG91cjtcbiAgICB9XG4gICAgXG5cdGlmIChFbnRpdHlTcGF0aWFsT2JqICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8g0KPRgtC40L3QvdCw0Y8g0YLQuNC/0LjQt9Cw0YbQuNGPINC00LvRjyDQv9GA0L7QstC10YDQutC4INC90LDQu9C40YfQuNGPINC00YvRgNC+0Log0LIg0L/QvtC70LjQs9C+0L3QtVxuICAgICAgICAvLyDQkiDQoNC+0YHRgNC10LXRgdGC0YDQtSDQvdC1INGB0LvQtdC00Y/RgiDQt9CwINC/0L7RgNGP0LTQutC+0Lwg0LrQvtC90YLRg9GA0L7QsiDQv9C+0LvQuNCz0L7QvdCwXG4gICAgICAgIGlmIChFbnRpdHlTcGF0aWFsT2JqLlNwYXRpYWxFbGVtZW50LnNwbGljZSkge1xuICAgICAgICAgICAgdmFyIGNudHJzID0gW107XG4gICAgICAgICAgICB2YXIgTWF4QXJlYTtcbiAgICAgICAgICAgIHZhciBNYXhBcmVhSWR4ID0gMDtcbiAgICAgICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgRW50aXR5U3BhdGlhbE9iai5TcGF0aWFsRWxlbWVudC5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgIHZhciBjb250b3VyID0gRW50aXR5U3BhdGlhbE9iai5TcGF0aWFsRWxlbWVudFtrXTtcbiAgICAgICAgICAgICAgICB2YXIgY250ID0gY3JlYXRlQ29udG91cihjb250b3VyKTtcbiAgICAgICAgICAgICAgICBjbnRycy5wdXNoKGNudCk7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5BcmVhID4gTWF4QXJlYSkge1xuICAgICAgICAgICAgICAgICAgICBNYXhBcmVhID0gdGhpcy5BcmVhO1xuICAgICAgICAgICAgICAgICAgICBNYXhBcmVhSWR4ID0gaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoTWF4QXJlYUlkeCA+IDApIHtcbiAgICAgICAgICAgICAgICB2YXIgbWFpbkNudCA9IGNudHJzLnNwbGljZShNYXhBcmVhSWR4LCAxKTtcbiAgICAgICAgICAgICAgICBjbnRycy5zcGxpY2UoMCwgMCwgbWFpbkNudCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ9Cd0L7QvNC10YAg0L7RgdC90L7QstC90L7Qs9C+INC60L7QvdGC0YPRgNCwINCx0YvQuyAnICsgTWF4QXJlYUlkeCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY250cnM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgY29udG91ciA9IEVudGl0eVNwYXRpYWxPYmouU3BhdGlhbEVsZW1lbnQ7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlQ29udG91cihjb250b3VyKTtcbiAgICAgICAgfVxuICAgIH1cbn07Il19
