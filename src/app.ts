import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { WebClient } from '@slack/web-api';

dotenv.config();
const slackToken = process.env.SLACK_API_TOKEN;
const port = process.env?.PORT || 80;
const CHANNEL_ID = process.env.CHANNEL_ID as string;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const web = new WebClient(slackToken);

function sendTimerMessage() {
  const channelId = 'YOUR_CHANNEL_ID'; 
  web.chat.postMessage({
    channel: channelId,
    text: 'タイマーのメッセージです',
  });
}

app.post("/", function(req, res, next) {
    let payload = req.body;
    res.status(200);
    console.log(payload)

    if (payload.event.type === "app_mention") {
        if (payload.event.text.includes("tell me a joke")) {
            // Make call to chat.postMessage using bot's token
          console.log("A", payload)

        }
       setTimeout(sendTimerMessage, 3000); // 3秒ごとにメッセージを送信
    }
  res.send('タイマーアプリが稼働中です。');
})


const send_start_message  =   async()=>{
  try {
    const result = await web.chat.postMessage({
      channel: CHANNEL_ID,  text: 'タイマーアプリが起動しました',
    });
  } catch (e) {
    console.error(e);
    console.error('メッセージの送信に失敗しました');
  }
}

app.listen(port, () => {
  console.log(`サーバーがポート ${port} で起動しました。`);
  send_start_message();
});

