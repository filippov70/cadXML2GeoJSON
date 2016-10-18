/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
    var Converter = require('./cadXML2GeoJSON.js');

    var parcelStyle = {
        fillColor: "#b8e50e",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    var oksStyle = {
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 1
    };
    var quartallStyle = {
        fillColor: "#e4dea4",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.3
    };
    var zoneStyle = {
        fillColor: "#f91414",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    var boundlStyle = {
        fillColor: "#4b5c70",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    function layerFActory(geoJSON, layerStyle) {
        geoJSON.crs = {
            "type": "name",
            "properties": {
                "name": "urn:ogc:def:crs:EPSG::3857"
            }
        };
        return L.Proj.geoJson(
                geoJSON, {
                    style: layerStyle,
                    onEachFeature: function (feature, layer)
                    {
                        //layer.bindPopup(feature.properties);
                    }
                }
        );
    }

    var data = {

        init: function (map, reproject) {
            data._map = map;
            data.reproject = reproject;
            data._groups = {

            };

            data._exportCont = document.getElementById('exportCont');
            data._fileProgress = document.getElementById('fileProgress');
            var exportIcon = null;
            if (navigator.msSaveBlob) { // IE 10+
                exportIcon = L.DomUtil.create('button', 'button', data._exportCont);
            } else {
                exportIcon = L.DomUtil.create('a', 'button', data._exportCont);
                exportIcon.setAttribute('target', '_blank');
                exportIcon.setAttribute('href', '');
            }
            exportIcon.innerHTML = 'Экспорт в GeoJSON';
//      var convertCoord = L.DomUtil.get('convertMSK');
//      L.DomUtil.removeClass(convertCoord, 'hidden');
            data._countSpan = L.DomUtil.create('span', '', data._exportCont);
            exportIcon.addEventListener('click', function () {
                var obj = data.getBlob();
                if (navigator.msSaveOrOpenBlob) { // IE 10+
                    navigator.msSaveOrOpenBlob(obj.blob, obj.file);
                } else {
                    exportIcon.setAttribute('download', obj.file);
                    exportIcon.setAttribute('href', window.URL.createObjectURL(obj.blob));
                }
                data._countSpan.innerHTML = '(геометрий: <b>' + obj.count + '</b>)';
            }, false);
            L.DomUtil.addClass(data._exportCont, 'hidden');
            data._kptInfo = document.getElementById('kptInfo');

        },

        getBlob: function () {
            var fc = null,
                    items = data._groups;
            for (var g in items) {
                var geojson = items[g];
                if (fc) {
                    Array.prototype.push.apply(fc.features, geojson.features);
                } else {
                    fc = geojson;
                }
            }
            return {
                file: 'data_' + Date.now() + '.geojson',
                blob: new Blob([JSON.stringify(fc, null, '\t')], {type: 'text/json;charset=utf-8;'}),
                count: fc ? fc.features.length : 0
            };
        },

        selectFile: function (el) {
            data._kptInfo.innerHTML = '';
            data._fileProgress.innerHTML = '';
            L.DomUtil.addClass(data._exportCont, 'hidden');
            var reader = new FileReader(),
                    file = el.files[0];

            reader.onload = function () {
                data._fileProgress.innerHTML = 'загружено: <b>' + file.size + '</b> байт';
//        Object.keys(data._groups).forEach(function (type) {
//          var group = data._groups[type];
//          group.clearLayers();
//          data._map.removeLayer(group);
//        });
//        data._groups = {};
//        Object.keys(data._groupsMsk).forEach(function (type) {
//          var group = data._groupsMsk[type];
//          group.clearLayers();
//        });
//        data._groupsMsk = {};
                if (data._map.layers) {
                    for (var i = 0; i < data._map.layers.length; i++) {
                        data._map.removeLayer(data._map.layers[i]);
                    }
                }
                var oldLayerControl = document.getElementsByClassName('leaflet-control-layers');
                if (oldLayerControl.length>0) {
                    L.DomUtil.remove(oldLayerControl[0]);
                }
                data._groups = {};
                data.parseFile(reader);
            };
            reader.onprogress = function (data) {
                if (data.lengthComputable) {
                    L.DomUtil.removeClass(data._resCont, 'hidden');
                    var cnt = data.loaded / data.total;
                    data._fileProgress.innerHTML = 'загружено: <b>' + data.loaded + '</b> байт' + (cnt === 1 ? '' : '(' + parseInt(cnt * 100, 10) + '%)');
                }
            };
            if (el.files.length) {
                reader.readAsText(file);
            }
        },

        parseFile: function (reader) {
            // https://bitbucket.org/surenrao/xml2json
            // http://www.chrome-allow-file-access-from-file.com/
            var parsedData = Converter.GeoJSON(reader.result);
            var parcels = parsedData.geoJSONParcels;
            var oks = parsedData.geoJSONRealty;
            var zones = parsedData.geoJSONZones;
            var quartal = parsedData.geoJSONQuartal;
            var bounds = parsedData.geoJSONBounds;

            data._groups = {
                parcels: parcels,
                oks: oks,
                zones: zones,
                quartal: quartal,
                bounds: bounds
            };

            var oksLayer = layerFActory(oks, oksStyle);
            var parcelLayer = layerFActory(parcels, parcelStyle);
            var zoneLayer = layerFActory(zones, zoneStyle);
            var boundLayer = layerFActory(bounds, boundlStyle);
            var quartalLayer = layerFActory(quartal, quartallStyle);

            var layerControl = L.control.layers({}, {
                'Квартал': quartalLayer,
                'Границы': boundLayer,
                'Зоны': zoneLayer,
                'Участки': parcelLayer,
                'ОКС': oksLayer
            }).addTo(data._map);

            data._map.fitBounds(parcelLayer.getBounds());
            L.DomUtil.removeClass(data._exportCont, 'hidden');
        }
    };
    window.convertedData = data;
})();
