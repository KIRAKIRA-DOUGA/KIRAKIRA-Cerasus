import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration} from '../configuration'
import { Observable, of, from } from '../rxjsStub';
import {mergeMap, map} from  '../rxjsStub';
import { Comments200ResponseInner } from '../models/Comments200ResponseInner';
import { GetDanmaku200ResponseInner } from '../models/GetDanmaku200ResponseInner';
import { Users200Response } from '../models/Users200Response';
import { VideoDetail200Response } from '../models/VideoDetail200Response';
import { Videos200Response } from '../models/Videos200Response';
import { Videos200ResponseCategoriesInner } from '../models/Videos200ResponseCategoriesInner';
import { Videos200ResponsePaginationData } from '../models/Videos200ResponsePaginationData';
import { Videos200ResponseVideosInner } from '../models/Videos200ResponseVideosInner';

import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";
export class ObservableDefaultApi {
    private requestFactory: DefaultApiRequestFactory;
    private responseProcessor: DefaultApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: DefaultApiRequestFactory,
        responseProcessor?: DefaultApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new DefaultApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new DefaultApiResponseProcessor();
    }

    /**
     * Comment on a video
     * @param parent parent comment ID
     * @param content comment message
     * @param videoID comment\&#39;s video ID
     */
    public commentWithHttpInfo(parent: number, content: string, videoID: number, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.comment(parent, content, videoID, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.commentWithHttpInfo(rsp)));
            }));
    }

    /**
     * Comment on a video
     * @param parent parent comment ID
     * @param content comment message
     * @param videoID comment\&#39;s video ID
     */
    public comment(parent: number, content: string, videoID: number, _options?: Configuration): Observable<void> {
        return this.commentWithHttpInfo(parent, content, videoID, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Get comments for video ID
     * @param id video ID
     */
    public commentsWithHttpInfo(id: number, _options?: Configuration): Observable<HttpInfo<Array<Comments200ResponseInner>>> {
        const requestContextPromise = this.requestFactory.comments(id, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.commentsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get comments for video ID
     * @param id video ID
     */
    public comments(id: number, _options?: Configuration): Observable<Array<Comments200ResponseInner>> {
        return this.commentsWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<Array<Comments200ResponseInner>>) => apiResponse.data));
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
    public createDanmakuWithHttpInfo(videoID: number, timestamp: string, message: string, type: string, color: string, fontSize: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.createDanmaku(videoID, timestamp, message, type, color, fontSize, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.createDanmakuWithHttpInfo(rsp)));
            }));
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
    public createDanmaku(videoID: number, timestamp: string, message: string, type: string, color: string, fontSize: string, _options?: Configuration): Observable<void> {
        return this.createDanmakuWithHttpInfo(videoID, timestamp, message, type, color, fontSize, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Delete a comment
     * @param id comment ID
     */
    public deleteCommentWithHttpInfo(id: number, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.deleteComment(id, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteCommentWithHttpInfo(rsp)));
            }));
    }

    /**
     * Delete a comment
     * @param id comment ID
     */
    public deleteComment(id: number, _options?: Configuration): Observable<void> {
        return this.deleteCommentWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Create new email validation
     * @param email email
     */
    public emailValidationWithHttpInfo(email: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.emailValidation(email, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.emailValidationWithHttpInfo(rsp)));
            }));
    }

    /**
     * Create new email validation
     * @param email email
     */
    public emailValidation(email: string, _options?: Configuration): Observable<void> {
        return this.emailValidationWithHttpInfo(email, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Upvote a video
     * @param id user ID
     */
    public followWithHttpInfo(id: number, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.follow(id, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.followWithHttpInfo(rsp)));
            }));
    }

    /**
     * Upvote a video
     * @param id user ID
     */
    public follow(id: number, _options?: Configuration): Observable<void> {
        return this.followWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Upvote a video
     */
    public followFeedWithHttpInfo(_options?: Configuration): Observable<HttpInfo<Array<Videos200ResponseVideosInner>>> {
        const requestContextPromise = this.requestFactory.followFeed(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.followFeedWithHttpInfo(rsp)));
            }));
    }

    /**
     * Upvote a video
     */
    public followFeed(_options?: Configuration): Observable<Array<Videos200ResponseVideosInner>> {
        return this.followFeedWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<Array<Videos200ResponseVideosInner>>) => apiResponse.data));
    }

    /**
     * Get danmaku for video
     * @param id video ID
     */
    public getDanmakuWithHttpInfo(id: number, _options?: Configuration): Observable<HttpInfo<Array<GetDanmaku200ResponseInner>>> {
        const requestContextPromise = this.requestFactory.getDanmaku(id, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getDanmakuWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get danmaku for video
     * @param id video ID
     */
    public getDanmaku(id: number, _options?: Configuration): Observable<Array<GetDanmaku200ResponseInner>> {
        return this.getDanmakuWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<Array<GetDanmaku200ResponseInner>>) => apiResponse.data));
    }

    /**
     * Log the user in
     * @param username search string
     * @param password sort category
     */
    public loginWithHttpInfo(username: string, password: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.login(username, password, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.loginWithHttpInfo(rsp)));
            }));
    }

    /**
     * Log the user in
     * @param username search string
     * @param password sort category
     */
    public login(username: string, password: string, _options?: Configuration): Observable<void> {
        return this.loginWithHttpInfo(username, password, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Log user out
     */
    public logoutWithHttpInfo(_options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.logout(_options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.logoutWithHttpInfo(rsp)));
            }));
    }

    /**
     * Log user out
     */
    public logout(_options?: Configuration): Observable<void> {
        return this.logoutWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Get list of videos
     * @param id video ID
     */
    public recommendationsWithHttpInfo(id: number, _options?: Configuration): Observable<HttpInfo<Array<Videos200ResponseVideosInner>>> {
        const requestContextPromise = this.requestFactory.recommendations(id, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.recommendationsWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get list of videos
     * @param id video ID
     */
    public recommendations(id: number, _options?: Configuration): Observable<Array<Videos200ResponseVideosInner>> {
        return this.recommendationsWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<Array<Videos200ResponseVideosInner>>) => apiResponse.data));
    }

    /**
     * Register user
     * @param username username to register
     * @param password sort category
     * @param email sort category
     * @param verificationCode verification code
     */
    public registerWithHttpInfo(username: string, password: string, email: string, verificationCode: number, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.register(username, password, email, verificationCode, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.registerWithHttpInfo(rsp)));
            }));
    }

    /**
     * Register user
     * @param username username to register
     * @param password sort category
     * @param email sort category
     * @param verificationCode verification code
     */
    public register(username: string, password: string, email: string, verificationCode: number, _options?: Configuration): Observable<void> {
        return this.registerWithHttpInfo(username, password, email, verificationCode, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Reset password
     * @param oldpassword old password
     * @param newpassword new password
     */
    public resetPasswordWithHttpInfo(oldpassword: string, newpassword: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.resetPassword(oldpassword, newpassword, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.resetPasswordWithHttpInfo(rsp)));
            }));
    }

    /**
     * Reset password
     * @param oldpassword old password
     * @param newpassword new password
     */
    public resetPassword(oldpassword: string, newpassword: string, _options?: Configuration): Observable<void> {
        return this.resetPasswordWithHttpInfo(oldpassword, newpassword, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Update user\'s profile
     * @param username new username
     * @param gender new gender
     * @param birthdate new birthdate
     * @param bio new bio
     */
    public updateProfileWithHttpInfo(username: string, gender: string, birthdate: string, bio: string, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.updateProfile(username, gender, birthdate, bio, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.updateProfileWithHttpInfo(rsp)));
            }));
    }

    /**
     * Update user\'s profile
     * @param username new username
     * @param gender new gender
     * @param birthdate new birthdate
     * @param bio new bio
     */
    public updateProfile(username: string, gender: string, birthdate: string, bio: string, _options?: Configuration): Observable<void> {
        return this.updateProfileWithHttpInfo(username, gender, birthdate, bio, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Upload a new video
     * @param tags list of video tags
     * @param title video title
     * @param description video description
     * @param category category
     * @param filename 
     */
    public uploadWithHttpInfo(tags: Array<string>, title: string, description: string, category: string, filename?: Array<HttpFile>, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.upload(tags, title, description, category, filename, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.uploadWithHttpInfo(rsp)));
            }));
    }

    /**
     * Upload a new video
     * @param tags list of video tags
     * @param title video title
     * @param description video description
     * @param category category
     * @param filename 
     */
    public upload(tags: Array<string>, title: string, description: string, category: string, filename?: Array<HttpFile>, _options?: Configuration): Observable<void> {
        return this.uploadWithHttpInfo(tags, title, description, category, filename, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Get user video data
     * @param id comment ID
     * @param score upvote score
     */
    public upvoteWithHttpInfo(id: number, score: number, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.upvote(id, score, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.upvoteWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get user video data
     * @param id comment ID
     * @param score upvote score
     */
    public upvote(id: number, score: number, _options?: Configuration): Observable<void> {
        return this.upvoteWithHttpInfo(id, score, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Upvote a video
     * @param id video ID
     * @param score upvote score
     */
    public upvoteVideoWithHttpInfo(id: number, score: number, _options?: Configuration): Observable<HttpInfo<void>> {
        const requestContextPromise = this.requestFactory.upvoteVideo(id, score, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.upvoteVideoWithHttpInfo(rsp)));
            }));
    }

    /**
     * Upvote a video
     * @param id video ID
     * @param score upvote score
     */
    public upvoteVideo(id: number, score: number, _options?: Configuration): Observable<void> {
        return this.upvoteVideoWithHttpInfo(id, score, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Get user video data
     * @param id user ID
     */
    public usersWithHttpInfo(id: number, _options?: Configuration): Observable<HttpInfo<Users200Response>> {
        const requestContextPromise = this.requestFactory.users(id, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.usersWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get user video data
     * @param id user ID
     */
    public users(id: number, _options?: Configuration): Observable<Users200Response> {
        return this.usersWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<Users200Response>) => apiResponse.data));
    }

    /**
     * Get list of videos
     * @param id video ID
     */
    public videoDetailWithHttpInfo(id: number, _options?: Configuration): Observable<HttpInfo<VideoDetail200Response>> {
        const requestContextPromise = this.requestFactory.videoDetail(id, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.videoDetailWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get list of videos
     * @param id video ID
     */
    public videoDetail(id: number, _options?: Configuration): Observable<VideoDetail200Response> {
        return this.videoDetailWithHttpInfo(id, _options).pipe(map((apiResponse: HttpInfo<VideoDetail200Response>) => apiResponse.data));
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
    public videosWithHttpInfo(search?: string, sortCategory?: string, order?: string, unapproved?: string, pageNumber?: number, category?: string, _options?: Configuration): Observable<HttpInfo<Videos200Response>> {
        const requestContextPromise = this.requestFactory.videos(search, sortCategory, order, unapproved, pageNumber, category, _options);

        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (let middleware of this.configuration.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => this.configuration.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (let middleware of this.configuration.middleware) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.videosWithHttpInfo(rsp)));
            }));
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
    public videos(search?: string, sortCategory?: string, order?: string, unapproved?: string, pageNumber?: number, category?: string, _options?: Configuration): Observable<Videos200Response> {
        return this.videosWithHttpInfo(search, sortCategory, order, unapproved, pageNumber, category, _options).pipe(map((apiResponse: HttpInfo<Videos200Response>) => apiResponse.data));
    }

}
