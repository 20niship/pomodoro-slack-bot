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

const send_message=   async(channel:string, text:string)=>{
  try {
    const result = await web.chat.postMessage({channel, text});
  } catch (e) {
    console.error(e);
    console.error('メッセージの送信に失敗しました');
  }
}

app.post("/", function(req, res, next) {
    const body = req.body;
    const type = body?.type || "";
    const token = body?.token || "";
    const event = body?.event || {};
    const event_type = event?.type || "";

    if(!token){
      console.error("token not set error!");
      res.writeHead(405).end('Token must not be undefined');
      return;
    }

    console.log(body)
    console.log(type)

    switch(type){
      case "url_verification":
      {
        res.status(200);
        res.end(body.challenge);
        console.log("Challenge!!")
        return;
      }

      case "event_callback":
        switch(event_type)
      {
        case "message":
        const text = (event?.text ||"")as string;
        const is_bot = 'bot_id' in event;
        const channel = (event?.channel || "")as string;
        if(is_bot) break;
        if(text === "" || channel===""){
          res.status(500);
          res.send("channel or message is null");
          return;
        }

        send_message(channel, text);

       // setTimeout(sendTimerMessage, 3000); // 3秒ごとにメッセージを送信
       break;


       default:

      }

      default:
       res.send('タイマーアプリが稼働中です。');
    }

  res.status(200);
  res.end();
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

