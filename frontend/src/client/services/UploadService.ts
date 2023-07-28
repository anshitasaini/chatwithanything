/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_upload_create_upload_file } from '../models/Body_upload_create_upload_file';
import type { RepoUploadOutSchema } from '../models/RepoUploadOutSchema';
import type { UploadOutSchema } from '../models/UploadOutSchema';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UploadService {

    /**
     * Create Upload File
     * @param formData
     * @returns UploadOutSchema Successful Response
     * @throws ApiError
     */
    public static createUploadFile(
        formData: Body_upload_create_upload_file,
    ): CancelablePromise<UploadOutSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/uploadfile/',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Upload Code
     * @param repoUrl
     * @returns RepoUploadOutSchema Successful Response
     * @throws ApiError
     */
    public static uploadCode(
        repoUrl: string,
    ): CancelablePromise<RepoUploadOutSchema> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/uploadcode/',
            query: {
                'repo_url': repoUrl,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
