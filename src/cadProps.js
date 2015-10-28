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
'use strict';
// Dicts

// Статус объекта недвижимости
var dStates = {
    '01': 'Ранее учтенный',
    '05': 'Временный',
    '06': 'Учтенный',
    '07': 'Снят с учета',
    '08': 'Аннулированный'
};
// Тип  объекта недвижимости
var dParcels = {
    '01': 'Землепользование',
    '02': 'Единое землепользование',
    '03': 'Обособленный участок',
    '04': 'Условный участок',
    '05': 'Многоконтурный участок',
    '06': 'Значение отсутствует'
};
// Категория земель
var dCategories = {
    '003001000000': 'Земли сельскохозяйственного назначения',
    '003002000000': 'Земли населённых пунктов',
    '003003000000': 'Земли промышленности, энергетики, транспорта, связи, радиовещания, телевидения, информатики, земли для обеспечения космической деятельности, земли обороны, безопасности и земли иного специального назначения',
    '003004000000': 'Земли особо охраняемых территорий и объектов',
    '003005000000': 'Земли лесного фонда',
    '003006000000': 'Земли водного фонда',
    '003007000000': 'Земли запаса',
    '003008000000': 'Категория не установлена'
};
var ParcelProperties;

function getValueFromDict(Key, Dic) {
    for (var k in Dic) {
        if (k === Key) {
            return Dic[k];
        }
    }
}

module.exports.getProperties = function (Feature, FeatureType) {
    switch (FeatureType) {
        case 'Parcel' :
        {
            ParcelProperties = {
                cadastreNumber: '', // require
                State: '01', // dStates require
                DateCreated: '',
                Name: '', //dParcels require
                Category: '', // dCategories // require
                Area: {// requre
                    Area: 0, // require
                    Unit: '', //dUnit require
                    Inaccuracy: '' // d20_2
                },
                Utilization: {// require
                    ByDoc: '',
                    Utilization: '' // dUtilization require
                }
            };
            ParcelProperties.cadastreNumber = Feature.CadastralNumber;
            ParcelProperties.State = getValueFromDict(Feature.State, dStates);
            ParcelProperties.Name = getValueFromDict(Feature.Name, dParcels);
            ParcelProperties.Category = getValueFromDict(Feature.Category, dCategories);
            break;
        }
    }
    return {
        properties: ParcelProperties
    };
};