/* 
 * Copyright (C) 2016 Filippov Vladislav
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
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