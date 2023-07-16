import { ResponseContext, RequestContext, HttpFile } from '../http/http';
import { Configuration} from '../configuration'

import { Comments200ResponseInner } from '../models/Comments200ResponseInner';
import { VideoDetail200Response } from '../models/VideoDetail200Response';
import { Videos200Response } from '../models/Videos200Response';
import { Videos200ResponsePaginationData } from '../models/Videos200ResponsePaginationData';
import { Videos200ResponseVideosInner } from '../models/Videos200ResponseVideosInner';
import { ObservableDefaultApi } from './ObservableAPI';

import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";
export class PromiseDefaultApi {
    private api: ObservableDefaultApi

    public constructor(
        configuration: Configuration,
        requestFactory?: DefaultApiRequestFactory,
        responseProcessor?: DefaultApiResponseProcessor
    ) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Comment on a video
     * @param parent parent comment ID
     * @param content comment message
     * @param videoID comment\&#39;s video ID
     */
    public comment(parent: number, content: string, videoID: number, _options?: Configuration): Promise<void> {
        const result = this.api.comment(parent, content, videoID, _options);
        return result.toPromise();
    }

    /**
     * Get comments for video ID
     * @param id video ID
     */
    public comments(id: number, _options?: Configuration): Promise<Array<Comments200ResponseInner>> {
        const result = this.api.comments(id, _options);
        return result.toPromise();
    }

    /**
     * Log the user in
     * @param username search string
     * @param password sort category
     */
    public login(username: string, password: string, _options?: Configuration): Promise<void> {
        const result = this.api.login(username, password, _options);
        return result.toPromise();
    }

    /**
     * Log user out
     */
    public logout(_options?: Configuration): Promise<void> {
        const result = this.api.logout(_options);
        return result.toPromise();
    }

    /**
     * Register user
     * @param username username to register
     * @param password sort category
     * @param email sort category
     */
    public register(username: string, password: string, email: string, _options?: Configuration): Promise<void> {
        const result = this.api.register(username, password, email, _options);
        return result.toPromise();
    }

    /**
     * Upload a new video
     * @param tags list of video tags
     * @param title video title
     * @param description video description
     * @param filename 
     */
    public upload(tags: Array<string>, title: string, description: string, filename?: Array<HttpFile>, _options?: Configuration): Promise<void> {
        const result = this.api.upload(tags, title, description, filename, _options);
        return result.toPromise();
    }

    /**
     * Get user video data
     * @param id user ID
     */
    public users(id: number, _options?: Configuration): Promise<Videos200Response> {
        const result = this.api.users(id, _options);
        return result.toPromise();
    }

    /**
     * Get list of videos
     * @param id video ID
     */
    public videoDetail(id: number, _options?: Configuration): Promise<VideoDetail200Response> {
        const result = this.api.videoDetail(id, _options);
        return result.toPromise();
    }

    /**
     * Get list of videos
     * @param search search string
     * @param category sort category
     * @param order sort category
     * @param unapproved sort category
     * @param pageNumber page number
     */
    public videos(search?: string, category?: string, order?: string, unapproved?: string, pageNumber?: number, _options?: Configuration): Promise<Videos200Response> {
        const result = this.api.videos(search, category, order, unapproved, pageNumber, _options);
        return result.toPromise();
    }


}



