const express = require("express");
const path = require("path");
const app = express();
const portNo = 8000;
const bodyParser = require("body-parser");
const NeDB = require("nedb");

const db = new NeDB({
  filename: path.join(__dirname, "game_data.db"),
  autoload: true,
});

// urlencodedとjsonは別々に初期化する
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// サーバー待受開始
app.listen(portNo, () => {
  console.log("起動しました", `http://localhost:${portNo}`);
});
app.use("/public", express.static("./public"));
app.get("/", (req, res, next) => {
  res.redirect(302, "/public");
});

// CORSを許可する
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/getranking", (req, res) => {
  db.find({})
    .sort({ score: -1 })
    .exec((err, data) => {
      if (err) {
        sendJSON(res, false, { logs: [], msg: err });
        return;
      }
      sendJSON(res, true, { logs: data });
    });
});

//データアイテム取得api
app.get("/api/getItem/:id", (req, res) => {
  db.find({ _id: req.params.id }).exec((err, data) => {
    if (err) {
      sendJSON(res, false, { logs: [], msg: err });
      return;
    }
    sendJSON(res, true, { logs: data });
  });
});

const sendJSON = (res, result, obj) => {
  obj["result"] = result;
  res.json(obj);
};

app.post("/public", (req, res) => {
  db.insert({
    score: req.body.score,
    stime: new Date().getTime(),
  }),
    (err, doc) => {
      if (err) {
        console.error(err);
        sendJSON(res, false, { msg: err });
        return;
      }
      sendJSON(res, true, { id: doc._id });
    };
  const s = JSON.stringify(req.body);
  res.send("POSTを受信しました" + s);
});

app.post("/", function (req, res) {
  // リクエストボディを出力
  console.log(req.body);
  // パラメータ名、nameを出力
  console.log(req.body.name);

  res.send("POST request to the homepage");
});
