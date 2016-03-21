/* 
 * The MIT License
 *
 * Copyright 2015 filippov.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/*  Сиcтемы координат имеют смысл для визуализации получаемых GeoJSON,
    для сохранения в файл нет надобности в преобразовании.
    Информация о системах координат хранится в теге <CoordSystems>
    <CoordSystems>
        <ns3:CoordSystem Name="МСК 70, зона 3" CsId="ID3" />
        <ns3:CoordSystem Name="МСК 70, зона 4" CsId="ID4" />
    </CoordSystems>
    их может быть несколько.
    У объектов в теге <EntitySpatial> указано в какой СК он имеет координаты,
    например:
    <EntitySpatial EntSys="ID3">
*/ 


module.exports.SpatialSysyems = {
    // Томская область
    'МСК 70, зона 4': '+proj=tmerc +lat_0=0 +lon_0=83.73333333333 +k=1 +x_0=4250000 +y_0=-5912900.566 +ellps=krass +towgs84=23.57,-140.95,-79.8,0,0.35,0.79,-0.22 +units=m +no_defs',
    'МСК 70, зона 2': '+proj=tmerc +lat_0=0 +lon_0=77.73333333333 +k=1 +x_0=2250000 +y_0=-5912900.566 +ellps=krass +towgs84=23.57,-140.95,-79.8,0,0.35,0.79,-0.22 +units=m +no_defs',
    'МСК 70, зона 3': '+proj=tmerc +lat_0=0 +lon_0=80.73333333333 +k=1 +x_0=3250000 +y_0=-5912900.566 +ellps=krass +towgs84=23.57,-140.95,-79.8,0,0.35,0.79,-0.22 +units=m +no_defs'
};