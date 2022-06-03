import * as express from "express";
import * as bodyParser from "body-parser";
import * as ejs from "ejs";
import * as chery from "cheerio";
import axios, { AxiosResponse } from "axios";

import init, { select, insert, remove } from "./db";

//#1. 서버 기본 설정 입니다.
//익스프레스 객체 입니다.
const app: express.Application = express();

//#2. 뷰 설정 입니다.
app.set("views", "D:/reactWithApp/server/html");
app.engine("html", ejs.renderFile);
app.set("view engine", "html");

//#3. 데이터베이스를 설정 합니다.
init();

//#4. post 파라미터 파싱부분 입니다.
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//#5. URL 분석요청 입니다.
app.all("/data/study", (req: express.Request, res: express.Response) => {
  let { url, node, type = "get" } = req.body;
  axios
    .request({ url: url, method: type })
    .then((response: AxiosResponse) => {
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

//#6. 저장된 분석데이터를 db로받아서 전달 합니다.
app.all("/data/getList", (req: express.Request, res: express.Response) => {
  select((error, result) => {
    res.send({ result: JSON.stringify(result) });
  });
});

//#7. 분석결과를 저장합니다.
app.all("/data/saveResult", (req: express.Request, res: express.Response) => {
  let { url, node, type, ask_result, date = new Date().toString() } = req.body;

  insert({ url, node, type, ask_result, date }, (result, error) => {
    if (error) {
      res.send({ result: "error" });
    } else {
      res.send({ result: "succ" });
    }
  });
});

//#8. 저장된 내용을 제거 합니다.
app.all("/data/remove", (req: express.Request, res: express.Response) => {
  let { idx } = req.body;

  remove(idx, (result, error) => {
    console.log(result, error);
    if (error) {
      res.send({ result: "error" });
    } else {
      res.send({ result: "succ" });
    }
  });
});

//#9. 서버를 실행 합니다.
app.listen(4885, () => {
  console.log("실행중");
});
