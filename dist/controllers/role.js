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
const lodash = require("lodash");
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
        console.log(req.params);
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
exports.getLinkRole = (req, res) => __awaiter(this, void 0, void 0, function* () {
    // tslint:disable-next-line:no-trailing-whitespace
    try {
        console.log("kanet");
        console.log(req.params);
        const api = new api_1.BaseApi();
        let res_api;
        let res_role;
        res_api = yield api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/permissions");
        res_role = yield api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/roles/obj/" + req.params.id);
        const rolesub = lodash.differenceBy(res_api, res_role.permissions, "scope");
        console.log("==========" + req.params.id);
        console.log(res_role.permissions);
        // api/permissions/obj
        res.render("rolelink", {
            title: "Role Link",
            permissions: rolesub,
            role: res_role.role,
            scopes: res_role.permissions,
            roles: []
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
        const res_api = yield api.apiPostJson(req.user.access_token, process.env.DATA_OAUTH_URI + "api/roles", datapost);
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
exports.postLinkRole = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        req.assert("arrPermission", "Permission is not valid").notEmpty();
        const datapost = req.body.arrPermission;
        // datapost.is_default = true;
        const errors = req.validationErrors();
        console.log(errors);
        if (errors) {
            req.flash("errors", errors);
            return res.redirect("/role/link/" + req.params.idrole);
        }
        console.log(datapost);
        // tslint:disable-next-line:prefer-const
        let data_post = [];
        if (typeof datapost === "string") {
            const arrSplit = datapost.split("||");
            const obj = {
                id: arrSplit[0],
                scope: arrSplit[1],
                name_scope: arrSplit[2],
                role: arrSplit[3],
                name_role: arrSplit[4]
            };
            data_post.push(obj);
        }
        else {
            for (let index = 0; index < datapost.length; index++) {
                const element = datapost[index];
                const arrSplit = element.split("||");
                const obj = {
                    id: arrSplit[0],
                    scope: arrSplit[1],
                    name_scope: arrSplit[2],
                    role: arrSplit[3],
                    name_role: arrSplit[4]
                };
                data_post.push(obj);
            }
        }
        console.log(data_post);
        // Call API add
        const api = new api_1.BaseApi();
        const res_api = yield api.apiPutJson(req.user.access_token, process.env.DATA_OAUTH_URI + "api/roles/link/" + req.params.idrole, data_post);
        console.log(res_api);
        //  id_scope: element.id, name_scope: element.name_scope, scope: element.scope
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
//# sourceMappingURL=role.js.map