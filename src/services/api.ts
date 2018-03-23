const Client = require("node-rest-client").Client;
import * as Promise from "bluebird";
// import * as Configs from "../configurations/index";
const lodash = require("lodash");
// const uncompress = require('compress-buffer').uncompress;
const StringDecoder = require("string_decoder").StringDecoder;


/**
 * Constructor
 *
 * @class BaseApi
 */
export class BaseApi {

    public authConfigs: any;
    public serverConfigs: any;


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
    public apiGet(token: string, api_name: string) {
        return new Promise(function (fulfill, reject) {
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
                    "Authorization": "Bearer " + token,
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
            const req = client.get(api_name, args, function (data: any, response: any) {
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


        });
    }

    public apiPost(token: string, api_name: string, datapost: any) {
        console.log("kkkkk");
        //  const res_api = api.apiPost(token, 'https://dcmwdevtest01.easycredit.vn', datapost.Password, datapost);
        return new Promise(function (fulfill, reject) {
            const basicOauth = new Buffer(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRECT).toString("base64");
            const client = new Client();
            // Data test
            // request and response additional configuration

            const args = {
                headers: {
                    "Authorization": "Basic " + basicOauth,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: datapost,
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
            const req = client.post(api_name, args, function (data: Object, response: any) {                // parsed response body as js object
                if (response.statusCode >= 200 && response.statusCode < 300)
                    fulfill(data);
                else {
                    console.log("+++++");
                    const decoder = new StringDecoder("utf8");
                    reject("Server response statusCode: " + response.statusCode + " Data : " + decoder.write(data));
                }

            });

            req.on("requestTimeout", function (req: any) {
                reject(" - request has expired :");
                req.abort();
            });

            req.on("responseTimeout", function (res: any) {
                reject(" - response has expired :");
            });

            // it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts
            req.on("error", function (err: any) {
                // console.log("error");
                // console.log(err);
                // Xóa data tenant
                console.log(err);
                reject(err);

            });


        });
    }

    public apiPatchJson(token: string, api_name: string, datapost: any) {
        return new Promise(function (fulfill, reject) {
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
                    "Authorization": "Bearer " + token,
                    "Accept": "application/json",
                },
                data: JSON.stringify(datapost),
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
            console.log(api_name);
            const req = client.patch(api_name, args, function (data: Object, response: any) {                // parsed response body as js object
                console.log("response=======================");
                console.log(data);
                if (response.statusCode >= 200 && response.statusCode < 300)
                    fulfill(data);
                else {
                    const decoder = new StringDecoder("utf8");
                    reject("Server response statusCode: " + response.statusCode + " Data : " + decoder.write(data));
                }

            });

            req.on("requestTimeout", function (req: any) {
                reject(" - request has expired :");
                req.abort();
            });

            req.on("responseTimeout", function (res: any) {
                reject(" - response has expired :");
            });

            // it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts
            req.on("error", function (err: any) {
                console.log("error");
                // Xóa data tenant
                reject(err);

            });


        });
    }

    public apiPostJson(token: string, api_name: string, datapost: any) {
        return new Promise(function (fulfill, reject) {
            /*console.log("++++");
            console.log((datapostLink));
            console.log("+++444+");
            const datapost = {
                "username": datapostLink.username,
                "phone": datapostLink.phone,
                "fullName": datapostLink.fullName,
                "scope": datapostLink.scope,
                "resource_ids" : datapostLink.resource_ids,
                "address": datapostLink.address,
                "city": datapostLink.city,
                "district": datapostLink.district,
                "gender": datapostLink.gender,
                "birthday": datapostLink.birthday,
                "level": datapostLink.level,
                "expirence": "datapostLink.expirence",
                "email": datapostLink.email,
                "code_level": datapostLink.code_level,
              };
            console.log(datapost);*/
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
                    "Authorization": "Bearer " + token,
                    "Accept": "application/json",
                },
                data: JSON.stringify(datapost),
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
            console.log(api_name);
            const req = client.post(api_name, args, function (data: Object, response: any) {                // parsed response body as js object
                console.log("response=======================");
                console.log(data);
                if (response.statusCode >= 200 && response.statusCode < 300)
                    fulfill(data);
                else {
                    const decoder = new StringDecoder("utf8");
                    reject("Server response statusCode: " + response.statusCode + " Data : " + decoder.write(data));
                }

            });

            req.on("requestTimeout", function (req: any) {
                reject(" - request has expired :");
                req.abort();
            });

            req.on("responseTimeout", function (res: any) {
                reject(" - response has expired :");
            });

            // it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts
            req.on("error", function (err: any) {
                console.log("error");
                // Xóa data tenant
                reject(err);

            });


        });
    }
}
