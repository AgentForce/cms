import * as express from "express";
import * as compression from "compression";  // compresses requests
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as lusca from "lusca";
import * as dotenv from "dotenv";
import * as mongo from "connect-mongo";
import * as flash from "express-flash";
import * as path from "path";
import * as mongoose from "mongoose";
import * as passport from "passport";
import * as expressValidator from "express-validator";
import * as bluebird from "bluebird";

const MongoStore = mongo(session);

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env.example" });

// Controllers (route handlers)
import * as homeController from "./controllers/home";
import * as userController from "./controllers/user";
import * as apiController from "./controllers/api";
import * as contactController from "./controllers/contact";
import * as roleController from "./controllers/role";
import * as permissionController from "./controllers/permission";
// API keys and Passport configuration
import * as passportConfig from "./config/passport";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = process.env.MONGOLAB_URI;
(<any>mongoose).Promise = bluebird;
mongoose.connect(mongoUrl, {useMongoClient: true}).then(
  () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
  console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
  // process.exit();
});

// Express configuration
app.set("port", process.env.PORT || 4200);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: mongoUrl,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
    req.path !== "/login" &&
    req.path !== "/signup" &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
    req.path == "/account") {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, "public"), { maxAge: 31557600000 }));

/**
 * Primary app routes.
 */
app.get("/", passportConfig.isAuthenticated, homeController.index);
app.get("/login", userController.getLogin);
app.post("/login", userController.postLogin);
app.get("/logout", passportConfig.isAuthenticated, userController.logout);
// app.get("/forgot", passportConfig.isAuthenticated, userController.getForgot);
// app.post("/forgot", passportConfig.isAuthenticated, userController.postForgot);
// app.get("/reset/:token", userController.getReset);
// app.post("/reset/:token", userController.postReset);
app.post("/user/updatephone/:id", passportConfig.isAuthenticated, userController.postUpdatePhone);
app.get("/user/edit/:id", passportConfig.isAuthenticated, userController.getUpdateUser);
app.get("/user/add", passportConfig.isAuthenticated, userController.getSignup);
app.post("/user/add", passportConfig.isAuthenticated, userController.postSignup);
app.get("/contact", passportConfig.isAuthenticated, contactController.getContact);
app.post("/contact", passportConfig.isAuthenticated, contactController.postContact);
app.get("/user/:page", passportConfig.isAuthenticated, userController.getAllUsers);
app.post("/user/:page", passportConfig.isAuthenticated, userController.postAllUsers);
app.get("/account", passportConfig.isAuthenticated, userController.getAccount);
app.post("/account/profile", passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post("/account/password", passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post("/account/delete", passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get("/account/unlink/:provider", passportConfig.isAuthenticated, userController.getOauthUnlink);
app.get("/role/:id", passportConfig.isAuthenticated, roleController.getRole);
app.post("/role", passportConfig.isAuthenticated, roleController.postRole);
app.get("/role/link/:idrole", passportConfig.isAuthenticated, roleController.getLinkRole);
app.post("/role/link/:idrole", passportConfig.isAuthenticated, roleController.postLinkRole);

app.get("/permission/:id", passportConfig.isAuthenticated, permissionController.getPermission);
app.post("/permission", passportConfig.isAuthenticated, permissionController.postPermission);

module.exports = app;