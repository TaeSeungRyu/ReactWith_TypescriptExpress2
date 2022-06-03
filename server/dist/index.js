"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const chery = require("cheerio");
const axios_1 = require("axios");
const db_1 = require("./db");
//#1. 서버 기본 설정 입니다.
//익스프레스 객체 입니다.
const app = express();
//#2. 뷰 설정 입니다.
app.set("views", "D:/reactWithApp/server/html");
app.engine("html", ejs.renderFile);
app.set("view engine", "html");
//#3. 데이터베이스를 설정 합니다.
(0, db_1.default)();
//#4. post 파라미터 파싱부분 입니다.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
//#5 URL 분석요청 입니다.
app.all("/data/study", (req, res) => {
    let { url, node, type = "get" } = req.body;
    // url = url.toString();
    // node = node.toString();
    // type = type.toString();
    axios_1.default
        .request({ url: url, method: type })
        .then((response) => {
        const $ = chery.load(response.data);
        if (node) {
            let text = "";
            $(node)
                .children()
                .each((index, element) => {
                text += $(element).text() + "/n";
            });
            res.send({ result: text });
        }
        else {
            res.send({ result: $.html() });
        }
    })
        .catch((err) => {
        console.log(err, err.response);
    });
});
app.all("/data/getList", (req, res) => {
    (0, db_1.select)((error, result) => {
        res.send({ result: JSON.stringify(result) });
    });
});
app.all("/data/saveResult", (req, res) => {
    let { url, node, type, ask_result, date = new Date().toString(), } = req.body;
    (0, db_1.insert)({ url, node, type, ask_result, date }, (result, error) => {
        console.log(result, error);
        if (error) {
            res.send({ result: "error" });
        }
        else {
            res.send({ result: "succ" });
        }
    });
});
app.all("/data/remove", (req, res) => {
    let { idx } = req.body;
    (0, db_1.remove)(idx, (result, error) => {
        console.log(result, error);
        if (error) {
            res.send({ result: "error" });
        }
        else {
            res.send({ result: "succ" });
        }
    });
});
//#8. 서버를 실행 합니다.
app.listen(4885, () => {
    console.log("실행중");
});
