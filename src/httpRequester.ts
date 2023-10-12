import { Verb, Requester, Response } from "./http";
import type { Callback } from "./callbackUtil";
import type { HTTPResponse as HttpResponse } from "@ionic-native/http";
import { HTTP as NativeHttp } from "@ionic-native/http";
import { HttpOptions } from "@capacitor/core";

/**
 * XMLHttpRequest-based implementation of Http.Requester.
 */
export class HttpRequester implements Requester {
    private contentType: string | undefined;

    constructor(contentType?: string | undefined) {
        this.contentType = contentType;
    }

    public request(verb: Verb, url: string, callbackOrRequestBody: Callback<Response> | string, callback?: Callback<Response>): void {
        var requestBody: any;
        var requestCallback: Callback<Response> = callback!;

        // request(verb, url, callback)
        if (!requestCallback && typeof callbackOrRequestBody === "function") {
            requestCallback = <Callback<Response>>callbackOrRequestBody;
        }

        // request(verb, url, requestBody, callback)
        if (typeof callbackOrRequestBody === "string") {
            requestBody = <string>callbackOrRequestBody;
        }

        if (typeof requestBody === "string") {
            try {
                requestBody = JSON.parse(requestBody); // if it is stringify JSON string, parse
            } catch (e) {
                // do nothing
            }
        }

        var methodName = this.getHttpMethodName(verb);
        if (methodName === null) {
            return requestCallback(new Error("Method Not Allowed"), undefined);
        }

        const headers: { [key: string]: string } = {
            "X-CodePush-Plugin-Name": "cordova-plugin-code-push",
            "X-CodePush-Plugin-Version": "1.11.13",
            "X-CodePush-SDK-Version": "3.1.5"
        };
        if (this.contentType) {
            headers["Content-Type"] = this.contentType;
        }
        /*let options = {};
        if (methodName === "GET") {
            options = requestBody;
        } else {
            options = requestBody;
        }*/
        NativeHttp.get(url, null, headers).then((nativeRes: HttpResponse) => {
            if (typeof nativeRes.data === "object") nativeRes.data = JSON.stringify(nativeRes.data);
            var response: Response = { statusCode: nativeRes.status, body: nativeRes.data };
            requestCallback && requestCallback(null, response);
        });
    }

    /**
     * Gets the HTTP method name as a string.
     * The reason for which this is needed is because the Http.Verb enum corresponds to integer values from native runtime.
     */
    private getHttpMethodName(verb: Verb): string | null {
        switch (verb) {
            case Verb.GET:
                return "GET";
            case Verb.DELETE:
                return "DELETE";
            case Verb.HEAD:
                return "HEAD";
            case Verb.PATCH:
                return "PATCH";
            case Verb.POST:
                return "POST";
            case Verb.PUT:
                return "PUT";
            case Verb.TRACE:
            case Verb.OPTIONS:
            case Verb.CONNECT:
            default:
                return null;
        }
    }
}
