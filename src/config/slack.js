// import Slack from "@slack/bolt";
// import dotenv from "dotenv";

// dotenv.config();

// export const integrationSlack = async () => {
//   console.log(process.env.SLACK_SIGNING_SECRET);
//   console.log(process.env.SLACK_CHANNEL);
//   const app = new Slack.App({
//     signingSecret: process.env.SLACK_SIGNING_SECRET,
//     token: process.env.SLACK_BOT_TOKEN,
//   });

//   await app.client.chat.postMessage({
//     token: process.env.SLACK_BOT_TOKEN,
//     channel: process.env.SLACK_CHANNEL,
//     text: "مُجيب… صوتك الأول مع العميل، وانطباعك اللي ما ينسى. يرد، يفهم، ويخدم… قبل لا ترد أنت",
//   });
// };
