function postContent() {
  let content = "\nGAS完全に理解した\n";
  content += "LINE Messaging API完全に理解した\n";
  content += "\n4/27のイベントみんな来てね\n";

  const weather = getWeatherInfo();
  const today = getNowYMDStr();
  content += `\n${today}\n`;
  content += `佐賀市(${weather["area"]})の天気\n`;
  content += `天気：${weather["weather"]}\n`;
  content += `気温：朝( ${weather["temps"][`${today}T00:00:00+09:00`]}℃ ) 昼( ${weather["temps"][`${today}T09:00:00+09:00`]}℃ )\n`
  const pops_time_list = ["00", "06", "12", "18"];
  content += "降水確率↓\n";
  content += " 00-06 | 06-12 | 12-18 | 18-24 \n"
  for (let i = 0; i < 4; i++) {
    if (weather["pops"][today + `T${pops_time_list[i]}:00:00+09:00`]) {
      content += `    ${weather["pops"][`${today}T${pops_time_list[i]}:00:00+09:00`]}      `;
    }
    else {
      content += `     -      `;
    }
  }
  content += "\n";
  sendPostContent(content);
}

function sendPostContent(content) {
  const token = ['tokenを張り付ける'];
  const options = {
    "method": "post",
    "payload" : {"message": content },
    "headers": {"Authorization": "Bearer " + token}    
  };
  UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
}

function getWeatherInfo() {
  const AREAS_CODE = 410000;
  const url = `https://www.jma.go.jp/bosai/forecast/data/forecast/${AREAS_CODE}.json`;
  const response = UrlFetchApp.fetch(url);
  const weather = response2hash(JSON.parse(response.getContentText())[0]);
  console.log(weather);
  return weather;
}

function response2hash(response) {
  let hash = {};
  hash["area"] = "佐賀県 南部"
  hash["weather"] = response.timeSeries[0].areas[0].weathers[0];
  hash["pops"] = {};
  for (let i = 0; i < response.timeSeries[1].timeDefines.length; i++) {
    hash["pops"][response.timeSeries[1].timeDefines[i]] = response.timeSeries[1].areas[0].pops[i];
  }
  hash["temps"] = {};
  for (let i = 0; i < response.timeSeries[2].timeDefines.length; i++) {
    hash["temps"][response.timeSeries[2].timeDefines[i]] = response.timeSeries[2].areas[0].temps[i];
  }
  return hash;
}

function getNowYMDStr(){
  const date = new Date();
  const Y = date.getFullYear();
  const M = ("00" + (date.getMonth()+1)).slice(-2);
  const D = ("00" + date.getDate()).slice(-2);

  return `${Y}-${M}-${D}`;
}