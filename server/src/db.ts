import * as sqlite3 from "sqlite3";
import * as fs from "fs";

let table_name: string = "simpleTable";
let db: sqlite3.Database;
const db_path: string = "./my.db";
type DBform = {
  IDX?: number;
  NAME: string;
  DESC: string;
  DATE: string;
};

function _init(): Promise<any> {
  return new Promise((succ: Function, fail: Function) => {
    fs.readFile(db_path, (err: NodeJS.ErrnoException | null, data: Buffer) => {
      try {
        if (err) {
          fs.writeFileSync(db_path, "");
        }
        succ("succ");
      } catch (error) {
        fail("fail");
      }
    });
  });
}

function init(): void {
  _init()
    .then((arg) => {
      db = new sqlite3.Database(db_path);
      db.run(
        `CREATE TABLE IF NOT EXISTS ${table_name}(IDX INTEGER PRIMARY KEY AUTOINCREMENT, NAME TEXT, DESC TEXT, DATE TEXT)`,
        (res: sqlite3.RunResult, err: Error) => {
          if (err) throw new Error("db create error!");
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
}

//가져오기 함수 입니다.
function select(calback?: Function): void {
  db.all(`SELECT * FROM ${table_name}`, (result: any, error: Error) => {
    if (calback && calback instanceof Function) calback(result, error);
  });
}

//등록 함수 입니다.
function insert(param: DBform, calback?: Function): void {
  db.run(
    `INSERT INTO ${table_name}(NAME,DESC,DATE) VALUES('${param.NAME}','${param.DESC}','${param.DATE}')`,
    (result: any, error: Error) => {
      if (calback && calback instanceof Function) calback(result, error);
    }
  );
}

//수정 함수 입니다.
function update(param: DBform, calback?: Function): void {
  db.run(
    `UPDATE ${table_name} SET NAME='${param.NAME}', DESC='${param.DESC}', DATE='${param.DATE}' WHERE IDX = '${param.IDX}'`,
    (result: any, error: Error) => {
      if (calback && calback instanceof Function) calback(result, error);
    }
  );
}

//삭제 함수 입니다.
function remove(param: DBform, calback?: Function): void {
  db.run(
    `DELETE FROM ${table_name} WHERE IDX = '${param.IDX}'`,
    (result: any, error: Error) => {
      if (calback && calback instanceof Function) calback(result, error);
    }
  );
}

//파일을 만드는 함수 입니다
function createFile(filename: string, param: any, calback?: Function): void {
  fs.writeFile(filename, param, {}, (result) => {
    console.log(result);
  });
}

export default init;
export { select, insert, update, remove, createFile };
export type { DBform };
