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

var ParcelProperties;

// Functions
function getValueFromDict(Key, Dict) {
    var retVal = '';
    switch (Dict) {
        case 'dStates':
        {
            retVal = '06';
        }
    }
    return retVal;
}

module.exports.getProperties = function (Feature, FeatureType) {
    switch (FeatureType) {
        case 'Parcel' :
        {
            ParcelProperties = {
                cadastreNumber: '', // require
                Sate: '01', // dStates require
                DateCreated: '',
                Name: '', //dNames require
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
            ParcelProperties.Sate = getValueFromDict(Feature.State, 'dStates');
            break;
        }
    }
    return {
        properties: ParcelProperties
    };
};