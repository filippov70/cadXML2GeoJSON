var ES = require('./spatial/EntitySpatial.js');
var Props = require('./cadProps');

module.exports.GeoJSON = function (xmlData, reproject) {

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
    // Отдельное хранилище для GeometryCollection
    var geoJSONRealtyCollection = {
        type: "FeatureCollection",
        features: []
    };
    var geoJSONOSMPoints = {
        type: "FeatureCollection",
        features: []
    };

    var _reproject = reproject || null;

    var AllData = $.xml2json(xmlData).CadastralBlocks.CadastralBlock;
    //console.log(AllData);

    // Может быть несколько СК
    var projMSK;
    if (_reproject !== null) {
        projMSK = AllData.CoordSystems;
    }

    // Обработка квартала. Не может быть многоконтурным           
    if (AllData.SpatialData !== null) {
        var spObj = ES.getEntitySpatial(AllData.SpatialData.EntitySpatial, projMSK, 'Quartal', false);
        if ((spObj === undefined) || (spObj.length === 0)) {
            console.log('Объект квартала с пустой геометрией! Объект будет пропущен.');
        }
        // Квартал
        var feature = {
            'type': 'Feature'
        };
        feature.geometry = spObj;
        // Остальные свойства....

        geoJSONQuartal.features.push(feature);
    } else {
        console.log('Нет описания пространственной составляющей квартала');
    }

    // Обработка границ. Не могут быть многоконтурными
    if (AllData.Bounds) {

        if (AllData.Bounds.Bound.splice) {
            for (var i = 0; i < AllData.Bounds.Bound.length; i++) {
                if (AllData.Bounds.Bound[i].Boundaries.Boundary.splice) {
                    for (var k = 0; k < AllData.Bounds.Bound[i].Boundaries.Boundary.length; k++) {
                        // Граница
                        var feature = {
                            'type': 'Feature'
                        };
                        if (AllData.Bounds.Bound[i].Boundaries.Boundary[k].EntitySpatial !== null) {
                            var spObj = ES.getEntitySpatial(AllData.Bounds.Bound[i].Boundaries.Boundary[k].EntitySpatial, projMSK, 'Bound', false);
                            if ((spObj === undefined) || (spObj.length === 0)) {
                                console.log('Объект Границы с пустой геометрией! Объект будет пропущен.');
                                continue;
                            }
                            feature.geometry = spObj;
                            // Остальные свойства....

                            geoJSONBounds.features.push(feature);
                        } else {
                            //console.log('Нет описания пространственной составляющей границы');
                        }
                    }
                } else {
                    // Граница
                    var feature = {
                        'type': 'Feature'
                    };
                    var spObj = ES.getEntitySpatial(AllData.Bounds.Bound[i].Boundaries.Boundary.EntitySpatial, projMSK, 'Bound', false);
                    if ((spObj === undefined) || (spObj.length === 0)) {
                        console.log('Объект Границы с пустой геометрией! Объект будет пропущен.');
                        continue;
                    }
                    feature.geometry = spObj;
                    // Остальные свойства....

                    geoJSONBounds.features.push(feature);
                }
            }
        } else {
            var spObj = ES.getEntitySpatial(AllData.Bounds.Bound.Boundaries.Boundary.EntitySpatial, projMSK, 'Bound', false);
            if ((spObj === undefined) || (spObj.length === 0)) {
                console.log('Объект Границы с пустой геометрией! Объект будет пропущен.');
            }
            feature.geometry = spObj;
            // Остальные свойства....

            geoJSONBounds.features.push(feature);
        }
    }
    // Обработка зон. Не могут быть многоконтурными
    if (AllData.Zones) {

        if (AllData.Zones.Zone.splice) {
            for (var i = 0; i < AllData.Zones.Zone.length; i++) {
                // Зона
                var feature = {
                    'type': 'Feature'
                };
                if (AllData.Zones.Zone[i].EntitySpatial !== null) {
                    var spObj = ES.getEntitySpatial(AllData.Zones.Zone[i].EntitySpatial, projMSK, 'Zone', false);
                    if ((spObj === undefined) || (spObj.length === 0)) {
                        console.log('Объект Зоны с пустой геометрией! Объект будет пропущен.');
                        continue;
                    }
                    feature.geometry = spObj;

                    geoJSONZones.features.push(feature);
                } else {
                    console.log('Нет описания пространственной составляющей зоны');
                }
            }
        } else {
            if (AllData.Zones.Zone.EntitySpatial !== null) {
                // Зона
                var feature = {
                    'type': 'Feature'
                };
                var spObj = ES.getEntitySpatial(AllData.Zones.Zone.EntitySpatial, projMSK, 'Zone', false);
                if ((spObj === undefined) || (spObj.length === 0)) {
                    console.log('Объект Зоны с пустой геометрией! Объект будет пропущен.');
                }
                feature.geometry = spObj;

                geoJSONZones.features.push(feature);
            } else {
                console.log('Нет описания пространственной составляющей зоны');
            }
        }
    }
    // Обработка всех земельных участков
    for (var e = 0; e < AllData.Parcels.Parcel.length; e++) {
        var spObj = null;
        // Земельный участок
        var feature = {
            'type': 'Feature'
        };
        if (AllData.Parcels.Parcel[e].EntitySpatial !== undefined) {
            spObj = ES.getEntitySpatial(AllData.Parcels.Parcel[e].EntitySpatial, projMSK, 'Parcel', false);
            if ((spObj === undefined) || (spObj.length === 0)) {
                continue;
            }

        }
        // Многоконтурный
        else if (AllData.Parcels.Parcel[e].Contours) {
            var Contours = AllData.Parcels.Parcel[e].Contours.Contour;
            var multiPolygon = [];
            for (var c = 0; c < Contours.length; c++) {
                var es = Contours[c].EntitySpatial;
                var p = ES.getEntitySpatial(es, projMSK, 'Parcel', true);
                if (p) {
                    multiPolygon.push(p);
                }
            }
            spObj = {
                type: "MultiPolygon",
                coordinates: multiPolygon
            };
        } else {
            //console.log('Нет описания пространственной составляющей');
        }

        // Если нет геометрии, то объект не нужен
        if (spObj) {
            feature.geometry = spObj;
            // Остальные свойства....
            var props = Props.getProperties(AllData.Parcels.Parcel[e], 'Parcel');
            if (props) {
                feature.properties = props.parcelProperties;
            }
            //console.log('Объект создан. КН:' + feature.properties.cadastreNumber);
            geoJSONParcels.features.push(feature);
        }

    }
    // Обработка строений. могут быть составные из разных геометрий
    if (AllData.ObjectsRealty.ObjectRealty) {
        if (AllData.ObjectsRealty.ObjectRealty.splice) {

            function processES(EntitySpatial, oType) {
                var spObj = ES.getEntitySpatial(EntitySpatial, projMSK, oType, false);
                if (spObj) {
                    feature.geometry = spObj;
                    if (spObj.type === 'GeometryCollection') {
                        geoJSONRealtyCollection.features.push(feature);
                        console.log('Добавлен geoJSONRealtyGeometryCollection');
                        console.log(spObj.geometries);
                    } else {
                        geoJSONRealty.features.push(feature);
                        console.log('Добавлен geoJSONRealty. Type ' + spObj.type);
                        console.log(spObj.coordinates);
                    }
                } else {
                    console.log('ОКС с пустой геометрией! Объект будет пропущен.');
                }
            }

            for (var i = 0; i < AllData.ObjectsRealty.ObjectRealty.length; i++) {
                var spObj = null;
                // ОКС
                var feature = {
                    'type': 'Feature'
                };
                // строения
                if (AllData.ObjectsRealty.ObjectRealty[i].Building) {
                    if (AllData.ObjectsRealty.ObjectRealty[i].Building.EntitySpatial) {
                        var props = Props.getProperties(AllData.ObjectsRealty.ObjectRealty[i].Building, 'Building');
                        if (props) {
                            feature.properties = props.buildingProperties;
                            console.log(props.buildingProperties);
                        }
                        processES(AllData.ObjectsRealty.ObjectRealty[i].Building.EntitySpatial, 'Building');
                    }
                }
                // объекты незавершённого строительства
                else if (AllData.ObjectsRealty.ObjectRealty[i].Uncompleted) {
                    if (AllData.ObjectsRealty.ObjectRealty[i].Uncompleted.EntitySpatial) {
                        var props = Props.getProperties(AllData.ObjectsRealty.ObjectRealty[i].Uncompleted, 'Uncompleted');
                        if (props) {
                            feature.properties = props.uncompletedProperties;
                            console.log(props.uncompletedProperties);
                        }
                        processES(AllData.ObjectsRealty.ObjectRealty[i].Uncompleted.EntitySpatial, 'Uncompleted');
                    }
                }
                // сооружения
                else if (AllData.ObjectsRealty.ObjectRealty[i].Construction) {
                    if (AllData.ObjectsRealty.ObjectRealty[i].Construction.EntitySpatial) {
                        var props = Props.getProperties(AllData.ObjectsRealty.ObjectRealty[i].Construction, 'Construction');
                        if (props) {
                            feature.properties = props.constructionProperties;
                            console.log(props.constructionProperties);
                        }
                        processES(AllData.ObjectsRealty.ObjectRealty[i].Construction.EntitySpatial, 'Construction');
                    }
                }
            }
        }
    }
    // Обработка пунктов ОМС

    return {
        geoJSONQuartal: geoJSONQuartal,
        geoJSONBounds: geoJSONBounds,
        geoJSONZones: geoJSONZones,
        geoJSONParcels: geoJSONParcels,
        geoJSONRealty: geoJSONRealty,
        geoJSONRealtyGeometryCollection: geoJSONRealtyCollection
    };
};
