import { ResponseContext, RequestContext, HttpFile } from '../http/http';
import { Configuration} from '../configuration'

import { Comments200ResponseInner } from '../models/Comments200ResponseInner';
import { VideoDetail200Response } from '../models/VideoDetail200Response';
import { Videos200Response } from '../models/Videos200Response';
import { Videos200ResponsePaginationData } from '../models/Videos200ResponsePaginationData';
import { Videos200ResponseVideosInner } from '../models/Videos200ResponseVideosInner';

import { ObservableDefaultApi } from "./ObservableAPI";
import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";

export interface DefaultApiCommentRequest {
    /**
     * parent comment ID
     * @type number
     * @memberof DefaultApicomment
     */
    parent: number
    /**
     * comment message
     * @type string
     * @memberof DefaultApicomment
     */
    content: string
    /**
     * comment\&#39;s video ID
     * @type number
     * @memberof DefaultApicomment
     */
    videoID: number
}

export interface DefaultApiCommentsRequest {
    /**
     * video ID
     * @type number
     * @memberof DefaultApicomments
     */
    id: number
}

export interface DefaultApiLoginRequest {
    /**
     * search string
     * @type string
     * @memberof DefaultApilogin
     */
    username: string
    /**
     * sort category
     * @type string
     * @memberof DefaultApilogin
     */
    password: string
}

export interface DefaultApiLogoutRequest {
}

export interface DefaultApiRegisterRequest {
    /**
     * username to register
     * @type string
     * @memberof DefaultApiregister
     */
    username: string
    /**
     * sort category
     * @type string
     * @memberof DefaultApiregister
     */
    password: string
    /**
     * sort category
     * @type string
     * @memberof DefaultApiregister
     */
    email: string
}

export interface DefaultApiUploadRequest {
    /**
     * list of video tags
     * @type Array&lt;string&gt;
     * @memberof DefaultApiupload
     */
    tags: Array<string>
    /**
     * video title
     * @type string
     * @memberof DefaultApiupload
     */
    title: string
    /**
     * video description
     * @type string
     * @memberof DefaultApiupload
     */
    description: string
    /**
     * 
     * @type Array&lt;HttpFile&gt;
     * @memberof DefaultApiupload
     */
    filename?: Array<HttpFile>
}

export interface DefaultApiVideoDetailRequest {
    /**
     * video ID
     * @type number
     * @memberof DefaultApivideoDetail
     */
    id: number
}

export interface DefaultApiVideosRequest {
    /**
     * search string
     * @type string
     * @memberof DefaultApivideos
     */
    search?: string
    /**
     * sort category
     * @type string
     * @memberof DefaultApivideos
     */
    category?: string
    /**
     * sort category
     * @type string
     * @memberof DefaultApivideos
     */
    order?: string
    /**
     * sort category
     * @type string
     * @memberof DefaultApivideos
     */
    unapproved?: string
}

export class ObjectDefaultApi {
    private api: ObservableDefaultApi

    public constructor(configuration: Configuration, requestFactory?: DefaultApiRequestFactory, responseProcessor?: DefaultApiResponseProcessor) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Comment on a video
     * @param param the request object
     */
    public comment(param: DefaultApiCommentRequest, options?: Configuration): Promise<void> {
        return this.api.comment(param.parent, param.content, param.videoID,  options).toPromise();
    }

    /**
     * Get comments for video ID
     * @param param the request object
     */
    public comments(param: DefaultApiCommentsRequest, options?: Configuration): Promise<Array<Comments200ResponseInner>> {
        return this.api.comments(param.id,  options).toPromise();
    }

    /**
     * Log the user in
     * @param param the request object
     */
    public login(param: DefaultApiLoginRequest, options?: Configuration): Promise<void> {
        return this.api.login(param.username, param.password,  options).toPromise();
    }

    /**
     * Log user out
     * @param param the request object
     */
    public logout(param: DefaultApiLogoutRequest = {}, options?: Configuration): Promise<void> {
        return this.api.logout( options).toPromise();
    }

    /**
     * Register user
     * @param param the request object
     */
    public register(param: DefaultApiRegisterRequest, options?: Configuration): Promise<void> {
        return this.api.register(param.username, param.password, param.email,  options).toPromise();
    }

    /**
     * Upload a new video
     * @param param the request object
     */
    public upload(param: DefaultApiUploadRequest, options?: Configuration): Promise<void> {
        return this.api.upload(param.tags, param.title, param.description, param.filename,  options).toPromise();
    }

    /**
     * Get list of videos
     * @param param the request object
     */
    public videoDetail(param: DefaultApiVideoDetailRequest, options?: Configuration): Promise<VideoDetail200Response> {
        return this.api.videoDetail(param.id,  options).toPromise();
    }

    /**
     * Get list of videos
     * @param param the request object
     */
    public videos(param: DefaultApiVideosRequest = {}, options?: Configuration): Promise<Videos200Response> {
        return this.api.videos(param.search, param.category, param.order, param.unapproved,  options).toPromise();
    }

}
