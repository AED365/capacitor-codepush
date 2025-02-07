import { HTTP as NativeHttp } from "@ionic-native/http";
/**
 * XMLHttpRequest-based implementation of Http.Requester.
 */
export class HttpRequester {
    constructor(contentType) {
        this.contentType = contentType;
    }
    request(verb, url, callbackOrRequestBody, callback) {
        var requestBody;
        var requestCallback = callback;
        // request(verb, url, callback)
        if (!requestCallback && typeof callbackOrRequestBody === "function") {
            requestCallback = callbackOrRequestBody;
        }
        // request(verb, url, requestBody, callback)
        if (typeof callbackOrRequestBody === "string") {
            requestBody = callbackOrRequestBody;
        }
        if (typeof requestBody === "string") {
            try {
                requestBody = JSON.parse(requestBody); // if it is stringify JSON string, parse
            }
            catch (e) {
                // do nothing
            }
        }
        var methodName = this.getHttpMethodName(verb);
        if (methodName === null) {
            return requestCallback(new Error("Method Not Allowed"), undefined);
        }
        const headers = {
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
        NativeHttp.get(url, null, headers).then((nativeRes) => {
            if (typeof nativeRes.data === "object")
                nativeRes.data = JSON.stringify(nativeRes.data);
            var response = { statusCode: nativeRes.status, body: nativeRes.data };
            requestCallback && requestCallback(null, response);
        });
    }
    /**
     * Gets the HTTP method name as a string.
     * The reason for which this is needed is because the Http.Verb enum corresponds to integer values from native runtime.
     */
    getHttpMethodName(verb) {
        switch (verb) {
            case 0 /* Verb.GET */:
                return "GET";
            case 4 /* Verb.DELETE */:
                return "DELETE";
            case 1 /* Verb.HEAD */:
                return "HEAD";
            case 8 /* Verb.PATCH */:
                return "PATCH";
            case 2 /* Verb.POST */:
                return "POST";
            case 3 /* Verb.PUT */:
                return "PUT";
            case 5 /* Verb.TRACE */:
            case 6 /* Verb.OPTIONS */:
            case 7 /* Verb.CONNECT */:
            default:
                return null;
        }
    }
}
//# sourceMappingURL=httpRequester.js.map