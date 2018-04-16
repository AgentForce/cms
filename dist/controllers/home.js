"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
    console.log("user=====");
    console.log(req.user);
    console.log("user=====");
    res.render("home", {
        title: "Home"
    });
};
exports.currentdev = (req, res) => {
    res.render("homeload", {
        title: "Home"
    });
};
//# sourceMappingURL=home.js.map