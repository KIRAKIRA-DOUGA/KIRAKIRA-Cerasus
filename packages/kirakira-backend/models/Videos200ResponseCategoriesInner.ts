/**
 * Kirakira Backend API
 * The API for Kirakira
 *
 * OpenAPI spec version: 0.0.1
 * Contact: horahora1567@gmail.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { HttpFile } from '../http/http';

export class Videos200ResponseCategoriesInner {
    'name'?: string;
    'cardinality'?: number;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "name",
            "baseName": "Name",
            "type": "string",
            "format": ""
        },
        {
            "name": "cardinality",
            "baseName": "Cardinality",
            "type": "number",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return Videos200ResponseCategoriesInner.attributeTypeMap;
    }

    public constructor() {
    }
}

