/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function () {
  var Converter = require('./cadXML2GeoJSON.js');
  var data = {

    init: function (map, reproject) {
      data._map = map;
      data.reproject = reproject;
      data._geoContent = {

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
      var convertCoord = L.DomUtil.get('convertMSK');
      L.DomUtil.removeClass(convertCoord, 'hidden');
      data._countSpan = L.DomUtil.create('span', '', data._exportCont);
      exportIcon.addEventListener('click', function () {
        var obj = data.getBlob(convertCoord.checked);
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
      data._groups = {};
    },

    selectFile: function (el) {
      data._kptInfo.innerHTML = '';
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
      console.log(parsedData.geoJSONParcels);
//      $.get('./testdata/doc2161974.xml', function (xml) {
//        //var json = $.xml2json(xml).CadastralBlocks;
//        // $("#data").html('<code>'+JSON.stringify(json)+'</code>');
//        console.log(Converter.GeoJSON);
//        parsedData = Converter.GeoJSON(xml, true);
//      }).success(
//              function () {
//                $('#loading').toggleClass('hidden');
//                var zones = parsedData.geoJSONZones;
//                var quartal = parsedData.geoJSONQuartal;
//                var bounds = parsedData.geoJSONBounds;
//              });
    }
  };
  window.convertedData = data;
})();
