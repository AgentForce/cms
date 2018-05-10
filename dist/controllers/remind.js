"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("express-validator");
// Customize
const api_1 = require("../services/api");
const handler_1 = require("../services/handler");
/**
 * GET /login
 * Login page.
 */
exports.getIndex = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        let countpage;
        countpage = 0;
        // console.log(req.params);
        const api = new api_1.BaseApi();
        if (req.params.page < 0)
            req.params.page = 0;
        const size = 30;
        // req.params.page = 1;
        // req.params.size = 5;
        let res_api;
        res_api = yield api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/remind/" + req.params.page + "/" + size);
        if (res_api.total > 0) {
            countpage = res_api.total / size;
        }
        else {
            res_api.total = 0;
            res_api.data = [];
        }
        let res_api_full;
        res_api_full = yield api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/remind/0/10000000");
        res.render("remind", {
            title: "Remind",
            users: res_api.data,
            usersCom: JSON.stringify(res_api_full.data),
            page: req.params.page - 0,
            countpage: countpage,
            total: res_api.total
        });
    }
    catch (error) {
        const handler = new handler_1.HandlerApi();
        handler.handlerError(error);
    }
});
//# sourceMappingURL=remind.js.map