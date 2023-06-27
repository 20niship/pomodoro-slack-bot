import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { WebClient } from '@slack/web-api';

// 環境変数の読み込み
dotenv.config();

// Expressアプリのセットアップ
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Slack APIクライアントの作成
const slackToken = process.env.SLACK_API_TOKEN;
const web = new WebClient(slackToken);

// タイマーハンドラー
function sendTimerMessage() {
  const channelId = 'YOUR_CHANNEL_ID'; // メッセージを送信するチャンネルのIDを設定します
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

const port = process.env?.PORT || 80;
app.listen(port, () => {
  console.log(`サーバーがポート ${port} で起動しました。`);
});

