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
    users: JSON.stringify(res_api.resQ),
    "countSum": res_api.countSum,
    "countSumActive": res_api.countSumActive,
    "countSumDeActive": res_api.countSum - res_api.countSumActive,
    "countMonth": res_api.countMonth,
    "countActiveMonth": res_api.countActiveMonth,
    "countDeActiveMonth": res_api.countMonth - res_api.countActiveMonth
  });

};

export let currentdev = async (req: Request, res: Response) => {
  const api = new BaseApi();
  let res_api: any;
  res_api = await api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/reportto/" + req.params.id );
  res.json(res_api);
};
