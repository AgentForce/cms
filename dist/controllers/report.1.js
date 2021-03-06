"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("express-validator");
// Customize
const api_1 = require("../services/api");
const handler_1 = require("../services/handler");
/**
 * GET /login
 * Login page.
 */
exports.getIndex = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        let countpage;
        countpage = 0;
        // console.log(req.params);
        const api = new api_1.BaseApi();
        if (req.params.page < 0)
            req.params.page = 0;
        const size = 30;
        // req.params.page = 1;
        // req.params.size = 5;
        let res_api;
        res_api = yield api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/users/" + req.params.page + "/" + size);
        if (res_api.total > 0) {
            countpage = res_api.total / size;
        }
        else {
            res_api.total = 0;
            res_api.data = [];
        }
        let res_api_full;
        res_api_full = yield api.apiGet(req.user.access_token, process.env.DATA_OAUTH_URI + "api/users/1/2000");
        res.render("report", {
            title: "Report",
            users: res_api.data,
            usersCom: JSON.stringify(res_api_full.data),
            page: req.params.page - 0,
            countpage: countpage,
            total: res_api.total
        });
    }
    catch (error) {
        const handler = new handler_1.HandlerApi();
        handler.handlerError(error);
    }
});
const excel = require("node-excel-export");
exports.postExcel = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        req.assert("from", "From is not valid").notEmpty();
        req.assert("to", "To is not valid").notEmpty();
        const errors = req.validationErrors();
        // console.log(errors);
        if (errors) {
            req.flash("errors", errors);
            return res.redirect("/report");
        }
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
        let TypeExcel = "Tất cả người dùng";
        if (req.body.type === "1")
            TypeExcel = "Người dùng đã kích hoạt";
        else if (req.body.type === "2")
            TypeExcel = "Người dùng chưa kích hoạt";
        else if (req.body.type === "level")
            TypeExcel = "Cấp con của user";
        const heading = [
            [{ value: "Report " + req.body.from + " - " + req.body.to, style: styles.header }, { value: "b1", style: styles.headerDark }, { value: "c1", style: styles.headerDark }],
            ["Username: " + req.body.key],
            ["Type : " + TypeExcel] // <-- It can be only values
        ];
        // Here you specify the export structure
        const specification = {
            username: {
                displayName: "Username",
                headerStyle: styles.headerDark,
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
                cellStyle: styles.cellPink,
                width: 220 // <- width in pixels
            },
            email: {
                displayName: "Email",
                headerStyle: styles.headerDark,
                width: 220 // <- width in pixels
            },
            scope: {
                displayName: "Scope",
                headerStyle: styles.headerDark,
                cellStyle: styles.cellPink,
                width: 70 // <- width in pixels
            },
            phone: {
                displayName: "Phone",
                headerStyle: styles.headerDark,
                width: 50 // <- width in chars (when the number is passed as string)
            },
            address: {
                displayName: "Address",
                headerStyle: styles.headerDark,
                cellStyle: styles.cellPink,
                width: 220 // <- width in pixels
            },
            gender: {
                displayName: "Gender",
                headerStyle: styles.headerDark,
                width: 30 // <- width in pixels
            },
            birthday: {
                displayName: "Birthday",
                headerStyle: styles.headerDark,
                cellStyle: styles.cellPink,
                width: 220 // <- width in pixels
            },
            code_level: {
                displayName: "Code Level",
                headerStyle: styles.headerDark,
                width: 70 // <- width in pixels
            },
            status: {
                displayName: "Status",
                headerStyle: styles.headerDark,
                cellStyle: styles.cellPink,
                width: 30 // <- width in pixels
            },
            expirence: {
                displayName: "Experience",
                headerStyle: styles.headerDark,
                width: 220 // <- width in pixels
            },
            zone: {
                displayName: "Zone",
                headerStyle: styles.headerDark,
                cellStyle: styles.cellPink,
                width: 20 // <- width in pixels
            },
            badge: {
                displayName: "Badge",
                headerStyle: styles.headerDark,
                width: 120 // <- width in pixels
            },
            report_to_username: {
                displayName: "Report To",
                headerStyle: styles.headerDark,
                cellStyle: styles.cellPink,
                width: 120 // <- width in pixels
            },
            identity_card: {
                displayName: "Identity Card",
                headerStyle: styles.headerDark,
                width: 120 // <- width in pixels
            },
            onboard_date: {
                displayName: "Onboard Date",
                headerStyle: styles.headerDark,
                cellStyle: styles.cellPink,
                width: 120 // <- width in pixels
            },
            manager_badge: {
                displayName: "Manager Badge",
                headerStyle: styles.headerDark,
                width: 70 // <- width in pixels
            }
        };
        // The data set should have the following shape (Array of Objects)
        // The order of the keys is irrelevant, it is also irrelevant if the
        // dataset contains more fields as the report is build based on the
        // specification provided above. But you should have all the fields
        // that are listed in the report specification
        const api = new api_1.BaseApi();
        let dataApi;
        // console.log(req.body);
        dataApi = yield api.apiPostJson(req.user.access_token, process.env.DATA_OAUTH_URI + "api/export", req.body);
        const dataset = dataApi.resQ;
        for (let index = 0; index < dataset.length; index++) {
            const element = dataset[index];
            if (dataset[index].gender == "1")
                dataset[index].gender = "Male";
            else
                dataset[index].gender = "FeMale";
            dataset[index].code_level = dataset[index].code_level + " - " + dataset[index].level;
            if (dataset[index].status == "1")
                dataset[index].status = "Active";
            else if (dataset[index].status == "0")
                dataset[index].status = "OTP";
            else
                dataset[index].status = "DeActive";
            if (dataset[index].badge == "1")
                dataset[index].badge = "Đại lý thông thường";
            else if (dataset[index].badge == "2")
                dataset[index].badge = "MDRT";
            else if (dataset[index].badge == "3")
                dataset[index].badge = "COT";
            else if (dataset[index].badge == "4")
                dataset[index].badge = "TOT";
            else if (dataset[index].badge == "5")
                dataset[index].badge = "FC Bạc";
            else if (dataset[index].badge == "6")
                dataset[index].badge = "FC Vàng";
            else if (dataset[index].badge == "7")
                dataset[index].badge = "FC Kim Cương";
            if (dataset[index].manager_badge == "1")
                dataset[index].manager_badge = "Quản lý thông thường";
            else if (dataset[index].manager_badge == "2")
                dataset[index].manager_badge = "MBA Bạc";
            else if (dataset[index].manager_badge == "3")
                dataset[index].manager_badge = "MBA Vàng";
            else if (dataset[index].manager_badge == "4")
                dataset[index].manager_badge = "MBA Kim Cương";
        }
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
        const report = excel.buildExport([
            {
                name: "Report",
                heading: heading,
                merges: merges,
                specification: specification,
                data: dataset // <-- Report data
            }
        ]);
        // You can then return this straight
        res.attachment("report.xlsx"); // This is sails.js specific (in general you need to set headers)
        /*res.render("report", {
          title: "Account Management"
        });*/
        return res.send(report);
    }
    catch (error) {
        const handler = new handler_1.HandlerApi();
        handler.handlerError(error);
        return res.redirect("/report");
    }
});
//# sourceMappingURL=report.1.js.map