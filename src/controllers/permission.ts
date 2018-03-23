import * as nodemailer from "nodemailer";
import { Request, Response } from "express";
// Customize
import { BaseApi } from "../services/api";
import { HandlerApi } from "../services/handler";
/**
 * GET /role
 * Contact form page.
 */
export let getPermission = async (req: Request, res: Response) => {
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
    res_api = await api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/permissions/" + req.params.page + "/" + size);
    if (res_api.total > 0 ) {
      countpage = res_api.total / size;
    } else {
      res_api.total = 0;
      res_api.data = [];
    }
    // console.log("======");
    // console.log(res_api.data);
    res.render("permission", {
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

/**
 * POST /role
 * Send a role form via Nodemailer.
 */
export let postPermission = async(req: Request, res: Response) => {
  try {
    req.assert("name", "Name is not valid").notEmpty();
    req.assert("scope", "Permission is not valid").notEmpty();
    req.assert("resource", "Resource is not valid").notEmpty();
    const datapost = req.body;
    datapost.is_default = true;
    const errors = req.validationErrors();
    console.log(errors);
    if (errors) {
      req.flash("errors", errors);
      return res.redirect("/permission/1");
    }
    // Call API add
    const api = new BaseApi();
    const res_api = await api.apiPostJson("token", process.env.DATA_OAUTH_URI + "api/permissions", datapost);
    console.log(res_api);
    /*res.render("account/signup", {
      title: "Create Account",
      arrResource: [],
      arrScope: []
    });*/
    return res.redirect("/permission/1");
  } catch (error) {
    const handler = new HandlerApi();
    handler.handlerError(error);
  }

};
