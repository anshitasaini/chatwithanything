/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CodeService {

    /**
     * Get File
     * @param fileRequestUrl
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getFile(
        fileRequestUrl: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/code/',
            query: {
                'file_request_url': fileRequestUrl,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
