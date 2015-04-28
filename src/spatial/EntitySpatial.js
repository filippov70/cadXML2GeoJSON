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