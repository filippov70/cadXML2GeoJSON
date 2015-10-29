var ES = require('./spatial/EntitySpatial.js');
var Props = require('./cadProps');

module.exports.GeoJSON = function (xmlData) {

    var geoJSONQuartal = {
        type: "FeatureCollection",
        features: []
    };
    var geoJSONBounds = {
        type: "FeatureCollection",
        features: []
    };
    var geoJSONZones = {
        type: "FeatureCollection",
        features: []
    };
    var geoJSONParcels = {
        'type': 'FeatureCollection',
        'features': []
    };
    var geoJSONRealty = {
        type: "FeatureCollection",
        features: []
    };

    var AllData = $.xml2json(xmlData).CadastralBlocks.CadastralBlock;
    //console.log(AllData);

    // Обработка квартала. Не может быть многоконтурным           
    if (AllData.SpatialData !== null) {
        var spObj = ES.getEntitySpatial(AllData.SpatialData.EntitySpatial, false);
        if ((spObj === undefined) || (spObj.length === 0)) {
            console.log('Объект квартала с пустой геометрией! Объект будет пропущен.');
        }
        // Квартал
        var feature = {
            properties: {},
            geometry: {}
        };
        feature.geometry = spObj;
        // Остальные свойства....

        geoJSONQuartal.features.push(feature);
    } else {
        console.log('Нет описания пространственной составляющей квартала');
    }

    // Обработка границ. Не могут быть многоконтурными
    if (AllData.Bounds !== null) {
        if (AllData.Bounds.Bound.splice) {
            for (var i = 0; i < AllData.Bounds.Bound.length; i++) {
                if (AllData.Bounds.Bound[i].Boundaries.Boundary.splice) {
                    for (var k = 0; k < AllData.Bounds.Bound[i].Boundaries.Boundary.length; k++) {
                        if (AllData.Bounds.Bound[i].Boundaries.Boundary[k].EntitySpatial !== null) {
                            var spObj = ES.getEntitySpatial(AllData.Bounds.Bound[i].Boundaries.Boundary[k].EntitySpatial, false);
                            if ((spObj === undefined) || (spObj.length === 0)) {
                                console.log('Объект квартала с пустой геометрией! Объект будет пропущен.');
                                continue;
                            }
                            // Граница
                            var feature = {
                                properties: {},
                                geometry: {}
                            };
                            feature.geometry = spObj;
                            // Остальные свойства....

                            geoJSONBounds.features.push(feature);
                        } else {
                            console.log('Нет описания пространственной составляющей границы');
                        }
                    }
                } else {
                    var spObj = ES.getEntitySpatial(AllData.Bounds.Bound[i].Boundaries.Boundary.EntitySpatial, false);
                    if ((spObj === undefined) || (spObj.length === 0)) {
                        console.log('Объект квартала с пустой геометрией! Объект будет пропущен.');
                        continue;
                    }
                    // Граница
                    var feature = {
                        properties: {},
                        geometry: {}
                    };
                    feature.geometry = spObj;
                    // Остальные свойства....

                    geoJSONBounds.features.push(feature);
                }
            }
        } else {
            var spObj = ES.getEntitySpatial(AllData.Bounds.Bound.Boundaries.Boundary.EntitySpatial, false);
            if ((spObj === undefined) || (spObj.length === 0)) {
                console.log('Объект квартала с пустой геометрией! Объект будет пропущен.');
            }
            // Граница
            var feature = {
                properties: {},
                geometry: {}
            };
            feature.geometry = spObj;
            // Остальные свойства....

            geoJSONBounds.features.push(feature);
        }
    }
    // Обработка зон. Не могут быть многоконтурными
    if (AllData.Zones !== null) {
        if (AllData.Zones.Zone.splice) {
            for (var i = 0; i < AllData.Zones.Zone.length; i++) {
                if (AllData.Zones.Zone[i].EntitySpatial !== null) {
                    var spObj = ES.getEntitySpatial(AllData.Zones.Zone[i].EntitySpatial, false);
                    if ((spObj === undefined) || (spObj.length === 0)) {
                        console.log('Объект квартала с пустой геометрией! Объект будет пропущен.');
                        continue;
                    }
                    // Зона
                    var feature = {
                        properties: {},
                        geometry: {}
                    };
                    feature.geometry = spObj;
                    // Остальные свойства....

                    geoJSONZones.features.push(feature);
                } else {
                    console.log('Нет описания пространственной составляющей зоны');
                }
            }
        } else {
            if (AllData.Zones.Zone.EntitySpatial !== null) {
                var spObj = ES.getEntitySpatial(AllData.Zones.Zone.EntitySpatial, false);
                if ((spObj === undefined) || (spObj.length === 0)) {
                    console.log('Объект квартала с пустой геометрией! Объект будет пропущен.');
                }
                // Зона
                var feature = {
                    properties: {},
                    geometry: {}
                };
                feature.geometry = spObj;
                // Остальные свойства....

                geoJSONZones.features.push(feature);
            } else {
                console.log('Нет описания пространственной составляющей зоны');
            }
        }
    }
    // Обработка всех земельных учатков и их частей
    for (var e = 0; e < AllData.Parcels.Parcel.length; e++) {
        var spObj = null;
        // Земельный участок
        var feature = {
            'type': 'Feature'
        };
        if (AllData.Parcels.Parcel[e].EntitySpatial !== undefined) {
            spObj = ES.getEntitySpatial(AllData.Parcels.Parcel[e].EntitySpatial, false);
            if ((spObj === undefined) || (spObj.length === 0)) {
                continue;
            }

        }
        // Многоконтурный
        else if (AllData.Parcels.Parcel[e].Contours) {
            var Contours = AllData.Parcels.Parcel[e].Contours.Contour;
            var multiPolygon = [];
            for (var c=0; c<Contours.length; c++){
                var es = Contours[c].EntitySpatial;
                var p = ES.getEntitySpatial(es, true);
                if (p) {
                    multiPolygon.push(p);
                }
            }
            spObj = {
                    type: "MultiPolygon",
                    coordinates: multiPolygon
                };
        } else {
            console.log('Нет описания пространственной составляющей');
        }

        // Если нет геометрии, то объект не нужен
        if (spObj) {
            feature.geometry = spObj;
            // Остальные свойства....
            var props = Props.getProperties(AllData.Parcels.Parcel[e], 'Parcel');
            if (props) {
                feature.properties = props.properties;
            }
            console.log('Объект создан. КН:'+feature.properties.cadastreNumber);
            geoJSONParcels.features.push(feature);
        }

    }

    // Обработка пунктов ОМС



    return {
        geoJSONQuartal: geoJSONQuartal,
        geoJSONBounds: geoJSONBounds,
        geoJSONZones: geoJSONZones,
        geoJSONParcels: geoJSONParcels,
        geoJSONRealty: geoJSONRealty
    };
};
