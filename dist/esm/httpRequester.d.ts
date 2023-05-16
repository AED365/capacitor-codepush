import { Verb, Requester, Response } from "./http";
import type { Callback } from "./callbackUtil";
/**
 * XMLHttpRequest-based implementation of Http.Requester.
 */
export declare class HttpRequester implements Requester {
    private contentType;
    constructor(contentType?: string | undefined);
    request(verb: Verb, url: string, callbackOrRequestBody: Callback<Response> | string, callback?: Callback<Response>): void;
    /**
     * Gets the HTTP method name as a string.
     * The reason for which this is needed is because the Http.Verb enum corresponds to integer values from native runtime.
     */
    private getHttpMethodName;
}
