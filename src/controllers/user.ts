import * as async from "async";
import * as crypto from "crypto";
import * as nodemailer from "nodemailer";
import * as passport from "passport";
import { default as User, UserModel, AuthToken } from "../models/User";
import { Request, Response, NextFunction } from "express";
import { IVerifyOptions } from "passport-local";
import { WriteError } from "mongodb";
const request = require("express-validator");
import * as _ from "lodash";
// Customize
import { BaseApi } from "../services/api";
import { HandlerApi } from "../services/handler";

/**
 * GET /login
 * Login page.
 */
export let getLogin = (req: Request, res: Response) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("account/login", {
    title: "Login"
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
export let postLogin = (req: Request, res: Response, next: NextFunction) => {
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

    passport.authenticate("local", (err: Error, user: UserModel, info: IVerifyOptions) => {
      if (err) { return next(err); }
      if (!user) {
        const errors = [ { location: "body",
        param: "username",
        msg: info.message,
        value: "" }];
        req.flash("errors", errors);
        return res.redirect("/login");
      }
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        req.flash("success", { msg: "Success! You are logged in." });
        res.redirect(req.session.returnTo || "/");
      });
    })(req, res, next);
  } catch (error) {
    console.log(error);
    const handler = new HandlerApi();
    handler.handlerError(error);
  }
};

/**
 * GET /logout
 * Log out.
 */
export let logout = (req: Request, res: Response) => {
  req.logout();
  res.redirect("/");
};

/**
 * GET /signup
 * Signup page.
 */
export let getSignup = async (req: Request, res: Response) => {
  /*if (req.user) {
    return res.redirect("/");
  }*/
  try {
    // Call API get Scope
    const api = new BaseApi();
    const res_api = await api.apiGet("token", process.env.DATA_OAUTH_URI + "api/roles");
    const arrScope = _.groupBy(res_api, "resource");
    const arrResource = (Object.keys(arrScope));
    // console.log(result[abc[0]]);
    res.render("account/signup", {
      title: "Create Account",
      arrResource: arrResource,
      arrScope: arrScope
    });
  } catch (error) {
    const handler = new HandlerApi();
    handler.handlerError(error);
  }
};

/**
 * POST /signup
 * Create a new local account.
 */
export let postSignup = async (req: Request, res: Response, next: NextFunction) => {
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
    const errors = req.validationErrors();
    console.log(errors);
    if (errors) {
      req.flash("errors", errors);
      return res.redirect("/user/add");
    }
    datapost.resource_ids =  _.join(req.body.resource_ids, ",");
    datapost.scope =  _.join(req.body.scope, ",");
    console.log("+++++++");
    console.log(datapost);
    // Call API add
    const api = new BaseApi();
    const res_api = await api.apiPostJson("token", process.env.DATA_OAUTH_URI + "api/users/add", datapost);
    console.log(res_api);
    /*res.render("account/signup", {
      title: "Create Account",
      arrResource: [],
      arrScope: []
    });*/
    return res.redirect("/user/1");
  } catch (error) {
    const handler = new HandlerApi();
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
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
 export let getUpdateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Call API get Scope 
    const api = new BaseApi();
    const res_api = await api.apiGet("token", process.env.DATA_OAUTH_URI + "api/roles");
    const arrScope = _.groupBy(res_api, "resource");
    const arrResource = (Object.keys(arrScope));
    // console.log(result[abc[0]]);
    res.render("account/signup", {
      title: "Update User",
      arrResource: arrResource,
      arrScope: arrScope
    });
  } catch (error) {
    const handler = new HandlerApi();
    handler.handlerError(error);
  }
};


export let postUpdatePhone = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  try {
    req.assert("phone", "Phone is not valid").notEmpty();
    req.assert("username", "Username is not valid").notEmpty();
    const errors = req.validationErrors();
    console.log(errors);
    if (errors) {
      req.flash("errors", errors);
      return res.redirect("/user");
    }
    const datapost = {phone : req.body.phone};
    console.log(datapost);
    // Call API add
    const api = new BaseApi();
    const res_api = await api.apiPatchJson(req.user.access_token, process.env.DATA_OAUTH_URI + "api/users/updatePhone/" + req.body.username, datapost);
    console.log(res_api);
    return res.redirect("/user");

  } catch (error) {
    const handler = new HandlerApi();
    handler.handlerError(error);
  }
};
/**
 * GET /users
 * Profile page.
 */

export let postAllUsers = async (req: Request, res: Response) => {
  try {
    let countpage: number;
    countpage = 0;
    const api = new BaseApi();
    if (req.params.page < 0 ) req.params.page = 0;
    const size = 80;
    // req.params.page = 1;
    // req.params.size = 5;
    let res_api: any;
    res_api = await api.apiPost(req.user.access_token, process.env.DATA_OAUTH_URI + "api/users/" + req.params.page + "/" + size, req.body);
    if (res_api.total > 0 ) {
      countpage = res_api.total / size;
    } else {
      res_api.total = 0;
      res_api.data = [];
    }
    res.render("account/list", {
      title: "Account Management",
      users: res_api.data,
      page: req.params.page - 0 ,
      countpage: countpage,
      total: res_api.total
    });
  } catch (error) {
    const handler = new HandlerApi();
    handler.handlerError(error);
  }
};


export let getAllUsers = async (req: Request, res: Response) => {
  try {
    let countpage: number;
    countpage = 0;
    const api = new BaseApi();
    if (req.params.page < 0 ) req.params.page = 0;
    const size = 8;
    // req.params.page = 1;
    // req.params.size = 5;
    let res_api: any;
    res_api = await api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/users/" + req.params.page + "/" + size);
    if (res_api.total > 0 ) {
      countpage = res_api.total / size;
    } else {
      res_api.total = 0;
      res_api.data = [];
    }
    res.render("account/list", {
      title: "Account Management",
      users: res_api.data,
      page: req.params.page - 0 ,
      countpage: countpage,
      total: res_api.total
    });
  } catch (error) {
    const handler = new HandlerApi();
    handler.handlerError(error);
  }
};

/**
 * GET /account
 * Profile page.
 */
export let getAccount = (req: Request, res: Response) => {
  res.render("account/profile", {
    title: "Account Management"
  });
};

/**
 * POST /account/profile
 * Update profile information.
 */
export let postUpdateProfile = (req: Request, res: Response, next: NextFunction) => {
  req.assert("email", "Please enter a valid email address.").isEmail();
  req.sanitize("email").normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash("errors", errors);
    return res.redirect("/account");
  }

  User.findById(req.user.id, (err, user: UserModel) => {
    if (err) { return next(err); }
    user.email = req.body.email || "";
    user.profile.name = req.body.name || "";
    user.profile.gender = req.body.gender || "";
    user.profile.location = req.body.location || "";
    user.profile.website = req.body.website || "";
    user.save((err: WriteError) => {
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
export let postUpdatePassword = (req: Request, res: Response, next: NextFunction) => {
  req.assert("password", "Password must be at least 4 characters long").len({ min: 4 });
  req.assert("confirmPassword", "Passwords do not match").equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash("errors", errors);
    return res.redirect("/account");
  }

  User.findById(req.user.id, (err, user: UserModel) => {
    if (err) { return next(err); }
    user.password = req.body.password;
    user.save((err: WriteError) => {
      if (err) { return next(err); }
      req.flash("success", { msg: "Password has been changed." });
      res.redirect("/account");
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
export let postDeleteAccount = (req: Request, res: Response, next: NextFunction) => {
  User.remove({ _id: req.user.id }, (err) => {
    if (err) { return next(err); }
    req.logout();
    req.flash("info", { msg: "Your account has been deleted." });
    res.redirect("/");
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
export let getOauthUnlink = (req: Request, res: Response, next: NextFunction) => {
  const provider = req.params.provider;
  User.findById(req.user.id, (err, user: any) => {
    if (err) { return next(err); }
    user[provider] = undefined;
    user.tokens = user.tokens.filter((token: AuthToken) => token.kind !== provider);
    user.save((err: WriteError) => {
      if (err) { return next(err); }
      req.flash("info", { msg: `${provider} account has been unlinked.` });
      res.redirect("/account");
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
export let getReset = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  User
    .findOne({ passwordResetToken: req.params.token })
    .where("passwordResetExpires").gt(Date.now())
    .exec((err, user) => {
      if (err) { return next(err); }
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
export let postReset = (req: Request, res: Response, next: NextFunction) => {
  req.assert("password", "Password must be at least 4 characters long.").len({ min: 4 });
  req.assert("confirm", "Passwords must match.").equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash("errors", errors);
    return res.redirect("back");
  }

  async.waterfall([
    function resetPassword(done: Function) {
      User
        .findOne({ passwordResetToken: req.params.token })
        .where("passwordResetExpires").gt(Date.now())
        .exec((err, user: any) => {
          if (err) { return next(err); }
          if (!user) {
            req.flash("errors", { msg: "Password reset token is invalid or has expired." });
            return res.redirect("back");
          }
          user.password = req.body.password;
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          user.save((err: WriteError) => {
            if (err) { return next(err); }
            req.logIn(user, (err) => {
              done(err, user);
            });
          });
        });
    },
    function sendResetPasswordEmail(user: UserModel, done: Function) {
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
    if (err) { return next(err); }
    res.redirect("/");
  });
};

/**
 * GET /forgot
 * Forgot Password page.
 */
export let getForgot = (req: Request, res: Response) => {
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
export let postForgot = (req: Request, res: Response, next: NextFunction) => {
  req.assert("email", "Please enter a valid email address.").isEmail();
  req.sanitize("email").normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash("errors", errors);
    return res.redirect("/forgot");
  }

  async.waterfall([
    function createRandomToken(done: Function) {
      crypto.randomBytes(16, (err, buf) => {
        const token = buf.toString("hex");
        done(err, token);
      });
    },
    function setRandomToken(token: AuthToken, done: Function) {
      User.findOne({ email: req.body.email }, (err, user: any) => {
        if (err) { return done(err); }
        if (!user) {
          req.flash("errors", { msg: "Account with that email address does not exist." });
          return res.redirect("/forgot");
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        user.save((err: WriteError) => {
          done(err, token, user);
        });
      });
    },
    function sendForgotPasswordEmail(token: AuthToken, user: UserModel, done: Function) {
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
    if (err) { return next(err); }
    res.redirect("/forgot");
  });
};
