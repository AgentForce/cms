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

export let getIndex = async (req: Request, res: Response) => {
  try {
    let countpage: number;
    countpage = 0;
    // console.log(req.params);
    const api = new BaseApi();
    if (req.params.page < 0 ) req.params.page = 0;
    const size = 30;
    // req.params.page = 1;
    // req.params.size = 5;
    let res_api: any;
    res_api = await api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/remind/" + req.params.page + "/" + size);
    if (res_api.total > 0 ) {
      countpage = res_api.total / size;
    } else {
      res_api.total = 0;
      res_api.data = [];
    }
    let res_api_full: any;
    res_api_full = await api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/remind/0/10000000");
    res.render("remind", {
      title: "Remind",
      users: res_api.data,
      usersCom: JSON.stringify(res_api_full.data),
      page: req.params.page - 0 ,
      countpage: countpage,
      total: res_api.total
    });
  } catch (error) {
    const handler = new HandlerApi();
    handler.handlerError(error);
  }
};
