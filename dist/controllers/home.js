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
/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const api = new api_1.BaseApi();
    let res_api;
    res_api = yield api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/dashboard/0");
    console.log(res_api);
    res.render("home", {
        title: "Home",
        users: JSON.stringify(res_api.resQ),
        "countSum": res_api.countSum,
        "countSumActive": res_api.countSumActive,
        "countSumDeActive": res_api.countSum - res_api.countSumActive,
        "countMonth": res_api.countMonth,
        "countActiveMonth": res_api.countActiveMonth,
        "countDeActiveMonth": res_api.countMonth - res_api.countActiveMonth
    });
});
exports.currentdev = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const api = new api_1.BaseApi();
    let res_api;
    res_api = yield api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/reportto/" + req.params.id);
    res.json(res_api);
});
//# sourceMappingURL=home.js.map