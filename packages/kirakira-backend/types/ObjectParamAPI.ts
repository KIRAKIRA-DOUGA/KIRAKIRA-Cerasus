import { ResponseContext, RequestContext, HttpFile } from '../http/http';
import { Configuration} from '../configuration'

import { Comments200ResponseInner } from '../models/Comments200ResponseInner';
import { GetDanmaku200ResponseInner } from '../models/GetDanmaku200ResponseInner';
import { Users200Response } from '../models/Users200Response';
import { VideoDetail200Response } from '../models/VideoDetail200Response';
import { Videos200Response } from '../models/Videos200Response';
import { Videos200ResponseCategoriesInner } from '../models/Videos200ResponseCategoriesInner';
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
    videoIDf: number
}

export interface DefaultApiCommentsRequest {
    /**
     * video ID
     * @type number
     * @memberof DefaultApicomments
     */
    id: number
}

export interface DefaultApiCreateDanmakuRequest {
    /**
     * video ID for danmaku
     * @type number
     * @memberof DefaultApicreateDanmaku
     */
    videoID: number
    /**
     * timestamp for danmaku
     * @type string
     * @memberof DefaultApicreateDanmaku
     */
    timestamp: string
    /**
     * message
     * @type string
     * @memberof DefaultApicreateDanmaku
     */
    message: string
    /**
     * type of comment
     * @type string
     * @memberof DefaultApicreateDanmaku
     */
    type: string
    /**
     * comment color
     * @type string
     * @memberof DefaultApicreateDanmaku
     */
    color: string
    /**
     * comment font size
     * @type string
     * @memberof DefaultApicreateDanmaku
     */
    fontSize: string
}

export interface DefaultApiDeleteCommentRequest {
    /**
     * comment ID
     * @type number
     * @memberof DefaultApideleteComment
     */
    id: number
}

export interface DefaultApiFollowRequest {
    /**
     * user ID
     * @type number
     * @memberof DefaultApifollow
     */
    id: number
}

export interface DefaultApiFollowFeedRequest {
}

export interface DefaultApiGetDanmakuRequest {
    /**
     * video ID
     * @type number
     * @memberof DefaultApigetDanmaku
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

export interface DefaultApiRecommendationsRequest {
    /**
     * video ID
     * @type number
     * @memberof DefaultApirecommendations
     */
    id: number
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

export interface DefaultApiResetPasswordRequest {
    /**
     * old password
     * @type string
     * @memberof DefaultApiresetPassword
     */
    oldpassword: string
    /**
     * new password
     * @type string
     * @memberof DefaultApiresetPassword
     */
    newpassword: string
}

export interface DefaultApiUpdateProfileRequest {
    /**
     * new username
     * @type string
     * @memberof DefaultApiupdateProfile
     */
    username: string
    /**
     * new gender
     * @type string
     * @memberof DefaultApiupdateProfile
     */
    gender: string
    /**
     * new birthdate
     * @type string
     * @memberof DefaultApiupdateProfile
     */
    birthdate: string
    /**
     * new bio
     * @type string
     * @memberof DefaultApiupdateProfile
     */
    bio: string
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
     * category
     * @type string
     * @memberof DefaultApiupload
     */
    category: string
    /**
     * 
     * @type Array&lt;HttpFile&gt;
     * @memberof DefaultApiupload
     */
    filename?: Array<HttpFile>
}

export interface DefaultApiUpvoteRequest {
    /**
     * comment ID
     * @type number
     * @memberof DefaultApiupvote
     */
    id: number
    /**
     * upvote score
     * @type number
     * @memberof DefaultApiupvote
     */
    score: number
}

export interface DefaultApiUpvoteVideoRequest {
    /**
     * video ID
     * @type number
     * @memberof DefaultApiupvoteVideo
     */
    id: number
    /**
     * upvote score
     * @type number
     * @memberof DefaultApiupvoteVideo
     */
    score: number
}

export interface DefaultApiUsersRequest {
    /**
     * user ID
     * @type number
     * @memberof DefaultApiusers
     */
    id: number
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
    sortCategory?: string
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
    /**
     * page number
     * @type number
     * @memberof DefaultApivideos
     */
    pageNumber?: number
    /**
     * category
     * @type string
     * @memberof DefaultApivideos
     */
    category?: string
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
        return this.api.comment(param.parent, param.content, param.videoIDf,  options).toPromise();
    }

    /**
     * Get comments for video ID
     * @param param the request object
     */
    public comments(param: DefaultApiCommentsRequest, options?: Configuration): Promise<Array<Comments200ResponseInner>> {
        return this.api.comments(param.id,  options).toPromise();
    }

    /**
     * Create new danmaku
     * @param param the request object
     */
    public createDanmaku(param: DefaultApiCreateDanmakuRequest, options?: Configuration): Promise<void> {
        return this.api.createDanmaku(param.videoID, param.timestamp, param.message, param.type, param.color, param.fontSize,  options).toPromise();
    }

    /**
     * Delete a comment
     * @param param the request object
     */
    public deleteComment(param: DefaultApiDeleteCommentRequest, options?: Configuration): Promise<void> {
        return this.api.deleteComment(param.id,  options).toPromise();
    }

    /**
     * Upvote a video
     * @param param the request object
     */
    public follow(param: DefaultApiFollowRequest, options?: Configuration): Promise<void> {
        return this.api.follow(param.id,  options).toPromise();
    }

    /**
     * Upvote a video
     * @param param the request object
     */
    public followFeed(param: DefaultApiFollowFeedRequest = {}, options?: Configuration): Promise<Array<Videos200ResponseVideosInner>> {
        return this.api.followFeed( options).toPromise();
    }

    /**
     * Get danmaku for video
     * @param param the request object
     */
    public getDanmaku(param: DefaultApiGetDanmakuRequest, options?: Configuration): Promise<Array<GetDanmaku200ResponseInner>> {
        return this.api.getDanmaku(param.id,  options).toPromise();
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
     * Get list of videos
     * @param param the request object
     */
    public recommendations(param: DefaultApiRecommendationsRequest, options?: Configuration): Promise<Array<Videos200ResponseVideosInner>> {
        return this.api.recommendations(param.id,  options).toPromise();
    }

    /**
     * Register user
     * @param param the request object
     */
    public register(param: DefaultApiRegisterRequest, options?: Configuration): Promise<void> {
        return this.api.register(param.username, param.password, param.email,  options).toPromise();
    }

    /**
     * Reset password
     * @param param the request object
     */
    public resetPassword(param: DefaultApiResetPasswordRequest, options?: Configuration): Promise<void> {
        return this.api.resetPassword(param.oldpassword, param.newpassword,  options).toPromise();
    }

    /**
     * Update user\'s profile
     * @param param the request object
     */
    public updateProfile(param: DefaultApiUpdateProfileRequest, options?: Configuration): Promise<void> {
        return this.api.updateProfile(param.username, param.gender, param.birthdate, param.bio,  options).toPromise();
    }

    /**
     * Upload a new video
     * @param param the request object
     */
    public upload(param: DefaultApiUploadRequest, options?: Configuration): Promise<void> {
        return this.api.upload(param.tags, param.title, param.description, param.category, param.filename,  options).toPromise();
    }

    /**
     * Get user video data
     * @param param the request object
     */
    public upvote(param: DefaultApiUpvoteRequest, options?: Configuration): Promise<void> {
        return this.api.upvote(param.id, param.score,  options).toPromise();
    }

    /**
     * Upvote a video
     * @param param the request object
     */
    public upvoteVideo(param: DefaultApiUpvoteVideoRequest, options?: Configuration): Promise<void> {
        return this.api.upvoteVideo(param.id, param.score,  options).toPromise();
    }

    /**
     * Get user video data
     * @param param the request object
     */
    public users(param: DefaultApiUsersRequest, options?: Configuration): Promise<Users200Response> {
        return this.api.users(param.id,  options).toPromise();
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
        return this.api.videos(param.search, param.sortCategory, param.order, param.unapproved, param.pageNumber, param.category,  options).toPromise();
    }

}
