"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFile = exports.remove = exports.update = exports.insert = exports.select = void 0;
const sqlite3 = require("sqlite3");
const fs = require("fs");
let table_name = "simpleTable";
let db;
const db_path = "./my.db";
function _init() {
    return new Promise((succ, fail) => {
        fs.readFile(db_path, (err, data) => {
            try {
                if (err) {
                    fs.writeFileSync(db_path, "");
                }
                succ("succ");
            }
            catch (error) {
                fail("fail");
            }
        });
    });
}
function init() {
    _init()
        .then((arg) => {
        db = new sqlite3.Database(db_path);
        db.run(`CREATE TABLE IF NOT EXISTS ${table_name}(IDX INTEGER PRIMARY KEY AUTOINCREMENT, NAME TEXT, DESC TEXT, DATE TEXT)`, (res, err) => {
            if (err)
                throw new Error("db create error!");
        });
    })
        .catch((err) => {
        console.log(err);
    });
}
//가져오기 함수 입니다.
function select(calback) {
    db.all(`SELECT * FROM ${table_name}`, (result, error) => {
        if (calback && calback instanceof Function)
            calback(result, error);
    });
}
exports.select = select;
//등록 함수 입니다.
function insert(param, calback) {
    db.run(`INSERT INTO ${table_name}(NAME,DESC,DATE) VALUES('${param.NAME}','${param.DESC}','${param.DATE}')`, (result, error) => {
        if (calback && calback instanceof Function)
            calback(result, error);
    });
}
exports.insert = insert;
//수정 함수 입니다.
function update(param, calback) {
    db.run(`UPDATE ${table_name} SET NAME='${param.NAME}', DESC='${param.DESC}', DATE='${param.DATE}' WHERE IDX = '${param.IDX}'`, (result, error) => {
        if (calback && calback instanceof Function)
            calback(result, error);
    });
}
exports.update = update;
//삭제 함수 입니다.
function remove(param, calback) {
    db.run(`DELETE FROM ${table_name} WHERE IDX = '${param.IDX}'`, (result, error) => {
        if (calback && calback instanceof Function)
            calback(result, error);
    });
}
exports.remove = remove;
//파일을 만드는 함수 입니다
function createFile(filename, param, calback) {
    fs.writeFile(filename, param, {}, (result) => {
        console.log(result);
    });
}
exports.createFile = createFile;
exports.default = init;
