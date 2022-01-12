fetch("/getranking")
  .then((res) => {
    return res.json();
  })
  .then((json) => {
    // ここに何らかの処理
    console.log(json.logs);
    var scores = json.logs;

    var rankList = "";
    for (var i = 0; i < scores.length; i++) {
      rankList += "<li>" + scores[i].stime + ": " + scores[i].score + "</li>";
    }

    document.getElementById("ranking-data").innerHTML = rankList;
  });
