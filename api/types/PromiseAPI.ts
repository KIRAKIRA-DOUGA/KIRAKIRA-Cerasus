import { ResponseContext, RequestContext, HttpFile } from '../http/http';
import { Configuration} from '../configuration'

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
     * @param username search string
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
     * Get list of videos
     * @param search search string
     * @param category sort category
     * @param order sort category
     * @param unapproved sort category
     */
    public videos(search?: string, category?: string, order?: string, unapproved?: string, _options?: Configuration): Promise<Videos200Response> {
        const result = this.api.videos(search, category, order, unapproved, _options);
        return result.toPromise();
    }


}



