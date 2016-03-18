/**
 * Модуль обработки геометрии типа полигон.
 * Один внешний контур и 0 или более внутренних контуров-"дырок"
 * 
 * GeoJSON geometry типа tEntitySpatialLandOut
 */

//"geometry": {
//    "type": "Polygon",
//    "coordinates": [
//      [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
//        [100.0, 1.0], [100.0, 0.0] ]
//      ]
//  }

var projections = require('./SpatialSystems');

module.exports.getEntitySpatial = function (EntitySpatialObj, proj, partOfMultu) {

//	this.geometry = {
//        type: '',
//		coordinates: []
//	};

    var _EntitySpatialObj = EntitySpatialObj;
    var _proj = proj || null;
    var Area = 0.0;
    var spatialSysName = null;

    // Вычисление площади замкнутого контура
    function polygonArea(Xs, Ys, numPoints) {
        var area = 0;
        var j = numPoints - 1;
        for (var i = 0; i < numPoints; i++)
        {
            area = area + ((Xs[j]) + (Xs[i])) * ((Ys[j]) - (Ys[i]));
            j = i;  //j is previous vertex to i
        }
        return Math.abs(area / 2);
    }
    
    function convertCoord(coord) {
        // global
        if ((_proj === null) || (spatialSysName === null)){
            return coord;
        } else {
            return proj4(projections.SpatialSysyems[spatialSysName], 'EPSG:3857', coord);
        }
    }
    
    function getSpatialSysName(){
        var id = _EntitySpatialObj.EntSys;
        for(var i=0; _proj.CoordSystem.length; i++){
            if (_proj.CoordSystem[i].CsId === id){
                return _proj.CoordSystem[i].Name;
            }
        }
        return null;
    }
    
    // Создание одного замкнутого контура
    function createContour(SpatialElement) {
        var xs = [];
        var ys = [];
        var contour = [];
        var coord;
        var re_projected;
        // проверка на окружность
        if ((partOfMultu === undefined) &&
                (SpatialElement.SpelementUnit.R !== undefined)) {
            coord = [SpatialElement.SpelementUnit.Ordinate.Y, SpatialElement.SpelementUnit.Ordinate.X];
            re_projected = convertCoord(coord);
            return {
                
                'R': Number(SpatialElement.SpelementUnit.R),
                'X': Number(re_projected[0]),
                'Y': Number(re_projected[1])
            };
        } else {
            var firstPoint = SpatialElement.SpelementUnit[0];
            var lastPoint = SpatialElement.SpelementUnit[SpatialElement.SpelementUnit.length-1];
            if (firstPoint.SuNmb === lastPoint.SuNmb) {
                LineString = false;
                for (var j = 0; j < SpatialElement.SpelementUnit.length; j++) {
                    var point = SpatialElement.SpelementUnit[j];
                    var xy = [];
                    xs.push(parseFloat(point.Ordinate.Y));
                    ys.push(parseFloat(point.Ordinate.X));
                    coord = [parseFloat(point.Ordinate.Y), parseFloat(point.Ordinate.X)];
                    re_projected = convertCoord(coord);
                    xy.push(re_projected[0]);
                    xy.push(re_projected[1]);
                    contour.push(xy);
                }
                Area = polygonArea(xs, ys, xs.length);
            } else {
                LineString = true;
                for (var j = 0; j < SpatialElement.SpelementUnit.length-1; j++) {
                    var point = SpatialElement.SpelementUnit[j];
                    var xy = [];
                    xs.push(parseFloat(point.Ordinate.Y));
                    ys.push(parseFloat(point.Ordinate.X));
                    coord = [parseFloat(point.Ordinate.Y), parseFloat(point.Ordinate.X)];
                    re_projected = convertCoord(coord);
                    xy.push(re_projected[0]);
                    xy.push(re_projected[1]);
                    contour.push(xy);
                }
            }
            //console.log(Area);
            return contour;
        }
    }

    if ((_EntitySpatialObj !== undefined) && (_EntitySpatialObj !== null)) {
        var cntrs = [];
        if (_proj !== null) {
            spatialSysName = getSpatialSysName();
        }
        // Утинная типизация для проверки наличия дырок в полигоне
        // В Росреестре не следят за порядком контуров полигона
        if (_EntitySpatialObj.SpatialElement.splice) {
            //console.log('Полигон с дырками');

            var MaxArea;
            var MaxAreaIdx = 0;
            for (var k = 0; k < _EntitySpatialObj.SpatialElement.length; k++) {
                var contour = _EntitySpatialObj.SpatialElement[k];
                var cnt = createContour(contour);
                if (cnt)
                    cntrs.push(cnt);
                if (Area > MaxArea) {
                    MaxArea = Area;
                    MaxAreaIdx = k;
                }
            }
            // Перемещаем основной (наружний) контур в начало массива
            if (MaxAreaIdx > 0) {
                var mainCnt = cntrs.splice(MaxAreaIdx, 1);
                cntrs.splice(0, 0, mainCnt);
                //console.log('Номер основного контура был ' + MaxAreaIdx);
            }

            // Если это для многоконтурного объекта, то возвращем массив контуров
            if (partOfMultu) {
                return cntrs;
            }
            // для ОКС. Только один контур
            else if (partOfMultu === undefined) {
                if (cntrs[0].R) {
                    return {
                        "type": "Circle",
                        "coordinates": [cntrs[0].X, cntrs[0].Y],
                        "radius": cntrs[0].R,
                        "properties": {
                            "radius_units": "m"
                        }
                    };
                }
            } // Полилиня лоя ОКС
            else if ((partOfMultu === undefined) && (LineString)) {
                return {
                    "type": "MultiLineString",
                    "coordinates": cntrs
                };
            }
            // Если это для простого объекта, то возвращем объект geometry
            else {
                return {
                    type: "Polygon",
                    coordinates: cntrs
                };
            }

        } else {
            var contour = _EntitySpatialObj.SpatialElement;
            var polygon = createContour(contour);
            cntrs.push(polygon);
            // Если это для многоконтурного объекта, то возвращем массив контуров
            if (partOfMultu) {
                return cntrs;
            }
            // для ОКС. Окружность
            else if ((partOfMultu === undefined) && (cntrs[0].R)) {
                return {
                    "type": "Circle",
                    "coordinates": [cntrs[0].X, cntrs[0].Y],
                    "radius": cntrs[0].R,
                    "properties": {
                        "radius_units": "m"
                    } 
                };
            } // Полилиня лоя ОКС
            else if ((partOfMultu === undefined) && (LineString)) {
                return {
                    "type": "LineString",
                    "coordinates": cntrs[0]
                };
            }
            // Если это для простого объекта, то возвращем объект geometry
            else {
                return {
                    type: "Polygon",
                    coordinates: cntrs
                };
            }
        }
    }
};
