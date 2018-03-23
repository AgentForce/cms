import { Request, Response } from "express";

/**
 * GET /
 * Home page.
 */
export let index = (req: Request, res: Response) => {
  console.log("user=====");
  console.log(req.user);
  console.log("user=====");
  res.render("home", {
    title: "Home"
  });
};
