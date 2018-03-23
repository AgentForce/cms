"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client = require("node-rest-client").Client;
// import * as Configs from "../configurations/index";
const lodash = require("lodash");
// const uncompress = require('compress-buffer').uncompress;
const StringDecoder = require("string_decoder").StringDecoder;
/**
 * Constructor
 *
 * @class BaseApi
 */
class HandlerApi {
    /**
     * Constructor
     *
     * @class BaseApi
     * @constructor
     */
    constructor() {
        // initialize variables
    }
    /**
     * Add a JS external file to the request.
     *
     * @class BaseApi
     * @method apiPost
     * @param src {string} The src to the external JS file.
     * @return {BaseApi} Self for chaining
     */
    handlerError(error) {
        console.log("========");
        console.log(error);
        /*return new Promise(function (fulfill, reject) {
            // request and response additional configuration

            const serverConfigs: any = "Configs.getServerConfigs()";
            const options = {
                connection: {
                    rejectUnauthorized: false,
                    headers: {
                        "Content-Type": "application/json"
                    }
                },
                requestConfig: {
                    timeout: 60000,
                    noDelay: true,
                    keepAlive: true,
                    keepAliveDelay: 1000
                },
                responseConfig: {
                    timeout: 300000
                }
            };
            const client = new Client(options);
            // Data test
            // request and response additional configuration

            const args = {
                headers: {
                    "Authorization": "Bearer " ,
                    "Accept": "application/json",
                },
                data: {},
                requestConfig: {
                    timeout: 10000, // request timeout in milliseconds
                    noDelay: true, // Enable/disable the Nagle algorithm
                    keepAlive: true, // Enable/disable keep-alive functionalityidle socket.
                    keepAliveDelay: 1000 // and optionally set the initial delay before the first keepalive probe is sent
                },
                responseConfig: {
                    timeout: 1000 // response timeout
                }
            };
            // const req = client.get(serverConfigs.apiOauth + 'api/uaa/oauth/check_token?token=' + token, args, function (data: any, response: any) {

            const req = client.get("api_name", args, function (data: any, response: any) {
                fulfill(data);
            });

            req.on("requestTimeout", function (req: any) {
                console.log(" - request has expired :");
                reject(" - request has expired :");
                req.abort();
            });

            req.on("responseTimeout", function (res: any) {
                console.log(" - response has expired :");
                reject(" - response has expired :");
            });

            // it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts
            req.on("error", function (err: any) {
                // Xóa data tenant
                console.log(err);
                reject(err + " - ");

            });


        });*/
    }
}
exports.HandlerApi = HandlerApi;
//# sourceMappingURL=handler.js.map