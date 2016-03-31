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

module.exports.getEntitySpatial = function (EntitySpatialObj, proj, oType, partOfMultu) {

//	this.geometry = {
//        type: '',
//		coordinates: []
//	};

    var _EntitySpatialObj = EntitySpatialObj;
    var _proj = proj || null;
    var Area = 0.0;
    var spatialSysName = null;
    var LineString = false;

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
        if ((_proj === null) || (spatialSysName === null)) {
            return coord;
        } else {
            return proj4(projections.SpatialSystems[spatialSysName], 'EPSG:3857', coord);
        }
    }

    function getSpatialSysName() {
        var id = _EntitySpatialObj.EntSys;
        for (var i = 0; _proj.CoordSystem.length; i++) {
            if (_proj.CoordSystem[i].CsId === id) {
                return _proj.CoordSystem[i].Name;
            }
        }
        return null;
    }

    // Создание одного замкнутого контура или линии или окружности
    function createContour(SpatialElement) {
        var xs = [];
        var ys = [];
        var contour = [];
        var coord;
        var re_projected = [];
        // проверка на окружность
        if ((SpatialElement.SpelementUnit.TypeUnit === "Окружность" || "Точка") &&
                (SpatialElement.SpelementUnit.R !== undefined)) {
            coord = [Number(SpatialElement.SpelementUnit.Ordinate.Y), Number(SpatialElement.SpelementUnit.Ordinate.X)];
            re_projected = convertCoord(coord);
            return {
                'R': Number(SpatialElement.SpelementUnit.R),
                'Y': Number(re_projected[0]),
                'X': Number(re_projected[1])
            };
        } else {
            if (SpatialElement.SpelementUnit.length === 1)
                return null;
            var firstPoint = SpatialElement.SpelementUnit[0];
            var lastPoint = SpatialElement.SpelementUnit[SpatialElement.SpelementUnit.length - 1];
            if (firstPoint.SuNmb === lastPoint.SuNmb) {
                LineString = false;
                //console.log(LineString, firstPoint.SuNmb, lastPoint.SuNmb);
                for (var j = 0; j < SpatialElement.SpelementUnit.length - 1; j++) {
                    var point = SpatialElement.SpelementUnit[j];
                    var xy = [];
                    coord = [Number(point.Ordinate.Y), Number(point.Ordinate.X)];
                    re_projected = convertCoord(coord);
                    xy.push(Number(re_projected[0]));
                    xy.push(Number(re_projected[1]));
                    contour.push(xy);
                }
                contour.push(contour[0]);
                Area = polygonArea(xs, ys, xs.length);
            } else {
                LineString = true;
                //console.log(LineString, firstPoint.SuNmb, lastPoint.SuNmb);
                for (var j = 0; j < SpatialElement.SpelementUnit.length - 1; j++) {
                    var point = SpatialElement.SpelementUnit[j];
                    var xy = [];
                    coord = [Number(point.Ordinate.Y), Number(point.Ordinate.X)];
                    re_projected = convertCoord(coord);
                    xy.push(Number(re_projected[0]));
                    xy.push(Number(re_projected[1]));
                    contour.push(xy);
                }
                // бывае что LineString имеет одинаковые первую и последнюю точки
                // но SuNmb разные.
//                if ((contour[0][0][0] === contour[0][contour[0].length-1][0]) &&
//                        (contour[0][0][1] === contour[0][contour[0].length-1][1])){
//                    delete(contour[0][contour.length-1]);
//                    console.log(contour[0][0][0], contour[0][contour[0].length-1][0],LineString);
//                }
            }
            //console.log(Area);
            return contour;
        }
    }

    function processSpatialElement(SpatialElement) {
        var cntrs = [];
        if (_proj !== null) {
            spatialSysName = getSpatialSysName();
        }
        // Утинная типизация для проверки наличия дырок в полигоне
        // В Росреестре не следят за порядком контуров полигона
        if (SpatialElement.splice) {
            var MaxArea;
            var MaxAreaIdx = 0;
            for (var k = 0; k < SpatialElement.length; k++) {
                var contour = SpatialElement[k];
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
            if ((cntrs !== null) || (cntrs !== undefined)) {
                return cntrs;
            } else {
                return null;
            }
        } else {
            cntrs.push(createContour(SpatialElement));
            if ((cntrs !== null) || (cntrs !== undefined)) {
                return cntrs;
            } else {
                return null;
            }
        }
    }

    // у сооружений может быть смешаная геометрия (LineString, LineString, Circle, LineString)
    // в этом случае контуры cntrs будут хранить коллекцию
    function processRealtySpatialElement(SpatialElement) {
        var cntrs = [];
        if (_proj !== null) {
            spatialSysName = getSpatialSysName();
        }
        if (SpatialElement.splice) {
            var MaxArea;
            var MaxAreaIdx = 0;
            for (var k = 0; k < SpatialElement.length; k++) {
                var contour = SpatialElement[k];
                var cnt = createContour(contour);
                if (cnt)
                    cntrs.push(cnt);
                if (Area > MaxArea) {
                    MaxArea = Area;
                    MaxAreaIdx = k;
                }
            }
            // Перемещаем основной (наружний) контур в начало массива
            if ((!LineString) && (MaxAreaIdx > 0)) {
                var mainCnt = cntrs.splice(MaxAreaIdx, 1);
                cntrs.splice(0, 0, mainCnt);
                //console.log('Номер основного контура был ' + MaxAreaIdx);
            }
        } else {
            cntrs.push(createContour(SpatialElement));
        }
        if (cntrs.length > 1) {
            collection = [];

            for (var i = 0; i < cntrs.length - 1; i++) {
                // Окружность
                if (cntrs[i].R) {
                    var points = approximateCircle(cntrs[i].X, cntrs[i].Y, cntrs[i].R);
                    collection.push({
                        "type": "Polygon",
                        "coordinates": [points]
                    });
                }
                // Полигон
                else if (!LineString) {
                    collection.push({
                        "type": "Polygon",
                        "coordinates": [cntrs[i]]
                    });
                } else {
                    collection.push({
                        "type": "LineString",
                        "coordinates": cntrs[i]
                    });
                }
            }
            return  {
                "type": "GeometryCollection",
                "geometries": collection
            };

        } else {
            // Окружность
            if (cntrs[0].R) {
                var points = approximateCircle(cntrs[0].X, cntrs[0].Y, cntrs[0].R);
                return {
                    "type": "Polygon",
                    "coordinates": [points]
                };
            }
            // Полигон
            else if (!LineString) {
                return{
                    "type": "Polygon",
                    "coordinates": [cntrs[0]]
                };
            } else {
                return{
                    "type": "LineString",
                    "coordinates": cntrs[0]
                };
            }
        }
    }

    function approximateCircle(X, Y, R) {
        var rotatedAngle, x, y;
        var sides = 32;
        var points = [];
        x = X + R; // сдвиг на окружность
        //console.log('approximateCircle');
        for (var d = 0; d < sides - 1; d++) {
            var xy = [];
            rotatedAngle = (d * 2 * Math.PI / sides);//angle + (d * 2 * Math.PI / sides);
            x = X + (R * Math.cos(rotatedAngle));
            y = Y + (R * Math.sin(rotatedAngle));
            coord = [Number(y), Number(x)];
            xy.push(coord[0]);
            xy.push(coord[1]);
            points.push(xy);
        }
        points.push(points[0]);
        return points;
    }

    if ((_EntitySpatialObj !== undefined) && (_EntitySpatialObj !== null)) {

        var cntrs = [];

        switch (oType) {
            case 'Parcel' :
            {
                cntrs = processSpatialElement(_EntitySpatialObj.SpatialElement);
                // Если это для многоконтурного объекта, то возвращем массив контуров
                if (partOfMultu) {
                    return cntrs;
                } else {
                    return {
                        type: "Polygon",
                        coordinates: cntrs
                    };
                }
                break;
            }
            case 'Construction':
            {
                return processRealtySpatialElement(_EntitySpatialObj.SpatialElement);
                break;
            }
            case 'Building':
            {
                return processRealtySpatialElement(_EntitySpatialObj.SpatialElement);
                break;
            }
            case 'Uncompleted':
            {
                return processRealtySpatialElement(_EntitySpatialObj.SpatialElement);
                break;
            }
            case 'Zone':
            {
                cntrs = processSpatialElement(_EntitySpatialObj.SpatialElement);
                if (partOfMultu) {
                    return cntrs;
                } else {
                    return {
                        type: "Polygon",
                        coordinates: cntrs
                    };
                }
                break;
            }
            case 'Quartal':
            {
                cntrs = processSpatialElement(_EntitySpatialObj.SpatialElement);
                if (partOfMultu) {
                    return cntrs;
                } else {
                    return {
                        type: "Polygon",
                        coordinates: cntrs
                    };
                }
                break;
            }
            case 'Bound':
            {
                cntrs = processSpatialElement(_EntitySpatialObj.SpatialElement);
                if (partOfMultu) {
                    return cntrs;
                } else {
                    return {
                        type: "Polygon",
                        coordinates: cntrs
                    };
                }
                break;
            }
            default :
            {
                console.log('Тип объекта не распознан');
                return null;
            }
        }
    }

}
;
