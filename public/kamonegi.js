/** 
参考
"p5.js でゲーム制作". https://fal-works.github.io/make-games-with-p5js/ ,(参照2022-1-8)
*/

// ---- エンティティ関連の関数 ---------------------------------------------

// 全エンティティ共通

let img; //画像表示の変数

//事前読み込みをpreload関数で行う
function preload() {
  //変数を使って画像をロード
  //kamo = loadImage("bird_kogamo.png");
  kamo = loadImage("kamo.png");
  //kamo = loadImage("https://2.bp.blogspot.com/-w3JYrB87xvI/WK7emcl0bOI/AAAAAAABB9U/YwTNqC0ksD4LxZi9F7ptVfzeMvvJBQKKQCLcB/s800/bird_kogamo.png");
  negi = loadImage("negi.png");
  //negi = loadImage("vegetable_shimonita_negi.png");
  //negi = loadImage("https://drive.google.com/file/d/1ZvEmdJb3sgbrByJalYgmk8ruCY3PvJuA/view?usp=sharing");
  //negi = loadImage("https://4.bp.blogspot.com/-29WTjfE2brk/WWXXU174s_I/AAAAAAABFhY/rkOmqfHTRPUszjMewTsCLM92ns-9qaS5gCLcBGAs/s800/vegetable_negi.png");
  nabe = loadImage("nabe.png");
  //kamo = loadImage("nabe.png");
  //kamow = 40;
  //kamoh = 40;
  kamow = 60;
  kamoh = 60;
  negiw = 60;
  negih = 400;
}

/** 
// 開始時間値
let startTime;
// 1秒
const oneSec = 1000;
// 経過時間値
let elapsedTime = 0;
// 秒数をカウント
let count = 0;
*/

let score = 0;

function updatePosition(entity) {
  entity.x += entity.vx;
  entity.y += entity.vy;
}

// プレイヤーエンティティ用

function createPlayer() {
  return {
    x: 200,
    y: 300,
    vx: 0,
    vy: 0,
  };
}

function applyGravity(entity) {
  entity.vy += 0.15;
}

function applyJump(entity) {
  if (entity.y > -50) {
    entity.vy = -5;
  } else {
    entity.vy = 5;
  }
}

function drawPlayer(entity) {
  //square(entity.x, entity.y, 40);
  //square(200, 300, 60);
  //square(entity.x, entity.y, 60);
  image(kamo, entity.x - kamow / 2, entity.y - kamoh / 2, kamow, kamoh);

  //text(count + "秒経過", 170, 70);
  //text(frameCount, 170, 70);
  fill(0, 112, 66);
  textSize(64);
  //text("通過したねぎ" + score + "本", 50, 60);
  text(score, 50, 60);
  /** 
    // 現在時間値
    const now = millis();
    // 経過時間値
    elapsedTime = now - startTime;
    if (gameState === "play"){
         // 1秒たったら
      if (elapsedTime >= oneSec) {
      // 秒数を1つ大きくする
        count++;
      // 再びスタート
        startTime = millis();
      }
    }
    else {
      count -= count
    }
    */

  score = ((frameCount - 400) / 150) | 0;
  if (gameState === "gameover") {
    frameCount -= frameCount + 1;
  }
  if (score < 0) {
    score -= score;
  }
}

function playerIsAlive(entity) {
  // プレイヤーの位置が生存圏内なら true を返す。
  // 600 は画面の下端
  return entity.y < 600;
}

// ブロックエンティティ用

function createBlock(y) {
  return {
    //x: 900,
    x: 1300,
    y,
    vx: -2,
    vy: 0,
  };
}

function drawBlock(entity) {
  //rect(entity.x, entity.y, 80, 400);
  //rect(400, 100, 80, 400);
  //rect(entity.x, entity.y, negiw, negih);
  image(negi, entity.x - negiw / 2, entity.y - negih / 2, negiw, negih);
}

function blockIsAlive(entity) {
  // ブロックの位置が生存圏内なら true を返す。
  // -100 は適当な値（ブロックが見えなくなる位置であればよい）
  return -100 < entity.x;
}

// 複数のエンティティを処理する関数

/**
 * 2つのエンティティが衝突しているかどうかをチェックする
 *
 * @param entityA 衝突しているかどうかを確認したいエンティティ
 * @param entityB 同上
 * @param collisionXDistance 衝突しないギリギリのx距離
 * @param collisionYDistance 衝突しないギリギリのy距離
 * @returns 衝突していたら `true` そうでなければ `false` を返す
 */
function entitiesAreColliding(
  entityA,
  entityB,
  collisionXDistance,
  collisionYDistance
) {
  // xとy、いずれかの距離が十分開いていたら、衝突していないので false を返す

  let currentXDistance = abs(entityA.x - entityB.x); // 現在のx距離
  if (collisionXDistance <= currentXDistance) return false;

  let currentYDistance = abs(entityA.y - entityB.y); // 現在のy距離
  if (collisionYDistance <= currentYDistance) return false;

  return true; // ここまで来たら、x方向でもy方向でも重なっているので true
}

// ---- ゲーム全体に関わる部分 --------------------------------------------

/** プレイヤーエンティティ */
let player;

/** ブロックエンティティの配列 */
let blocks;

/** ゲームの状態。"play" か "gameover" を入れるものとする */
let gameState;

/** ブロックを上下ペアで作成し、`blocks` に追加する */

function addBlockPair() {
  let y = random(-100, 500);
  blocks.push(createBlock(y)); // 上のブロック
  //blocks.push(createBlock(y + 600)); // 下のブロック
}

/** 
  function addBlockPair() {
    let y = random(-100, 100);
    blocks.push(createBlock(y)); // 上のブロック
    blocks.push(createBlock(y + 600)); // 下のブロック
  }
  */

/** ゲームオーバー画面を表示する */
function drawGameoverScreen() {
  //background(0, 192); // 透明度 192 の黒
  //fill(255);
  background(241, 223, 100, 192);
  fill(0, 112, 66);
  textSize(64);
  textAlign(CENTER, CENTER); // 横に中央揃え ＆ 縦にも中央揃え
  //text("GAME OVER", width / 2, height / 2); // 画面中央にテキスト表示
  text("鴨ネギ鍋", width / 2, height / 2);
  image(nabe, 200, 200, 200, 200);
  image(nabe, 800, 200, 200, 200);
}

/** ゲームのリセット */
function resetGame() {
  // 状態をリセット
  gameState = "play";

  // プレイヤーを作成
  player = createPlayer();

  // ブロックの配列準備
  blocks = [];
}

/** ゲームの更新 */
function updateGame() {
  // ゲームオーバーなら更新しない
  if (gameState === "gameover") return;
  if (gameState === "gameover") count = 0;

  // ブロックの追加と削除
  //if (frameCount % 120 === 1) addBlockPair(blocks); // 一定間隔で追加
  if (frameCount % 150 === 1) addBlockPair(blocks); // 一定間隔で追加
  blocks = blocks.filter(blockIsAlive); // 生きているブロックだけ残す

  // 全エンティティの位置を更新
  updatePosition(player);
  for (let block of blocks) updatePosition(block);

  // プレイヤーに重力を適用
  applyGravity(player);

  // プレイヤーが死んでいたらゲームオーバー
  if (!playerIsAlive(player)) gameState = "gameover";

  // 衝突判定
  for (let block of blocks) {
    //if (entitiesAreColliding(player, block, 20 + 40, 20 + 200)) {
    if (
      entitiesAreColliding(
        player,
        block,
        kamow / 2 + negiw / 2 - 20,
        kamow / 2 + negih / 2
      )
    ) {
      const data = { score: score };
      fetch("/public", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            console.log("error!");
          }
          console.log("ok!");
          console.log(response.json());
          return response.json();
        })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        });

      gameState = "gameover";
      break;
    }
  }
}

/** ゲームの描画 */
function drawGame() {
  // 全エンティティを描画
  //background(0);
  background(176, 220, 230);
  fill(0, 86, 155);
  drawPlayer(player);
  for (let block of blocks) drawBlock(block);

  // ゲームオーバー状態なら、それ用の画面を表示
  if (gameState === "gameover") drawGameoverScreen();
}

/** マウスボタンが押されたときのゲームへの影響 */
function onMousePress() {
  switch (gameState) {
    case "play":
      // プレイ中の状態ならプレイヤーをジャンプさせる
      applyJump(player);
      break;
    case "gameover":
      // ゲームオーバー状態ならリセット
      resetGame();
      break;
  }
}

// ---- setup/draw 他 --------------------------------------------------

function setup() {
  //createCanvas(800, 600);
  createCanvas(1200, 600);
  rectMode(CENTER);

  resetGame();
}

function draw() {
  updateGame();
  drawGame();
}

function mousePressed() {
  onMousePress();
}

/** 
  function setup() {
    //createCanvas( 800, 600);
    createCanvas(1200, 600);
    startTime = millis();
    rectMode(CENTER);
  
    resetGame();
  }
*/
