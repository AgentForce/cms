import * as nodemailer from "nodemailer";
import { Request, Response } from "express";
// Customize
import { BaseApi } from "../services/api";
import { HandlerApi } from "../services/handler";
/**
 * GET /role
 * Contact form page.
 */
export let getRole = async (req: Request, res: Response) => {
  // tslint:disable-next-line:no-trailing-whitespace
  try {
    let countpage: number;
    countpage = 0;
    const api = new BaseApi();
    if (req.params.page < 0 ) req.params.page = 0;
    const size = 8;
    // req.params.page = 1;
    // req.params.size = 5;
    let res_api: any;
    res_api = await api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/roles/" + req.params.page + "/" + size);
    if (res_api.total > 0 ) {
      countpage = res_api.total / size;
    } else {
      res_api.total = 0;
      res_api.data = [];
    }
    // console.log("======");
    // console.log(res_api.data);
    res.render("role", {
      title: "Role Management",
      roles: res_api.data,
      page: req.params.page - 0 ,
      countpage: countpage,
      total: res_api.total
    });
  } catch (error) {
    const handler = new HandlerApi();
    handler.handlerError(error);
  }

};

export let getLinkRole = async (req: Request, res: Response) => {
  // tslint:disable-next-line:no-trailing-whitespace
  try {
    const api = new BaseApi();
    let res_api: any;
    let res_role: any;
    console.log(req.params.idrole);
    res_api = await api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/permissions");
    res_role = await api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/roles/obj/" + req.params.idrole);
    console.log(res_role);
    // api/permissions/obj
    res.render("rolelink", {
      title: "Role Link",
      permissions: res_api,
      role: res_role.role,
      scopes: res_role.permissions,
      roles: []
    });
  } catch (error) {
    const handler = new HandlerApi();
    handler.handlerError(error);
  }

};
/**
 * POST /role
 * Send a role form via Nodemailer.
 */
export let postRole = async(req: Request, res: Response) => {
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
    const api = new BaseApi();
    const res_api = await api.apiPostJson(req.user.access_token, process.env.DATA_OAUTH_URI + "api/roles", datapost);
    console.log(res_api);
    /*res.render("account/signup", {
      title: "Create Account",
      arrResource: [],
      arrScope: []
    });*/
    return res.redirect("/role/1");
  } catch (error) {
    const handler = new HandlerApi();
    handler.handlerError(error);
  }

};

export let postLinkRole = async(req: Request, res: Response) => {
  try {
    req.assert("arrPermission", "Permission is not valid").notEmpty();
    const datapost = req.body;
    datapost.is_default = true;
    const errors = req.validationErrors();
    console.log(errors);
    if (errors) {
      req.flash("errors", errors);
      return res.redirect("/role/link/" + req.params.idrole);
    }
    // Call API add
    const api = new BaseApi();
    const res_api = await api.apiPostJson(req.user.access_token, process.env.DATA_OAUTH_URI + "/api/roles/link/" + req.params.idrole, datapost);
    console.log(res_api);
    /*res.render("account/signup", {
      title: "Create Account",
      arrResource: [],
      arrScope: []
    });*/
    return res.redirect("/role/1");
  } catch (error) {
    const handler = new HandlerApi();
    handler.handlerError(error);
  }

};