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
//#3. post 파라미터 파싱부분 입니다.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
//#4. 화면 페이지로 이동시킵니다.
app.all("/", (req, res) => {
    res.render("index.html", { title: "Welcome" });
});
//#5. 간단하게 구현한 로그인 관련 내용 입니다.
const db = new Map(); //데이터 베이스용 map 객체 입니다.
app.all("/data/joinOrLogIn", (req, res) => {
    let { id, password, join } = req.body;
    id = id.toString();
    if (join) {
        //회원가입
        if (!db.get(id)) {
            db.set(id, password);
            res.set(id, password.toString());
            res.send({ result: "OK" });
        }
        else {
            res.send({ result: "ID IS EXSIST" });
        }
    }
    else {
        //로그인
        if (!db.get(id)) {
            res.send({ result: "no member" });
        }
        else if (db.get(id) && db.get(id) != password) {
            res.send({ result: "wrong password" });
        }
        else {
            res.send({ result: "OK" });
        }
    }
});
//#8. 서버를 실행 합니다.
app.listen(4885, () => {
    console.log("실행중");
});
//URL 분석요청 입니다.
app.all("/data/study", (req, res) => {
    let { url, node, type = "get" } = req.body;
    console.log(url, node, type);
    url = url.toString();
    node = node.toString();
    type = type.toString();
    console.log(url, node, type);
    axios_1.default
        .request({ url: url, method: type })
        .then((response) => {
        //console.log(response.data);
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
