// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { Comments200ResponseInner } from '../models/Comments200ResponseInner';
import { GetDanmaku200ResponseInner } from '../models/GetDanmaku200ResponseInner';
import { Users200Response } from '../models/Users200Response';
import { VideoDetail200Response } from '../models/VideoDetail200Response';
import { Videos200Response } from '../models/Videos200Response';
import { Videos200ResponseVideosInner } from '../models/Videos200ResponseVideosInner';

/**
 * no description
 */
export class DefaultApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * Comment on a video
     * @param parent parent comment ID
     * @param content comment message
     * @param videoID comment\&#39;s video ID
     */
    public async comment(parent: number, content: string, videoID: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'parent' is not null or undefined
        if (parent === null || parent === undefined) {
            throw new RequiredError("DefaultApi", "comment", "parent");
        }


        // verify required parameter 'content' is not null or undefined
        if (content === null || content === undefined) {
            throw new RequiredError("DefaultApi", "comment", "content");
        }


        // verify required parameter 'videoID' is not null or undefined
        if (videoID === null || videoID === undefined) {
            throw new RequiredError("DefaultApi", "comment", "videoID");
        }


        // Path Params
        const localVarPath = '/comment';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("parent", ObjectSerializer.serialize(parent, "number", ""));

        // Header Params
        requestContext.setHeaderParam("content", ObjectSerializer.serialize(content, "string", "byte"));

        // Header Params
        requestContext.setHeaderParam("videoID", ObjectSerializer.serialize(videoID, "number", ""));


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get comments for video ID
     * @param id video ID
     */
    public async comments(id: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new RequiredError("DefaultApi", "comments", "id");
        }


        // Path Params
        const localVarPath = '/comments/{id}'
            .replace('{' + 'id' + '}', encodeURIComponent(String(id)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Create new danmaku
     * @param videoID video ID for danmaku
     * @param timestamp timestamp for danmaku
     * @param message message
     * @param type type of comment
     * @param color comment color
     * @param fontSize comment font size
     */
    public async createDanmaku(videoID: number, timestamp: string, message: string, type: string, color: string, fontSize: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'videoID' is not null or undefined
        if (videoID === null || videoID === undefined) {
            throw new RequiredError("DefaultApi", "createDanmaku", "videoID");
        }


        // verify required parameter 'timestamp' is not null or undefined
        if (timestamp === null || timestamp === undefined) {
            throw new RequiredError("DefaultApi", "createDanmaku", "timestamp");
        }


        // verify required parameter 'message' is not null or undefined
        if (message === null || message === undefined) {
            throw new RequiredError("DefaultApi", "createDanmaku", "message");
        }


        // verify required parameter 'type' is not null or undefined
        if (type === null || type === undefined) {
            throw new RequiredError("DefaultApi", "createDanmaku", "type");
        }


        // verify required parameter 'color' is not null or undefined
        if (color === null || color === undefined) {
            throw new RequiredError("DefaultApi", "createDanmaku", "color");
        }


        // verify required parameter 'fontSize' is not null or undefined
        if (fontSize === null || fontSize === undefined) {
            throw new RequiredError("DefaultApi", "createDanmaku", "fontSize");
        }


        // Path Params
        const localVarPath = '/danmaku';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("VideoID", ObjectSerializer.serialize(videoID, "number", ""));

        // Header Params
        requestContext.setHeaderParam("timestamp", ObjectSerializer.serialize(timestamp, "string", ""));

        // Header Params
        requestContext.setHeaderParam("message", ObjectSerializer.serialize(message, "string", "byte"));

        // Header Params
        requestContext.setHeaderParam("Type", ObjectSerializer.serialize(type, "string", ""));

        // Header Params
        requestContext.setHeaderParam("Color", ObjectSerializer.serialize(color, "string", ""));

        // Header Params
        requestContext.setHeaderParam("FontSize", ObjectSerializer.serialize(fontSize, "string", ""));


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Delete a comment
     * @param id comment ID
     */
    public async deleteComment(id: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new RequiredError("DefaultApi", "deleteComment", "id");
        }


        // Path Params
        const localVarPath = '/delete_comment';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("id", ObjectSerializer.serialize(id, "number", ""));


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Create new email validation
     * @param email email
     */
    public async emailValidation(email: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'email' is not null or undefined
        if (email === null || email === undefined) {
            throw new RequiredError("DefaultApi", "emailValidation", "email");
        }


        // Path Params
        const localVarPath = '/email-verification';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("email", ObjectSerializer.serialize(email, "string", ""));


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Upvote a video
     * @param id user ID
     */
    public async follow(id: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new RequiredError("DefaultApi", "follow", "id");
        }


        // Path Params
        const localVarPath = '/follow/{id}'
            .replace('{' + 'id' + '}', encodeURIComponent(String(id)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Upvote a video
     */
    public async followFeed(_options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // Path Params
        const localVarPath = '/follow-feed';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get danmaku for video
     * @param id video ID
     */
    public async getDanmaku(id: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new RequiredError("DefaultApi", "getDanmaku", "id");
        }


        // Path Params
        const localVarPath = '/danmaku/{id}'
            .replace('{' + 'id' + '}', encodeURIComponent(String(id)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Log the user in
     * @param username search string
     * @param password sort category
     */
    public async login(username: string, password: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'username' is not null or undefined
        if (username === null || username === undefined) {
            throw new RequiredError("DefaultApi", "login", "username");
        }


        // verify required parameter 'password' is not null or undefined
        if (password === null || password === undefined) {
            throw new RequiredError("DefaultApi", "login", "password");
        }


        // Path Params
        const localVarPath = '/login';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("username", ObjectSerializer.serialize(username, "string", ""));

        // Header Params
        requestContext.setHeaderParam("password", ObjectSerializer.serialize(password, "string", ""));


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Log user out
     */
    public async logout(_options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // Path Params
        const localVarPath = '/logout';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get list of videos
     * @param id video ID
     */
    public async recommendations(id: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new RequiredError("DefaultApi", "recommendations", "id");
        }


        // Path Params
        const localVarPath = '/recommendations/{id}'
            .replace('{' + 'id' + '}', encodeURIComponent(String(id)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Register user
     * @param username username to register
     * @param password sort category
     * @param email sort category
     * @param verificationCode verification code
     */
    public async register(username: string, password: string, email: string, verificationCode: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'username' is not null or undefined
        if (username === null || username === undefined) {
            throw new RequiredError("DefaultApi", "register", "username");
        }


        // verify required parameter 'password' is not null or undefined
        if (password === null || password === undefined) {
            throw new RequiredError("DefaultApi", "register", "password");
        }


        // verify required parameter 'email' is not null or undefined
        if (email === null || email === undefined) {
            throw new RequiredError("DefaultApi", "register", "email");
        }


        // verify required parameter 'verificationCode' is not null or undefined
        if (verificationCode === null || verificationCode === undefined) {
            throw new RequiredError("DefaultApi", "register", "verificationCode");
        }


        // Path Params
        const localVarPath = '/register';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("username", ObjectSerializer.serialize(username, "string", ""));

        // Header Params
        requestContext.setHeaderParam("password", ObjectSerializer.serialize(password, "string", ""));

        // Header Params
        requestContext.setHeaderParam("email", ObjectSerializer.serialize(email, "string", ""));

        // Header Params
        requestContext.setHeaderParam("verification_code", ObjectSerializer.serialize(verificationCode, "number", ""));


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Reset password
     * @param oldpassword old password
     * @param newpassword new password
     */
    public async resetPassword(oldpassword: string, newpassword: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'oldpassword' is not null or undefined
        if (oldpassword === null || oldpassword === undefined) {
            throw new RequiredError("DefaultApi", "resetPassword", "oldpassword");
        }


        // verify required parameter 'newpassword' is not null or undefined
        if (newpassword === null || newpassword === undefined) {
            throw new RequiredError("DefaultApi", "resetPassword", "newpassword");
        }


        // Path Params
        const localVarPath = '/reset_password';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("oldpassword", ObjectSerializer.serialize(oldpassword, "string", ""));

        // Header Params
        requestContext.setHeaderParam("newpassword", ObjectSerializer.serialize(newpassword, "string", ""));


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Update user\'s profile
     * @param username new username
     * @param gender new gender
     * @param birthdate new birthdate
     * @param bio new bio
     */
    public async updateProfile(username: string, gender: string, birthdate: string, bio: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'username' is not null or undefined
        if (username === null || username === undefined) {
            throw new RequiredError("DefaultApi", "updateProfile", "username");
        }


        // verify required parameter 'gender' is not null or undefined
        if (gender === null || gender === undefined) {
            throw new RequiredError("DefaultApi", "updateProfile", "gender");
        }


        // verify required parameter 'birthdate' is not null or undefined
        if (birthdate === null || birthdate === undefined) {
            throw new RequiredError("DefaultApi", "updateProfile", "birthdate");
        }


        // verify required parameter 'bio' is not null or undefined
        if (bio === null || bio === undefined) {
            throw new RequiredError("DefaultApi", "updateProfile", "bio");
        }


        // Path Params
        const localVarPath = '/update-profile';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("username", ObjectSerializer.serialize(username, "string", "byte"));

        // Header Params
        requestContext.setHeaderParam("gender", ObjectSerializer.serialize(gender, "string", "byte"));

        // Header Params
        requestContext.setHeaderParam("birthdate", ObjectSerializer.serialize(birthdate, "string", ""));

        // Header Params
        requestContext.setHeaderParam("bio", ObjectSerializer.serialize(bio, "string", "byte"));


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Upload a new video
     * @param tags list of video tags
     * @param title video title
     * @param description video description
     * @param category category
     * @param filename 
     */
    public async upload(tags: Array<string>, title: string, description: string, category: string, filename?: Array<HttpFile>, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'tags' is not null or undefined
        if (tags === null || tags === undefined) {
            throw new RequiredError("DefaultApi", "upload", "tags");
        }


        // verify required parameter 'title' is not null or undefined
        if (title === null || title === undefined) {
            throw new RequiredError("DefaultApi", "upload", "title");
        }


        // verify required parameter 'description' is not null or undefined
        if (description === null || description === undefined) {
            throw new RequiredError("DefaultApi", "upload", "description");
        }


        // verify required parameter 'category' is not null or undefined
        if (category === null || category === undefined) {
            throw new RequiredError("DefaultApi", "upload", "category");
        }



        // Path Params
        const localVarPath = '/upload';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("tags", ObjectSerializer.serialize(tags, "Array<string>", ""));

        // Header Params
        requestContext.setHeaderParam("title", ObjectSerializer.serialize(title, "string", ""));

        // Header Params
        requestContext.setHeaderParam("description", ObjectSerializer.serialize(description, "string", ""));

        // Header Params
        requestContext.setHeaderParam("category", ObjectSerializer.serialize(category, "string", ""));

        // Form Params
        const useForm = canConsumeForm([
            'multipart/form-data',
        ]);

        let localVarFormParams
        if (useForm) {
            localVarFormParams = new FormData();
        } else {
            localVarFormParams = new URLSearchParams();
        }

        if (filename) {
            // TODO: replace .append with .set
            localVarFormParams.append('filename', filename.join(COLLECTION_FORMATS["csv"]));
        }

        requestContext.setBody(localVarFormParams);

        if(!useForm) {
            const contentType = ObjectSerializer.getPreferredMediaType([
                "multipart/form-data"
            ]);
            requestContext.setHeaderParam("Content-Type", contentType);
        }

        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get user video data
     * @param id comment ID
     * @param score upvote score
     */
    public async upvote(id: number, score: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new RequiredError("DefaultApi", "upvote", "id");
        }


        // verify required parameter 'score' is not null or undefined
        if (score === null || score === undefined) {
            throw new RequiredError("DefaultApi", "upvote", "score");
        }


        // Path Params
        const localVarPath = '/upvote/{id}'
            .replace('{' + 'id' + '}', encodeURIComponent(String(id)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("score", ObjectSerializer.serialize(score, "number", ""));


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Upvote a video
     * @param id video ID
     * @param score upvote score
     */
    public async upvoteVideo(id: number, score: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new RequiredError("DefaultApi", "upvoteVideo", "id");
        }


        // verify required parameter 'score' is not null or undefined
        if (score === null || score === undefined) {
            throw new RequiredError("DefaultApi", "upvoteVideo", "score");
        }


        // Path Params
        const localVarPath = '/upvotevideo/{id}'
            .replace('{' + 'id' + '}', encodeURIComponent(String(id)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.POST);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("score", ObjectSerializer.serialize(score, "number", ""));


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get user video data
     * @param id user ID
     */
    public async users(id: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new RequiredError("DefaultApi", "users", "id");
        }


        // Path Params
        const localVarPath = '/users/{id}'
            .replace('{' + 'id' + '}', encodeURIComponent(String(id)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get list of videos
     * @param id video ID
     */
    public async videoDetail(id: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'id' is not null or undefined
        if (id === null || id === undefined) {
            throw new RequiredError("DefaultApi", "videoDetail", "id");
        }


        // Path Params
        const localVarPath = '/videos/{id}'
            .replace('{' + 'id' + '}', encodeURIComponent(String(id)));

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

    /**
     * Get list of videos
     * @param search search string
     * @param sortCategory sort category
     * @param order sort category
     * @param unapproved sort category
     * @param pageNumber page number
     * @param category category
     */
    public async videos(search?: string, sortCategory?: string, order?: string, unapproved?: string, pageNumber?: number, category?: string, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;







        // Path Params
        const localVarPath = '/videos';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Header Params
        requestContext.setHeaderParam("search", ObjectSerializer.serialize(search, "string", "byte"));

        // Header Params
        requestContext.setHeaderParam("sortCategory", ObjectSerializer.serialize(sortCategory, "string", ""));

        // Header Params
        requestContext.setHeaderParam("order", ObjectSerializer.serialize(order, "string", ""));

        // Header Params
        requestContext.setHeaderParam("unapproved", ObjectSerializer.serialize(unapproved, "string", ""));

        // Header Params
        requestContext.setHeaderParam("pageNumber", ObjectSerializer.serialize(pageNumber, "number", ""));

        // Header Params
        requestContext.setHeaderParam("category", ObjectSerializer.serialize(category, "string", "byte"));


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

}

export class DefaultApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to comment
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async commentWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, undefined);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            throw new ApiException<undefined>(response.httpStatusCode, "Unexpected error", undefined, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: void = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "void", ""
            ) as void;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to comments
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async commentsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Array<Comments200ResponseInner> >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Array<Comments200ResponseInner> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Array<Comments200ResponseInner>", ""
            ) as Array<Comments200ResponseInner>;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            throw new ApiException<undefined>(response.httpStatusCode, "Unexpected error", undefined, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Array<Comments200ResponseInner> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Array<Comments200ResponseInner>", ""
            ) as Array<Comments200ResponseInner>;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to createDanmaku
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async createDanmakuWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, undefined);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            throw new ApiException<undefined>(response.httpStatusCode, "Unexpected error", undefined, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: void = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "void", ""
            ) as void;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to deleteComment
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async deleteCommentWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, undefined);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            throw new ApiException<undefined>(response.httpStatusCode, "Unexpected error", undefined, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: void = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "void", ""
            ) as void;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to emailValidation
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async emailValidationWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, undefined);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            throw new ApiException<undefined>(response.httpStatusCode, "Unexpected error", undefined, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: void = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "void", ""
            ) as void;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to follow
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async followWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, undefined);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            throw new ApiException<undefined>(response.httpStatusCode, "Unexpected error", undefined, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: void = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "void", ""
            ) as void;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to followFeed
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async followFeedWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Array<Videos200ResponseVideosInner> >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Array<Videos200ResponseVideosInner> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Array<Videos200ResponseVideosInner>", ""
            ) as Array<Videos200ResponseVideosInner>;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            throw new ApiException<undefined>(response.httpStatusCode, "Unexpected error", undefined, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Array<Videos200ResponseVideosInner> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Array<Videos200ResponseVideosInner>", ""
            ) as Array<Videos200ResponseVideosInner>;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to getDanmaku
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async getDanmakuWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Array<GetDanmaku200ResponseInner> >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Array<GetDanmaku200ResponseInner> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Array<GetDanmaku200ResponseInner>", ""
            ) as Array<GetDanmaku200ResponseInner>;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Array<GetDanmaku200ResponseInner> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Array<GetDanmaku200ResponseInner>", ""
            ) as Array<GetDanmaku200ResponseInner>;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to login
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async loginWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, undefined);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            throw new ApiException<undefined>(response.httpStatusCode, "Unexpected error", undefined, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: void = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "void", ""
            ) as void;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to logout
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async logoutWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, undefined);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            throw new ApiException<undefined>(response.httpStatusCode, "Unexpected error", undefined, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: void = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "void", ""
            ) as void;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to recommendations
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async recommendationsWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Array<Videos200ResponseVideosInner> >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Array<Videos200ResponseVideosInner> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Array<Videos200ResponseVideosInner>", ""
            ) as Array<Videos200ResponseVideosInner>;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            throw new ApiException<undefined>(response.httpStatusCode, "Unexpected error", undefined, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Array<Videos200ResponseVideosInner> = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Array<Videos200ResponseVideosInner>", ""
            ) as Array<Videos200ResponseVideosInner>;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to register
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async registerWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, undefined);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            throw new ApiException<undefined>(response.httpStatusCode, "Unexpected error", undefined, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: void = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "void", ""
            ) as void;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to resetPassword
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async resetPasswordWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, undefined);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            throw new ApiException<undefined>(response.httpStatusCode, "Unexpected error", undefined, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: void = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "void", ""
            ) as void;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to updateProfile
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async updateProfileWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, undefined);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            throw new ApiException<undefined>(response.httpStatusCode, "Unexpected error", undefined, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: void = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "void", ""
            ) as void;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to upload
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async uploadWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, undefined);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            throw new ApiException<undefined>(response.httpStatusCode, "Unexpected error", undefined, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: void = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "void", ""
            ) as void;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to upvote
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async upvoteWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, undefined);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            throw new ApiException<undefined>(response.httpStatusCode, "Unexpected error", undefined, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: void = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "void", ""
            ) as void;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to upvoteVideo
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async upvoteVideoWithHttpInfo(response: ResponseContext): Promise<HttpInfo<void >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, undefined);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            throw new ApiException<undefined>(response.httpStatusCode, "Unexpected error", undefined, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: void = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "void", ""
            ) as void;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to users
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async usersWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Users200Response >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Users200Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Users200Response", ""
            ) as Users200Response;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            throw new ApiException<undefined>(response.httpStatusCode, "Unexpected error", undefined, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Users200Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Users200Response", ""
            ) as Users200Response;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to videoDetail
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async videoDetailWithHttpInfo(response: ResponseContext): Promise<HttpInfo<VideoDetail200Response >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: VideoDetail200Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "VideoDetail200Response", ""
            ) as VideoDetail200Response;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            throw new ApiException<undefined>(response.httpStatusCode, "Unexpected error", undefined, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: VideoDetail200Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "VideoDetail200Response", ""
            ) as VideoDetail200Response;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to videos
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async videosWithHttpInfo(response: ResponseContext): Promise<HttpInfo<Videos200Response >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: Videos200Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Videos200Response", ""
            ) as Videos200Response;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("0", response.httpStatusCode)) {
            throw new ApiException<undefined>(response.httpStatusCode, "Unexpected error", undefined, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: Videos200Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "Videos200Response", ""
            ) as Videos200Response;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
