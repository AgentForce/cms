import { Request, Response } from "express";
// Customize
import { BaseApi } from "../services/api";
import { HandlerApi } from "../services/handler";
/**
 * GET /
 * Home page.
 */
export let index = async (req: Request, res: Response) => {
  const api = new BaseApi();
  let res_api: any;
  res_api = await api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/dashboard/0");
  console.log(res_api);
  res.render("home", {
    title: "Home",
    users: JSON.stringify(res_api)
  });

};

export let currentdev = async (req: Request, res: Response) => {
  const api = new BaseApi();
  let res_api: any;
  res_api = await api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/reportto/" + req.params.id );
  res.json(res_api);
};
