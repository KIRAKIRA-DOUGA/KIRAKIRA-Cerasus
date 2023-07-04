# .DefaultApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**login**](DefaultApi.md#login) | **POST** /login | Log the user in
[**logout**](DefaultApi.md#logout) | **GET** /logout | Log user out
[**register**](DefaultApi.md#register) | **POST** /register | Register user
[**upload**](DefaultApi.md#upload) | **POST** /upload | Upload a new video
[**videos**](DefaultApi.md#videos) | **GET** /videos | Get list of videos


# **login**
> void login()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiLoginRequest = {
  // string | search string
  username: "username_example",
  // string | sort category
  password: "password_example",
};

apiInstance.login(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **username** | [**string**] | search string | defaults to undefined
 **password** | [**string**] | sort category | defaults to undefined


### Return type

**void**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Login success |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **logout**
> void logout()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:any = {};

apiInstance.logout(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters
This endpoint does not need any parameter.


### Return type

**void**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Logout successful |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **register**
> void register()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiRegisterRequest = {
  // string | search string
  username: "username_example",
  // string | sort category
  password: "password_example",
  // string | sort category
  email: "email_example",
};

apiInstance.register(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **username** | [**string**] | search string | defaults to undefined
 **password** | [**string**] | sort category | defaults to undefined
 **email** | [**string**] | sort category | defaults to undefined


### Return type

**void**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | registration succeeded |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **upload**
> void upload()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiUploadRequest = {
  // Array<string> | list of video tags
  tags: [
    "tags_example",
  ],
  // string | video title
  title: "title_example",
  // string | video description
  description: "description_example",
  // Array<HttpFile> (optional)
  filename: [
    { data: Buffer.from(fs.readFileSync('/path/to/file', 'utf-8')), name: '/path/to/file' },
  ],
};

apiInstance.upload(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **tags** | **Array&lt;string&gt;** | list of video tags | defaults to undefined
 **title** | [**string**] | video title | defaults to undefined
 **description** | [**string**] | video description | defaults to undefined
 **filename** | **Array&lt;HttpFile&gt;** |  | (optional) defaults to undefined


### Return type

**void**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Logout successful |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **videos**
> Videos200Response videos()


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiVideosRequest = {
  // string | search string (optional)
  search: "search_example",
  // string | sort category (optional)
  category: "category_example",
  // string | sort category (optional)
  order: "order_example",
  // string | sort category (optional)
  unapproved: "unapproved_example",
};

apiInstance.videos(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **search** | [**string**] | search string | (optional) defaults to undefined
 **category** | [**string**] | sort category | (optional) defaults to undefined
 **order** | [**string**] | sort category | (optional) defaults to undefined
 **unapproved** | [**string**] | sort category | (optional) defaults to undefined


### Return type

**Videos200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | list of videos and pagination data |  -  |
**0** | Unexpected error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


