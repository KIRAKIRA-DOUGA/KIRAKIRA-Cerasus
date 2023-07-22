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

export class Comments200ResponseInner {
    'id'?: number;
    'created'?: string;
    'content'?: string;
    'fullname'?: string;
    'profilePictureUrl'?: string;
    'upvoteCount'?: number;
    'userHasUpvoted'?: boolean;
    'userHasDownvoted'?: boolean;
    'authoredByCurrentUser'?: boolean;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "id",
            "baseName": "id",
            "type": "number",
            "format": ""
        },
        {
            "name": "created",
            "baseName": "created",
            "type": "string",
            "format": ""
        },
        {
            "name": "content",
            "baseName": "content",
            "type": "string",
            "format": ""
        },
        {
            "name": "fullname",
            "baseName": "fullname",
            "type": "string",
            "format": ""
        },
        {
            "name": "profilePictureUrl",
            "baseName": "profile_picture_url",
            "type": "string",
            "format": ""
        },
        {
            "name": "upvoteCount",
            "baseName": "upvote_count",
            "type": "number",
            "format": ""
        },
        {
            "name": "userHasUpvoted",
            "baseName": "user_has_upvoted",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "userHasDownvoted",
            "baseName": "user_has_downvoted",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "authoredByCurrentUser",
            "baseName": "authored_by_current_user",
            "type": "boolean",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return Comments200ResponseInner.attributeTypeMap;
    }

    public constructor() {
    }
}

