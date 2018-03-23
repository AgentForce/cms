"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const passportLocal = require("passport-local");
const passportFacebook = require("passport-facebook");
const _ = require("lodash");
// Customize
const api_1 = require("../services/api");
const co = require("co");
// import { User, UserType } from '../models/User';
const User_1 = require("../models/User");
const LocalStrategy = passportLocal.Strategy;
const FacebookStrategy = passportFacebook.Strategy;
passport.serializeUser((user, done) => {
    done(undefined, user);
});
passport.deserializeUser((id, done) => {
    done("", id);
    /*User.findById(id, (err, user) => {
      done(err, user);
    });*/
});
/**
 * Sign in using Username and Password.
 */
passport.use(new LocalStrategy({ usernameField: "username" }, (username, password, done) => {
    try {
        // GET TOKEN
        co(function* () {
            const api = new api_1.BaseApi();
            const datapost = {
                grant_type: "password",
                username: username,
                password: password
            };
            const res_api = yield api.apiPost("token", process.env.OAUTH_URI + "oauth/token", (datapost));
            console.log("==========err");
            console.log(res_api);
            return res_api;
        }).then(function (res_api) {
            return done(undefined, res_api);
        }, function (err) {
            return done(undefined, false, { message: err });
            // return done(undefined, false, { message: "Invalid email or password." });
            // return done(err);
        });
    }
    catch (error) {
        console.log(error);
    }
}));
/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */
/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ["name", "email", "link", "locale", "timezone"],
    passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
    if (req.user) {
        User_1.default.findOne({ facebook: profile.id }, (err, existingUser) => {
            if (err) {
                return done(err);
            }
            if (existingUser) {
                req.flash("errors", { msg: "There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account." });
                done(err);
            }
            else {
                User_1.default.findById(req.user.id, (err, user) => {
                    if (err) {
                        return done(err);
                    }
                    user.facebook = profile.id;
                    user.tokens.push({ kind: "facebook", accessToken });
                    user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
                    user.profile.gender = user.profile.gender || profile._json.gender;
                    user.profile.picture = user.profile.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`;
                    user.save((err) => {
                        req.flash("info", { msg: "Facebook account has been linked." });
                        done(err, user);
                    });
                });
            }
        });
    }
    else {
        User_1.default.findOne({ facebook: profile.id }, (err, existingUser) => {
            if (err) {
                return done(err);
            }
            if (existingUser) {
                return done(undefined, existingUser);
            }
            User_1.default.findOne({ email: profile._json.email }, (err, existingEmailUser) => {
                if (err) {
                    return done(err);
                }
                if (existingEmailUser) {
                    req.flash("errors", { msg: "There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings." });
                    done(err);
                }
                else {
                    const user = new User_1.default();
                    user.email = profile._json.email;
                    user.facebook = profile.id;
                    user.tokens.push({ kind: "facebook", accessToken });
                    user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
                    user.profile.gender = profile._json.gender;
                    user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
                    user.profile.location = (profile._json.location) ? profile._json.location.name : "";
                    user.save((err) => {
                        done(err, user);
                    });
                }
            });
        });
    }
}));
/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};
/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
    const provider = req.path.split("/").slice(-1)[0];
    if (_.find(req.user.tokens, { kind: provider })) {
        next();
    }
    else {
        res.redirect(`/auth/${provider}`);
    }
};
//# sourceMappingURL=passport.js.map