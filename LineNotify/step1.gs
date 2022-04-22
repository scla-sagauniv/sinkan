function postContent() {
  let content = "\nGAS完全に理解した";
  content += "\nLINE Messaging API完全に理解した";
  content += "\n\n4/27のイベントみんな来てね";
  sendPostContent(content);
}

function sendPostContent(content) {
  const token = ['コピーしたTOKEN'];
  const options = {
    "method": "post",
    "payload" : {"message": content },
    "headers": {"Authorization": "Bearer " + token}    
  };
  UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
}