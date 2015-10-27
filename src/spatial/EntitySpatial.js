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


module.exports.getEntitySpatial = function(EntitySpatialObj, partOfMultu) {
	
//	this.geometry = {
//        type: '',
//		coordinates: []
//	};
    
    //var EntitySpatial = [];
    var Area = 0.0;
    
    // Вычисление площади замкнутого контура
    function polygonArea(Xs, Ys, numPoints) { 
        var area = 0;   
        var j = numPoints-1;
        for (var i=0; i<numPoints; i++)
        { area = area +  ((Xs[j])+(Xs[i])) * ((Ys[j])-(Ys[i])); 
            j = i;  //j is previous vertex to i
        }
        return Math.abs(area/2);
    }
    
    // Создание одного замкнутого контура
    function createContour(SpatialElement) {
        var xs = [];
        var ys = [];
        var contour = [];

        for (var j = 0; j < SpatialElement.SpelementUnit.length; j++) {
            var point = SpatialElement.SpelementUnit[j];
            var xy = [];
            xs.push(parseFloat(point.Ordinate.Y));
            ys.push(parseFloat(point.Ordinate.X));
            xy.push(parseFloat(point.Ordinate.Y));
            xy.push(parseFloat(point.Ordinate.X));
            contour.push(xy);
        }
        Area = polygonArea(xs, ys, xs.length);
        //console.log(Area);
        return contour;
    }
    
	if ((EntitySpatialObj !== undefined) && (EntitySpatialObj !== null)) {
        var cntrs = [];
        // Утинная типизация для проверки наличия дырок в полигоне
        // В Росреестре не следят за порядком контуров полигона
        if (EntitySpatialObj.SpatialElement.splice) {
            //console.log('Полигон с дырками');
            
            var MaxArea;
            var MaxAreaIdx = 0;
            for (var k = 0; k < EntitySpatialObj.SpatialElement.length; k++) {
                var contour = EntitySpatialObj.SpatialElement[k];
                var cnt = createContour(contour);
                cntrs.push(cnt);
                if(Area > MaxArea) {
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
            
            // Если это для простого объекта, то возвращем объект geometry
            else {
                return {
                    type: "Polygon",
                    coordinates: cntrs
                };
            }
        } else {
            var contour = EntitySpatialObj.SpatialElement;
            var polygon = createContour(contour);
            cntrs.push(polygon);
            // Если это для многоконтурного объекта, то возвращем массив контуров
            if (partOfMultu) {
                return cntrs;
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