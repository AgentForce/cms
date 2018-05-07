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
    res_api = await api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/users/" + req.params.page + "/" + size);
    if (res_api.total > 0 ) {
      countpage = res_api.total / size;
    } else {
      res_api.total = 0;
      res_api.data = [];
    }
    let res_api_full: any;
    res_api_full = await api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/users/1/2000");
    res.render("report", {
      title: "Account Management",
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
const excel = require("node-excel-export");

export let postExcel = async (req: any, res: Response) => {
  const styles = {
    headerDark: {
      fill: {
        fgColor: {
          rgb: "FF000000"
        }
      },
      font: {
        color: {
          rgb: "FFFFFFFF"
        },
        sz: 18,
        bold: true,
        underline: true
      }
    },
    header: {
      font: {
        color: {
          rgb: "FF000000"
        },
        sz: 28,
        bold: true,
        vertAlign: true
      },
      alignment: {
        vertical: "center"
      }
    },
    cellPink: {
      fill: {
        fgColor: {
          rgb: "FFFFCCFF"
        }
      }
    },
    cellGreen: {
      fill: {
        fgColor: {
          rgb: "FF00FF00"
        }
      }
    }
  };

  // Array of objects representing heading rows (very top)
  const heading = [
    [{value: "Report 1/1/2018 - 1/2/2018", style: styles.header}, {value: "b1", style: styles.headerDark}, {value: "c1", style: styles.headerDark}],
    ["Username: Null"],
    ["Type : Full "] // <-- It can be only values
  ];
  // Here you specify the export structure
  const specification = {
    username: { // <- the key should match the actual data key
      displayName: "Username", // <- Here you specify the column header
      headerStyle: styles.headerDark, // <- Header style
      // cellStyle: function(value, row) { // <- style renderer function
        // if the status is 1 then color in green else color in red
        // Notice how we use another cell value to style the current one
        // return (row.status_id == 1) ? styles.cellGreen : {fill: {fgColor: {rgb: "FFFF0000"}}}; // <- Inline cell style is possible 
      // },
      width: 120 // <- width in pixels
    },
    fullName: {
      displayName: "FullName",
      headerStyle: styles.headerDark,
      cellStyle: styles.cellPink, // <- Cell style
      width: 220 // <- width in pixels
    },
    email: {
      displayName: "Email",
      headerStyle: styles.headerDark,
      cellStyle: styles.cellPink, // <- Cell style
      width: 220 // <- width in pixels
    },
    scope: {
      displayName: "Scope",
      headerStyle: styles.headerDark,
      cellStyle: styles.cellPink, // <- Cell style
      width: 220 // <- width in pixels
    },
    phone: {
      displayName: "Phone",
      headerStyle: styles.headerDark,
      cellFormat: function(value, row) { // <- Renderer function, you can access also any row.property
        return (value == 1) ? "Active" : "Inactive";
      },
      width: "10" // <- width in chars (when the number is passed as string)
    },
    address: {
      displayName: "Address",
      headerStyle: styles.headerDark,
      cellStyle: styles.cellPink, // <- Cell style
      width: 220 // <- width in pixels
    },
    gender: {
      displayName: "Gender",
      headerStyle: styles.headerDark,
      cellStyle: styles.cellPink, // <- Cell style
      width: 220 // <- width in pixels
    },
    birthday: {
      displayName: "Birthday",
      headerStyle: styles.headerDark,
      cellStyle: styles.cellPink, // <- Cell style
      width: 220 // <- width in pixels
    },
    code_level: {
      displayName: "Code Level",
      headerStyle: styles.headerDark,
      cellStyle: styles.cellPink, // <- Cell style
      width: 220 // <- width in pixels
    },
    status: {
      displayName: "Status",
      headerStyle: styles.headerDark,
      cellStyle: styles.cellPink, // <- Cell style
      width: 220 // <- width in pixels
    },
    experience: {
      displayName: "Experience",
      headerStyle: styles.headerDark,
      cellStyle: styles.cellPink, // <- Cell style
      width: 220 // <- width in pixels
    },
    zone: {
      displayName: "Zone",
      headerStyle: styles.headerDark,
      cellStyle: styles.cellPink, // <- Cell style
      width: 220 // <- width in pixels
    },
    badge: {
      displayName: "Badge",
      headerStyle: styles.headerDark,
      cellStyle: styles.cellPink, // <- Cell style
      width: 220 // <- width in pixels
    },
    report_to_username: {
      displayName: "Report To",
      headerStyle: styles.headerDark,
      cellStyle: styles.cellPink, // <- Cell style
      width: 220 // <- width in pixels
    },
    identity_card: {
      displayName: "Identity Card",
      headerStyle: styles.headerDark,
      cellStyle: styles.cellPink, // <- Cell style
      width: 220 // <- width in pixels
    },
    onboard_date: {
      displayName: "Onboard Date",
      headerStyle: styles.headerDark,
      cellStyle: styles.cellPink, // <- Cell style
      width: 220 // <- width in pixels
    },
    manager_badge: {
      displayName: "Manager Badge",
      headerStyle: styles.headerDark,
      cellStyle: styles.cellPink, // <- Cell style
      width: 220 // <- width in pixels
    }
  };
  // The data set should have the following shape (Array of Objects)
  // The order of the keys is irrelevant, it is also irrelevant if the
  // dataset contains more fields as the report is build based on the
  // specification provided above. But you should have all the fields
  // that are listed in the report specification
  const api = new BaseApi();
  let dataApi: any;
  // console.log(req.body);
  dataApi = await api.apiPostJson(req.user.access_token, process.env.DATA_OAUTH_URI + "api/export", req.body);
  const dataset = dataApi.resQ;
  /*const dataset = [
    {customer_name: "IBM", status_id: 1, note: "some note", misc: "not shown"},
    {customer_name: "HP", status_id: 0, note: "some note"},
    {customer_name: "MS", status_id: 0, note: "some note", misc: "not shown"},
    {customer_name: "IBM", status_id: 1, note: "some note", misc: "not shown"},
    {customer_name: "HP", status_id: 0, note: "some note"},
    {customer_name: "MS", status_id: 0, note: "some note", misc: "not shown"},
    {customer_name: "IBM", status_id: 1, note: "some note", misc: "not shown"},
    {customer_name: "HP", status_id: 0, note: "some note"},
    {customer_name: "MS", status_id: 0, note: "some note", misc: "not shown"}
  ];*/
  // Define an array of merges. 1-1 = A:1
  // The merges are independent of the data.
  // A merge will overwrite all data _not_ in the top-left cell.
  const merges = [
    { start: { row: 1, column: 1 }, end: { row: 1, column: 10 } },
    { start: { row: 2, column: 1 }, end: { row: 2, column: 5 } },
    { start: { row: 2, column: 6 }, end: { row: 2, column: 10 } }
  ];
  // Create the excel report.
  // This function will return Buffer
  const report = excel.buildExport(
    [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
      {
        name: "Report", // <- Specify sheet name (optional)
        heading: heading, // <- Raw heading array (optional)
        merges: merges, // <- Merge cell ranges
        specification: specification, // <- Report specification
        data: dataset // <-- Report data
      }
    ]
  );
  // You can then return this straight
  res.attachment("report.xlsx"); // This is sails.js specific (in general you need to set headers)
  /*res.render("report", {
    title: "Account Management"
  });*/
  return res.send(report);
};