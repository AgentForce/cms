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
// Customize
const api_1 = require("../services/api");
const handler_1 = require("../services/handler");
/**
 * GET /role
 * Contact form page.
 */
exports.getRole = (req, res) => __awaiter(this, void 0, void 0, function* () {
    // tslint:disable-next-line:no-trailing-whitespace
    try {
        let countpage;
        countpage = 0;
        const api = new api_1.BaseApi();
        if (req.params.page < 0)
            req.params.page = 0;
        const size = 8;
        // req.params.page = 1;
        // req.params.size = 5;
        let res_api;
        res_api = yield api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/roles/" + req.params.page + "/" + size);
        if (res_api.total > 0) {
            countpage = res_api.total / size;
        }
        else {
            res_api.total = 0;
            res_api.data = [];
        }
        // console.log("======");
        // console.log(res_api.data);
        res.render("role", {
            title: "Role Management",
            roles: res_api.data,
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
/**
 * POST /role
 * Send a role form via Nodemailer.
 */
exports.postRole = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        req.assert("name", "Name is not valid").notEmpty();
        req.assert("role", "Role is not valid").notEmpty();
        req.assert("resource", "Resource is not valid").notEmpty();
        const datapost = req.body;
        datapost.is_default = true;
        const errors = req.validationErrors();
        console.log(errors);
        if (errors) {
            req.flash("errors", errors);
            return res.redirect("/user/add");
        }
        // Call API add
        const api = new api_1.BaseApi();
        const res_api = yield api.apiPostJson("token", process.env.DATA_OAUTH_URI + "api/roles", datapost);
        console.log(res_api);
        /*res.render("account/signup", {
          title: "Create Account",
          arrResource: [],
          arrScope: []
        });*/
        return res.redirect("/role/1");
    }
    catch (error) {
        const handler = new handler_1.HandlerApi();
        handler.handlerError(error);
    }
});
//# sourceMappingURL=role.1.js.map