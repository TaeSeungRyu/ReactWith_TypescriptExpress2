import * as express from "express";
import * as bodyParser from "body-parser";
import * as ejs from "ejs";
import * as chery from "cheerio";
import axios, { AxiosResponse } from "axios";

import init, { select, insert, update, remove, createFile } from "./db";
import { DBform } from "./db";

//#1. 서버 기본 설정 입니다.
//익스프레스 객체 입니다.
const app: express.Application = express();

//#2. 뷰 설정 입니다.
app.set("views", "D:/reactWithApp/server/html");
app.engine("html", ejs.renderFile);
app.set("view engine", "html");

//#3. 데이터베이스를 설정 합니다.
init();

//#3. post 파라미터 파싱부분 입니다.
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//#4. 화면 페이지로 이동시킵니다.
app.all("/", (req: express.Request, res: express.Response) => {
  res.render("index.html", { title: "Welcome" });
});

//#8. 서버를 실행 합니다.
app.listen(4885, () => {
  console.log("실행중");
});

//URL 분석요청 입니다.
app.all("/data/study", (req: express.Request, res: express.Response) => {
  let { url, node, type = "get" } = req.body;
  console.log(url, node, type);
  url = url.toString();
  node = node.toString();
  type = type.toString();
  console.log(url, node, type);
  axios
    .request({ url: url, method: type })
    .then((response: AxiosResponse) => {
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
      } else {
        res.send({ result: $.html() });
      }
    })
    .catch((err) => {
      console.log(err, err.response);
    });
});
