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
    
    console.log('start parse');
    var AllData = $.xml2json(xmlData).CadastralBlocks.CadastralBlock;
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
        for (var j = 0; j < SpatialElement.length; j++) {
            var point = SpatialElement[j];
            var coords = [];
            xs.push(point.Ordinate.Y);
            ys.push(point.Ordinate.X);
            coords.push(point.Ordinate.Y);
            coords.push(point.Ordinate.X);
            pts.push(coords);
        }
        contour.push(pts);
        this.Area = polygonArea(xs, ys, xs.length);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYXBwLmpzIiwic3JjL2NhZFhNTDJHZW9KU09OLmpzIiwic3JjL3NwYXRpYWwvRW50aXR5U3BhdGlhbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBcbiAqIFRvIGNoYW5nZSB0aGlzIGxpY2Vuc2UgaGVhZGVyLCBjaG9vc2UgTGljZW5zZSBIZWFkZXJzIGluIFByb2plY3QgUHJvcGVydGllcy5cbiAqIFRvIGNoYW5nZSB0aGlzIHRlbXBsYXRlIGZpbGUsIGNob29zZSBUb29scyB8IFRlbXBsYXRlc1xuICogYW5kIG9wZW4gdGhlIHRlbXBsYXRlIGluIHRoZSBlZGl0b3IuXG4gKi9cblxudmFyIENvbnZlcnRlciA9IHJlcXVpcmUoJy4vY2FkWE1MMkdlb0pTT04uanMnKTtcblxuU3RhcnRQYXJzZSgpO1xuXG5mdW5jdGlvbiBTdGFydFBhcnNlKCkge1xuXHQvLyBodHRwczovL2JpdGJ1Y2tldC5vcmcvc3VyZW5yYW8veG1sMmpzb25cbiAgICAvLyBodHRwOi8vd3d3LmNocm9tZS1hbGxvdy1maWxlLWFjY2Vzcy1mcm9tLWZpbGUuY29tL1xuICAgIHZhciBWZWN0b3JEYXRhO1xuXHQkLmdldCgnLi90ZXN0ZGF0YS9kb2M4NTAwNzE3LnhtbCcsIGZ1bmN0aW9uKHhtbCkge1xuXHRcdC8vdmFyIGpzb24gPSAkLnhtbDJqc29uKHhtbCkuQ2FkYXN0cmFsQmxvY2tzO1xuXHRcdC8vICQoXCIjZGF0YVwiKS5odG1sKCc8Y29kZT4nK0pTT04uc3RyaW5naWZ5KGpzb24pKyc8L2NvZGU+Jyk7XG5cdFx0Ly9jb25zb2xlLmxvZyhDb252ZXJ0ZXIuR2VvSlNPTik7XG5cdFx0Y29uc29sZS5sb2coQ29udmVydGVyLkdlb0pTT04oeG1sKSk7XG5cblx0fSkuc3VjY2Vzcyhcblx0XHRmdW5jdGlvbigpIHtcbi8vXHRcdFx0XHR2YXIgdmVjdG9yTGF5ZXIgPSBuZXcgb2wubGF5ZXIuVmVjdG9yKHtcbi8vXHRcdFx0XHRcdHNvdXJjZSA6IG5ldyBvbC5zb3VyY2UuR2VvSlNPTih7XG4vL1x0XHRcdFx0XHRcdHByb2plY3Rpb24gOiAnRVBTRzozODU3Jy8vICxcbi8vXHRcdFx0XHRcdC8vIG9iamVjdDogcGFyc2VkRGF0YVxuLy9cdFx0XHRcdFx0fSlcbi8vXHRcdFx0XHR9KTtcbi8vXG4vL1x0XHRcdFx0dmFyIGZvcm1hdCA9IG5ldyBvbC5mb3JtYXQuR2VvSlNPTigpO1xuLy9cdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBwYXJzZWREYXRhLmZlYXR1cmVzLmxlbmd0aDsgaSsrKSB7XG4vL1x0XHRcdFx0XHR2YXIgZ2VvbWV0cnkgPSBmb3JtYXRcbi8vXHRcdFx0XHRcdFx0XHQucmVhZEdlb21ldHJ5KHBhcnNlZERhdGEuZmVhdHVyZXNbaV0uZ2VvbWV0cnkpO1xuLy9cdFx0XHRcdFx0dmFyIGZlYXR1cmUgPSBuZXcgb2wuRmVhdHVyZSh7XG4vL1x0XHRcdFx0XHRcdGdlb21ldHJ5IDogZ2VvbWV0cnksXG4vL1x0XHRcdFx0XHRcdHByb3BBIDogcGFyc2VkRGF0YS5mZWF0dXJlc1tpXS5wcm9wZXJ0aWVzLmNhZG51bWJlclxuLy9cdFx0XHRcdFx0fSk7XG4vL1x0XHRcdFx0XHR2ZWN0b3JMYXllci5nZXRTb3VyY2UoKS5hZGRGZWF0dXJlKGZlYXR1cmUpO1xuLy9cdFx0XHRcdH1cbi8vXG4vL1x0XHRcdFx0dmFyIG1hcCA9IG5ldyBvbC5NYXAoe1xuLy9cdFx0XHRcdFx0dGFyZ2V0IDogJ21hcCcsXG4vL1x0XHRcdFx0XHRsYXllcnMgOiBbXG4vL1x0XHRcdFx0XHQvLyBuZXcgb2wubGF5ZXIuVGlsZSh7XG4vL1x0XHRcdFx0XHQvLyBzb3VyY2U6IG5ldyBvbC5zb3VyY2UuT1NNKClcbi8vXHRcdFx0XHRcdC8vIH0pLFxuLy9cdFx0XHRcdFx0dmVjdG9yTGF5ZXIgXSxcbi8vXHRcdFx0XHRcdHZpZXcgOiBuZXcgb2wuVmlldyh7XG4vL1x0XHRcdFx0XHRcdGNlbnRlciA6IFsgMCwgMCBdLFxuLy9cdFx0XHRcdFx0XHR6b29tIDogN1xuLy9cdFx0XHRcdFx0fSlcbi8vXHRcdFx0XHR9KTtcbi8vXHRcdFx0XHRtYXAuZ2V0VmlldygpLmZpdEV4dGVudCh2ZWN0b3JMYXllci5nZXRTb3VyY2UoKS5nZXRFeHRlbnQoKSxcbi8vXHRcdFx0XHRcdFx0bWFwLmdldFNpemUoKSk7XG5cdFx0XHR9KTtcbn1cblxuIiwidmFyIEVTID0gcmVxdWlyZSgnLi9zcGF0aWFsL0VudGl0eVNwYXRpYWwuanMnKTtcblxubW9kdWxlLmV4cG9ydHMuR2VvSlNPTiA9IGZ1bmN0aW9uICh4bWxEYXRhKSB7XG4vL1x0dmFyIFBhcmNlbHM7XG4vL1x0dmFyIFF1YXJ0YWw7XG4vL1x0dmFyIFpvbmVzO1xuLy9cdHZhciBCb3VuZHM7XG4gICAgXG4gICAgdmFyIGdlb0pTT04gPSB7XG4gICAgICAgIHR5cGU6IFwiRmVhdHVyZUNvbGxlY3Rpb25cIixcbiAgICAgICAgZmVhdHVyZXMgOiBbXVxuICAgIH07XG4gICAgXG4gICAgY29uc29sZS5sb2coJ3N0YXJ0IHBhcnNlJyk7XG4gICAgdmFyIEFsbERhdGEgPSAkLnhtbDJqc29uKHhtbERhdGEpLkNhZGFzdHJhbEJsb2Nrcy5DYWRhc3RyYWxCbG9jaztcbiAgICBmb3IodmFyIGk9MDsgaTxBbGxEYXRhLlBhcmNlbHMuUGFyY2VsLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChBbGxEYXRhLlBhcmNlbHMuUGFyY2VsW2ldLkVudGl0eVNwYXRpYWwgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGdlb0pTT04uZmVhdHVyZXMucHVzaChFUy5nZXRFbnRpdHlTcGF0aWFsKEFsbERhdGEuUGFyY2Vscy5QYXJjZWxbaV0uRW50aXR5U3BhdGlhbCkpO1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhBbGxEYXRhLlBhcmNlbHMuUGFyY2VsW2ldLkVudGl0eVNwYXRpYWwpO1xuICAgICAgICB9XG4gICAgICAgIC8vINCc0L3QvtCz0L7QutC+0L3RgtGD0YDQvdGL0LlcbiAgICAgICAgZWxzZSBpZiAoQWxsRGF0YS5QYXJjZWxzLlBhcmNlbFtpXS5Db250b3Vycykge1xuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygn0J3QtdGCINC+0L/QuNGB0LDQvdC40Y8g0L/RgNC+0YHRgtGA0LDQvdGB0YLQstC10L3QvdC+0Lkg0YHQvtGB0YLQsNCy0LvRj9GO0YnQtdC5Jyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGdlb0pTT047XG59OyIsIi8qKlxuICog0JzQvtC00YPQu9GMINC+0LHRgNCw0LHQvtGC0LrQuCDQs9C10L7QvNC10YLRgNC40Lgg0YLQuNC/0LAg0L/QvtC70LjQs9C+0L0uXG4gKiDQntC00LjQvSDQstC90LXRiNC90LjQuSDQutC+0L3RgtGD0YAg0LggMCDQuNC70Lgg0LHQvtC70LXQtSDQstC90YPRgtGA0LXQvdC90LjRhSDQutC+0L3RgtGD0YDQvtCyLVwi0LTRi9GA0L7QulwiXG4gKiBcbiAqIEdlb0pTT04gZ2VvbWV0cnlcbiAqINCX0L/RgNC+0YHRgtC+INC80L7QttC10YIg0LHRi9GC0Ywg0YfRgtC+INCy0L3QtdGI0L3QuNC5INC60L7QvdGC0YPRgCDQvNC+0LbQtdGCINCx0YvRgtGMINC90LUg0L/QtdGA0LLRi9C8INCyIFhNTCEhIVxuICogXG4gKiBcbiAqL1xuXG4vL1wiZ2VvbWV0cnlcIjoge1xuLy8gICAgXCJ0eXBlXCI6IFwiUG9seWdvblwiLFxuLy8gICAgXCJjb29yZGluYXRlc1wiOiBbXG4vLyAgICAgIFsgWzEwMC4wLCAwLjBdLCBbMTAxLjAsIDAuMF0sIFsxMDEuMCwgMS4wXSxcbi8vICAgICAgICBbMTAwLjAsIDEuMF0sIFsxMDAuMCwgMC4wXSBdXG4vLyAgICAgIF1cbi8vICB9XG5cbm1vZHVsZS5leHBvcnRzLmdldEVudGl0eVNwYXRpYWwgPSBmdW5jdGlvbihFbnRpdHlTcGF0aWFsT2JqLCBwYXJ0T2ZNdWx0dSkge1xuXHRcbi8vXHR0aGlzLmdlb21ldHJ5ID0ge1xuLy8gICAgICAgIHR5cGU6ICcnLFxuLy9cdFx0Y29vcmRpbmF0ZXM6IFtdXG4vL1x0fTtcbiAgICBcbiAgICAvL3ZhciBFbnRpdHlTcGF0aWFsID0gW107XG4gICAgdmFyIEFyZWEgPSAwLjA7XG4gICAgXG4gICAgZnVuY3Rpb24gcG9seWdvbkFyZWEoWHMsIFlzLCBudW1Qb2ludHMpIHsgXG4gICAgICAgIGFyZWEgPSAwOyAgIFxuICAgICAgICBqID0gbnVtUG9pbnRzLTE7XG4gICAgICAgIGZvciAoaT0wOyBpPG51bVBvaW50czsgaSsrKVxuICAgICAgICB7IGFyZWEgPSBhcmVhICsgIChYc1tqXStYc1tpXSkgKiAoWXNbal0tWXNbaV0pOyBcbiAgICAgICAgICAgIGogPSBpOyAgLy9qIGlzIHByZXZpb3VzIHZlcnRleCB0byBpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFyZWEvMjtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gY3JlYXRlQ29udG91cihTcGF0aWFsRWxlbWVudCkge1xuICAgICAgICB2YXIgeHMgPSBbXTtcbiAgICAgICAgdmFyIHlzID0gW107XG4gICAgICAgIHZhciBjb250b3VyID0gW107XG4gICAgICAgIHZhciBwdHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBTcGF0aWFsRWxlbWVudC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdmFyIHBvaW50ID0gU3BhdGlhbEVsZW1lbnRbal07XG4gICAgICAgICAgICB2YXIgY29vcmRzID0gW107XG4gICAgICAgICAgICB4cy5wdXNoKHBvaW50Lk9yZGluYXRlLlkpO1xuICAgICAgICAgICAgeXMucHVzaChwb2ludC5PcmRpbmF0ZS5YKTtcbiAgICAgICAgICAgIGNvb3Jkcy5wdXNoKHBvaW50Lk9yZGluYXRlLlkpO1xuICAgICAgICAgICAgY29vcmRzLnB1c2gocG9pbnQuT3JkaW5hdGUuWCk7XG4gICAgICAgICAgICBwdHMucHVzaChjb29yZHMpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRvdXIucHVzaChwdHMpO1xuICAgICAgICB0aGlzLkFyZWEgPSBwb2x5Z29uQXJlYSh4cywgeXMsIHhzLmxlbmd0aCk7XG4gICAgfVxuICAgIFxuXHRpZiAoRW50aXR5U3BhdGlhbE9iaiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vINCj0YLQuNC90L3QsNGPINGC0LjQv9C40LfQsNGG0LjRjyDQtNC70Y8g0L/RgNC+0LLQtdGA0LrQuCDQvdCw0LvQuNGH0LjRjyDQtNGL0YDQvtC6INCyINC/0L7Qu9C40LPQvtC90LVcbiAgICAgICAgLy8g0JIg0KDQvtGB0YDQtdC10YHRgtGA0LUg0L3QtSDRgdC70LXQtNGP0YIg0LfQsCDQv9C+0YDRj9C00LrQvtC8INC60L7QvdGC0YPRgNC+0LIg0L/QvtC70LjQs9C+0L3QsFxuICAgICAgICBpZiAoRW50aXR5U3BhdGlhbE9iai5TcGF0aWFsRWxlbWVudC5zcGxpY2UpIHtcbiAgICAgICAgICAgIHZhciBjbnRycyA9IFtdO1xuICAgICAgICAgICAgdmFyIE1heEFyZWE7XG4gICAgICAgICAgICB2YXIgTWF4QXJlYUlkeCA9IDA7XG4gICAgICAgICAgICBmb3IgKHZhciBrID0gMDsgayA8IEVudGl0eVNwYXRpYWxPYmouU3BhdGlhbEVsZW1lbnQubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY29udG91ciA9IEVudGl0eVNwYXRpYWxPYmouU3BhdGlhbEVsZW1lbnRba107XG4gICAgICAgICAgICAgICAgdmFyIGNudCA9IGNyZWF0ZUNvbnRvdXIoY29udG91cik7XG4gICAgICAgICAgICAgICAgY250cnMucHVzaChjbnQpO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuQXJlYSA+IE1heEFyZWEpIHtcbiAgICAgICAgICAgICAgICAgICAgTWF4QXJlYSA9IHRoaXMuQXJlYTtcbiAgICAgICAgICAgICAgICAgICAgTWF4QXJlYUlkeCA9IGs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKE1heEFyZWFJZHggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIG1haW5DbnQgPSBjbnRycy5zcGxpY2UoTWF4QXJlYUlkeCwgMSk7XG4gICAgICAgICAgICAgICAgY250cnMuc3BsaWNlKDAsIDAsIG1haW5DbnQpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfQndC+0LzQtdGAINC+0YHQvdC+0LLQvdC+0LPQviDQutC+0L3RgtGD0YDQsCDQsdGL0LsgJyArIE1heEFyZWFJZHgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNudHJzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGNvbnRvdXIgPSBFbnRpdHlTcGF0aWFsT2JqLlNwYXRpYWxFbGVtZW50O1xuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUNvbnRvdXIoY29udG91cik7XG4gICAgICAgIH1cbiAgICB9XG59OyJdfQ==
