"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client = require("node-rest-client").Client;
const Promise = require("bluebird");
// import * as Configs from "../configurations/index";
const lodash = require("lodash");
// const uncompress = require('compress-buffer').uncompress;
const StringDecoder = require("string_decoder").StringDecoder;
const xlsxtojson = require("xlsx-to-json-lc");
/**
 * Constructor
 *
 * @class BaseApi
 */
class BaseApi {
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
    apiGet(token, api_name) {
        return new Promise(function (fulfill, reject) {
            // request and response additional configuration
            const serverConfigs = "Configs.getServerConfigs()";
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
                    keepAliveDelay: 5000
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
                    timeout: 10000,
                    noDelay: true,
                    keepAlive: true,
                    keepAliveDelay: 1000 // and optionally set the initial delay before the first keepalive probe is sent
                },
                responseConfig: {
                    timeout: 1000 // response timeout
                }
            };
            // const req = client.get(serverConfigs.apiOauth + 'api/uaa/oauth/check_token?token=' + token, args, function (data: any, response: any) {
            const req = client.get(api_name, args, function (data, response) {
                console.log(api_name);
                console.log(data);
                console.log("API");
                if (response.statusCode >= 200 && response.statusCode < 300)
                    fulfill(data);
                else {
                    console.log("+++++");
                    const decoder = new StringDecoder("utf8");
                    reject("Server response statusCode: " + response.statusCode + " Data : " + decoder.write(data));
                }
            });
            req.on("requestTimeout", function (req) {
                console.log(" - request has expired :");
                reject(" - request has expired :");
                req.abort();
            });
            req.on("responseTimeout", function (res) {
                console.log(" - response has expired :");
                reject(" - response has expired :");
            });
            // it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts
            req.on("error", function (err) {
                // Xóa data tenant
                console.log(err);
                reject(err + " - ");
            });
        });
    }
    apiPost(token, api_name, datapost) {
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
                    timeout: 10000,
                    noDelay: true,
                    keepAlive: true,
                    keepAliveDelay: 5000 // and optionally set the initial delay before the first keepalive probe is sent
                },
                responseConfig: {
                    timeout: 5000 // response timeout
                }
            };
            const req = client.post(api_name, args, function (data, response) {
                if (response.statusCode >= 200 && response.statusCode < 300)
                    fulfill(data);
                else {
                    console.log("+++++");
                    const decoder = new StringDecoder("utf8");
                    reject("Server response statusCode: " + response.statusCode + " Data : " + decoder.write(data));
                }
            });
            req.on("requestTimeout", function (req) {
                reject(" - request has expired :");
                req.abort();
            });
            req.on("responseTimeout", function (res) {
                reject(" - response has expired :");
            });
            // it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts
            req.on("error", function (err) {
                // console.log("error");
                // console.log(err);
                // Xóa data tenant
                console.log(err);
                reject(err);
            });
        });
    }
    apiPatchJson(token, api_name, datapost) {
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
                    keepAliveDelay: 5000
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
                    timeout: 300000,
                    noDelay: true,
                    keepAlive: true,
                    keepAliveDelay: 300000 // and optionally set the initial delay before the first keepalive probe is sent
                },
                responseConfig: {
                    timeout: 300000 // response timeout
                }
            };
            console.log(api_name);
            const req = client.patch(api_name, args, function (data, response) {
                console.log("response=======================");
                console.log(data);
                if (response.statusCode >= 200 && response.statusCode < 300)
                    fulfill(data);
                else {
                    const decoder = new StringDecoder("utf8");
                    reject("Server response statusCode: " + response.statusCode + " Data : " + decoder.write(data));
                }
            });
            req.on("requestTimeout", function (req) {
                reject(" - request has expired :");
                req.abort();
            });
            req.on("responseTimeout", function (res) {
                reject(" - response has expired :");
            });
            // it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts
            req.on("error", function (err) {
                console.log("error");
                // Xóa data tenant
                reject(err);
            });
        });
    }
    apiPutJson(token, api_name, datapost) {
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
                    keepAliveDelay: 5000
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
                    timeout: 10000,
                    noDelay: true,
                    keepAlive: true,
                    keepAliveDelay: 1000 // and optionally set the initial delay before the first keepalive probe is sent
                },
                responseConfig: {
                    timeout: 1000 // response timeout
                }
            };
            const req = client.put(api_name, args, function (data, response) {
                console.log("response=======================");
                console.log(data);
                if (response.statusCode >= 200 && response.statusCode < 300)
                    fulfill(data);
                else {
                    const decoder = new StringDecoder("utf8");
                    reject("Server response statusCode: " + response.statusCode + " Data : " + decoder.write(data));
                }
            });
            req.on("requestTimeout", function (req) {
                reject(" - request has expired :");
                req.abort();
            });
            req.on("responseTimeout", function (res) {
                reject(" - response has expired :");
            });
            // it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts
            req.on("error", function (err) {
                console.log("error");
                // Xóa data tenant
                reject(err);
            });
        });
    }
    getExcelJson(path) {
        return new Promise(function (fulfill, reject) {
            const exceltojson = xlsxtojson;
            exceltojson({
                input: path,
                // tslint:disable-next-line:no-null-keyword
                output: null,
                lowerCaseHeaders: true
            }, function (err, result) {
                if (err) {
                    // return res.json({error_code: 1, err_desc: err, data: ""});
                    console.log(err);
                }
                fulfill(result);
                // res.json({error_code: 0, err_desc: "", data: result});
            });
        });
    }
    apiPostJson(token, api_name, datapost) {
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
                    timeout: 6000000,
                    noDelay: true,
                    keepAlive: true,
                    keepAliveDelay: 6000000
                },
                responseConfig: {
                    timeout: 6000000
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
                    timeout: 6000000,
                    noDelay: true,
                    keepAlive: true,
                    keepAliveDelay: 6000000 // and optionally set the initial delay before the first keepalive probe is sent
                },
                responseConfig: {
                    timeout: 6000000 // response timeout
                }
            };
            console.log(api_name);
            const req = client.post(api_name, args, function (data, response) {
                console.log("response=======================");
                console.log(data);
                if (response.statusCode >= 200 && response.statusCode < 300)
                    fulfill(data);
                else {
                    const decoder = new StringDecoder("utf8");
                    reject("Server response statusCode: " + response.statusCode + " Data : " + decoder.write(data));
                }
            });
            req.on("requestTimeout", function (req) {
                reject(" - request has expired Post JSon:");
                req.abort();
            });
            req.on("responseTimeout", function (res) {
                reject(" - response has expired :");
            });
            // it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts
            req.on("error", function (err) {
                console.log("error");
                // Xóa data tenant
                reject(err);
            });
        });
    }
}
exports.BaseApi = BaseApi;
//# sourceMappingURL=api.js.map