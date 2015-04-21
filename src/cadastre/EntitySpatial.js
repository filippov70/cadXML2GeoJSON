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