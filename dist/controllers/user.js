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
const async = require("async");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const passport = require("passport");
const User_1 = require("../models/User");
const request = require("express-validator");
const _ = require("lodash");
// Customize
const api_1 = require("../services/api");
const handler_1 = require("../services/handler");
/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
    if (req.user) {
        return res.redirect("/");
    }
    /// api/count/tenAgency/:numweekFrom/:numweekTo
    /* const api = new BaseApi();
    const res_api = api.apiGet("req.user.access_token", "http://13.250.129.169:4500/api/count/tenAgency/17/22");
    console.log("vao");
    console.log(res_api);*/
    res.render("account/login", {
        title: "Login"
    });
};
/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
    try {
        req.assert("username", "Username cannot be blank").notEmpty();
        req.assert("username", "Username must be at least 4 and max 50 characters long").len({ min: 4, max: 50 });
        req.assert("password", "Password cannot be blank").notEmpty();
        req.assert("password", "Password must be at least 4 and max 50 characters long").len({ min: 4, max: 50 });
        const errors = req.validationErrors();
        // console.log(errors);
        if (errors) {
            req.flash("errors", errors);
            return res.redirect("/login");
        }
        /*const user = { access_token: "101fa945b5c448a7a12233dcef5ed3e88d940d01",
        token_type: "Bearer",
        expires_in: 35999,
        refresh_token: "89d16f15de893b034788ca8fe589d1dc602dfe25",
        scope: '["leader","camp_post","read"]' };
    
        req.logIn(user, (err) => {
          if (err) { return next(err); }
          req.flash("success", { msg: "Success! You are logged in." });
          res.redirect(req.session.returnTo || "/");
        });*/
        passport.authenticate("local", (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                const errors = [{ location: "body",
                        param: "username",
                        msg: info.message,
                        value: "" }];
                req.flash("errors", errors);
                return res.redirect("/login");
            }
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                req.flash("success", { msg: "Success! You are logged in." });
                res.redirect(req.session.returnTo || "/");
            });
        })(req, res, next);
    }
    catch (error) {
        console.log(error);
        const handler = new handler_1.HandlerApi();
        handler.handlerError(error);
    }
};
/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
    req.logout();
    res.redirect("/");
};
/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res) => __awaiter(this, void 0, void 0, function* () {
    /*if (req.user) {
      return res.redirect("/");
    }*/
    try {
        // Call API get Scope
        const api = new api_1.BaseApi();
        const res_api = yield api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/roles");
        const arrScope = _.groupBy(res_api, "resource");
        const arrResource = (Object.keys(arrScope));
        // console.log(result[abc[0]]);
        let res_api_full;
        res_api_full = yield api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/users/1/2000");
        res.render("account/signup", {
            title: "Create Account",
            arrResource: arrResource,
            arrScope: arrScope,
            usersCom: JSON.stringify(res_api_full.data)
        });
    }
    catch (error) {
        const handler = new handler_1.HandlerApi();
        handler.handlerError(error);
    }
});
exports.addExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        /**/
        // Call API get Scope
        const api = new api_1.BaseApi();
        const res_api = yield api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/roles");
        const arrScope = _.groupBy(res_api, "resource");
        const arrResource = (Object.keys(arrScope));
        // console.log(result[abc[0]]);
        res.render("account/addexcel", {
            title: "Create Account Excel",
            arrUsers: []
        });
    }
    catch (error) {
        const handler = new handler_1.HandlerApi();
        handler.handlerError(error);
    }
});
exports.postAddExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        // console.log(req.file);
        const api = new api_1.BaseApi();
        const resExcel = yield api.getExcelJson(req.file.path);
        const res_api = yield api.apiPostJson(req.user.access_token, process.env.DATA_OAUTH_URI + "api/users/addList", resExcel);
        // console.log(resExcel);
        yield res.render("account/addexcel", {
            title: "Create Account Excel",
            arrUsers: res_api
        });
    }
    catch (error) {
        const handler = new handler_1.HandlerApi();
        handler.handlerError(error);
    }
});
/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        req.assert("email", "Email is not valid").isEmail();
        req.sanitize("email").normalizeEmail({ gmail_remove_dots: false });
        req.assert("username", "Username is not valid").notEmpty();
        req.assert("phone", "Phone is not valid").notEmpty();
        req.assert("fullName", "FullName is not valid").notEmpty();
        req.assert("scope", "Scope is not valid").notEmpty();
        req.assert("resource_ids", "Resource is not valid").notEmpty();
        // req.assert("report_to", "Report To is not valid").notEmpty();
        const datapost = req.body;
        let xl_arr;
        xl_arr = datapost.level.split("-");
        datapost.level = xl_arr[0];
        datapost.code_level = xl_arr[1];
        const errors = req.validationErrors();
        // console.log(errors);
        if (errors) {
            req.flash("errors", errors);
            return res.redirect("/user/add");
        }
        // console.log(typeof(datapost.resource_ids));
        if (typeof datapost.resource_ids !== "string")
            datapost.resource_ids = _.join(req.body.resource_ids, ",");
        if (typeof datapost.scope !== "string")
            datapost.scope = _.join(req.body.scope, ",");
        // console.log("+++++++");
        // console.log(datapost);
        // Call API add
        const api = new api_1.BaseApi();
        const res_api = yield api.apiPostJson(req.user.access_token, process.env.DATA_OAUTH_URI + "api/users/add", datapost);
        // console.log(datapost);
        /*res.render("account/signup", {
          title: "Create Account",
          arrResource: [],
          arrScope: []
        });*/
        return res.redirect("/user/1");
    }
    catch (error) {
        const handler = new handler_1.HandlerApi();
        handler.handlerError(error);
    }
    /*const user = new User({
      email: req.body.email,
      password: req.body.password
    });
  
    User.findOne({ email: req.body.email }, (err, existingUser) => {
      if (err) { return next(err); }
      if (existingUser) {
        req.flash("errors", { msg: "Account with that email address already exists." });
        return res.redirect("/signup");
      }
      user.save((err) => {
        if (err) { return next(err); }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          res.redirect("/");
        });
      });
    });*/
});
/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getUpdateUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        // Call API get Scope
        const api = new api_1.BaseApi();
        let objUser;
        objUser = yield api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/users/getInfo/" + req.params.username);
        res.render("account/edit", {
            title: "Update User",
            objUser: objUser.result
        });
    }
    catch (error) {
        const handler = new handler_1.HandlerApi();
        handler.handlerError(error);
    }
});
exports.postUpdateUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        console.log(req.body);
        // Call API get Scope
        const api = new api_1.BaseApi();
        let objUser;
        objUser = yield api.apiPatchJson(req.user.access_token, process.env.DATA_OAUTH_URI + "api/users/badgeLevel/" + req.params.username, req.body);
        const info = [{
                location: "body",
                param: "id",
                msg: "Updating successfully ",
                value: ""
            },];
        // req.flash("success", info);
        req.flash("success", info);
        return res.redirect("/user/1");
    }
    catch (error) {
        const handler = new handler_1.HandlerApi();
        handler.handlerError(error);
    }
});
/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getChangeStatusUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        // Call API get Scope
        const api = new api_1.BaseApi();
        let res_api;
        if (req.params.status == 1)
            res_api = yield api.apiPatchJson(req.user.access_token, process.env.DATA_OAUTH_URI + "api/users/deactive/" + req.params.username, []);
        else
            res_api = yield api.apiPatchJson(req.user.access_token, process.env.DATA_OAUTH_URI + "api/users/active/" + req.params.username, []);
        // console.log(result[abc[0]]);
        console.log(res_api);
        return res.redirect("/user/1");
    }
    catch (error) {
        const handler = new handler_1.HandlerApi();
        handler.handlerError(error);
    }
});
exports.patchResetPass = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    console.log(req.body);
    try {
        req.assert("username", "Username is not valid").notEmpty();
        const errors = req.validationErrors();
        // console.log(errors);
        if (errors) {
            req.flash("errors", errors);
            return res.redirect("/user/1");
        }
        // const datapost = {phone : req.body.phone};
        // console.log(datapost);
        // Call API add
        const api = new api_1.BaseApi();
        const res_api = yield api.apiPatchJson(req.user.access_token, process.env.DATA_OAUTH_URI + "api/users/resetPass/" + req.body.username, []);
        console.log(res_api);
        return res.redirect("/user/1");
    }
    catch (error) {
        const handler = new handler_1.HandlerApi();
        handler.handlerError(error);
    }
});
exports.postChangeReportToUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    console.log(req.body);
    try {
        req.assert("des", "reportto is not valid").notEmpty();
        req.assert("src", "Username is not valid").notEmpty();
        const errors = req.validationErrors();
        // console.log(errors);
        if (errors) {
            req.flash("errors", errors);
            return res.redirect("/user/1");
        }
        // Call API add
        const api = new api_1.BaseApi();
        const res_api = yield api.apiPatchJson(req.user.access_token, process.env.DATA_OAUTH_URI + "api/users/changeReportTo", req.body);
        // console.log(res_api);
        return res.redirect("/user/1");
    }
    catch (error) {
        const handler = new handler_1.HandlerApi();
        handler.handlerError(error);
    }
});
exports.postUpdatePhone = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    // console.log(req.body);
    try {
        req.assert("phone", "Phone is not valid").notEmpty();
        req.assert("username", "Username is not valid").notEmpty();
        const errors = req.validationErrors();
        // console.log(errors);
        if (errors) {
            req.flash("errors", errors);
            return res.redirect("/user/1");
        }
        const datapost = { phone: req.body.phone };
        // console.log(datapost);
        // Call API add
        const api = new api_1.BaseApi();
        const res_api = yield api.apiPatchJson(req.user.access_token, process.env.DATA_OAUTH_URI + "api/users/updatePhone/" + req.body.username, datapost);
        // console.log(res_api);
        return res.redirect("/user/1");
    }
    catch (error) {
        const handler = new handler_1.HandlerApi();
        handler.handlerError(error);
    }
});
/**
 * GET /users
 * Profile page.
 */
exports.postAllUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        let countpage;
        countpage = 0;
        const api = new api_1.BaseApi();
        if (req.params.page < 0)
            req.params.page = 0;
        const size = 80;
        // req.params.page = 1;
        // req.params.size = 5;
        let res_api;
        res_api = yield api.apiPostJson(req.user.access_token, process.env.DATA_OAUTH_URI + "api/users/" + req.params.page + "/" + size, req.body);
        if (res_api.total > 0) {
            countpage = res_api.total / size;
        }
        else {
            res_api.total = 0;
            res_api.data = [];
        }
        let res_api_full;
        res_api_full = yield api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/users/1/2000");
        res.render("account/list", {
            title: "Account Management",
            users: res_api.data,
            page: req.params.page - 0,
            countpage: countpage,
            usersCom: JSON.stringify(res_api_full.data),
            total: res_api.total
        });
    }
    catch (error) {
        const handler = new handler_1.HandlerApi();
        handler.handlerError(error);
    }
});
exports.getAllUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        let countpage;
        countpage = 0;
        console.log(req.params);
        const api = new api_1.BaseApi();
        if (req.params.page < 0)
            req.params.page = 0;
        const size = 30;
        // req.params.page = 1;
        // req.params.size = 5;
        let res_api;
        res_api = yield api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/users/" + req.params.page + "/" + size);
        if (res_api.total > 0) {
            countpage = res_api.total / size;
        }
        else {
            res_api.total = 0;
            res_api.data = [];
        }
        let res_api_full;
        res_api_full = yield api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/users/1/2000");
        res.render("account/list", {
            title: "Account Management",
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
/**
 * GET /account
 * Profile page.
 */
exports.getAccount = (req, res) => {
    res.render("account/profile", {
        title: "Account Management"
    });
};
/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) => {
    req.assert("email", "Please enter a valid email address.").isEmail();
    req.sanitize("email").normalizeEmail({ gmail_remove_dots: false });
    const errors = req.validationErrors();
    if (errors) {
        req.flash("errors", errors);
        return res.redirect("/account");
    }
    User_1.default.findById(req.user.id, (err, user) => {
        if (err) {
            return next(err);
        }
        user.email = req.body.email || "";
        user.profile.name = req.body.name || "";
        user.profile.gender = req.body.gender || "";
        user.profile.location = req.body.location || "";
        user.profile.website = req.body.website || "";
        user.save((err) => {
            if (err) {
                if (err.code === 11000) {
                    req.flash("errors", { msg: "The email address you have entered is already associated with an account." });
                    return res.redirect("/account");
                }
                return next(err);
            }
            req.flash("success", { msg: "Profile information has been updated." });
            res.redirect("/account");
        });
    });
};
/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = (req, res, next) => {
    req.assert("password", "Password must be at least 4 characters long").len({ min: 4 });
    req.assert("confirmPassword", "Passwords do not match").equals(req.body.password);
    const errors = req.validationErrors();
    if (errors) {
        req.flash("errors", errors);
        return res.redirect("/account");
    }
    User_1.default.findById(req.user.id, (err, user) => {
        if (err) {
            return next(err);
        }
        user.password = req.body.password;
        user.save((err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", { msg: "Password has been changed." });
            res.redirect("/account");
        });
    });
};
/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = (req, res, next) => {
    User_1.default.remove({ _id: req.user.id }, (err) => {
        if (err) {
            return next(err);
        }
        req.logout();
        req.flash("info", { msg: "Your account has been deleted." });
        res.redirect("/");
    });
};
/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = (req, res, next) => {
    const provider = req.params.provider;
    User_1.default.findById(req.user.id, (err, user) => {
        if (err) {
            return next(err);
        }
        user[provider] = undefined;
        user.tokens = user.tokens.filter((token) => token.kind !== provider);
        user.save((err) => {
            if (err) {
                return next(err);
            }
            req.flash("info", { msg: `${provider} account has been unlinked.` });
            res.redirect("/account");
        });
    });
};
/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    User_1.default
        .findOne({ passwordResetToken: req.params.token })
        .where("passwordResetExpires").gt(Date.now())
        .exec((err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash("errors", { msg: "Password reset token is invalid or has expired." });
            return res.redirect("/forgot");
        }
        res.render("account/reset", {
            title: "Password Reset"
        });
    });
};
/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = (req, res, next) => {
    req.assert("password", "Password must be at least 4 characters long.").len({ min: 4 });
    req.assert("confirm", "Passwords must match.").equals(req.body.password);
    const errors = req.validationErrors();
    if (errors) {
        req.flash("errors", errors);
        return res.redirect("back");
    }
    async.waterfall([
        function resetPassword(done) {
            User_1.default
                .findOne({ passwordResetToken: req.params.token })
                .where("passwordResetExpires").gt(Date.now())
                .exec((err, user) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    req.flash("errors", { msg: "Password reset token is invalid or has expired." });
                    return res.redirect("back");
                }
                user.password = req.body.password;
                user.passwordResetToken = undefined;
                user.passwordResetExpires = undefined;
                user.save((err) => {
                    if (err) {
                        return next(err);
                    }
                    req.logIn(user, (err) => {
                        done(err, user);
                    });
                });
            });
        },
        function sendResetPasswordEmail(user, done) {
            const transporter = nodemailer.createTransport({
                service: "SendGrid",
                auth: {
                    user: process.env.SENDGRID_USER,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
            const mailOptions = {
                to: user.email,
                from: "express-ts@starter.com",
                subject: "Your password has been changed",
                text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
            };
            transporter.sendMail(mailOptions, (err) => {
                req.flash("success", { msg: "Success! Your password has been changed." });
                done(err);
            });
        }
    ], (err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
};
/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    res.render("account/forgot", {
        title: "Forgot Password"
    });
};
/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = (req, res, next) => {
    req.assert("email", "Please enter a valid email address.").isEmail();
    req.sanitize("email").normalizeEmail({ gmail_remove_dots: false });
    const errors = req.validationErrors();
    if (errors) {
        req.flash("errors", errors);
        return res.redirect("/forgot");
    }
    async.waterfall([
        function createRandomToken(done) {
            crypto.randomBytes(16, (err, buf) => {
                const token = buf.toString("hex");
                done(err, token);
            });
        },
        function setRandomToken(token, done) {
            User_1.default.findOne({ email: req.body.email }, (err, user) => {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    req.flash("errors", { msg: "Account with that email address does not exist." });
                    return res.redirect("/forgot");
                }
                user.passwordResetToken = token;
                user.passwordResetExpires = Date.now() + 3600000; // 1 hour
                user.save((err) => {
                    done(err, token, user);
                });
            });
        },
        function sendForgotPasswordEmail(token, user, done) {
            const transporter = nodemailer.createTransport({
                service: "SendGrid",
                auth: {
                    user: process.env.SENDGRID_USER,
                    pass: process.env.SENDGRID_PASSWORD
                }
            });
            const mailOptions = {
                to: user.email,
                from: "hackathon@starter.com",
                subject: "Reset your password on Hackathon Starter",
                text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://${req.headers.host}/reset/${token}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`
            };
            transporter.sendMail(mailOptions, (err) => {
                req.flash("info", { msg: `An e-mail has been sent to ${user.email} with further instructions.` });
                done(err);
            });
        }
    ], (err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/forgot");
    });
};
//# sourceMappingURL=user.js.map