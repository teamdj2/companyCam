import  Axios  from "axios";

export async function sendLogToSlack(log: string) {
    await Axios.post(
      'https://slack.com/api/chat.postMessage',
      {
        channel: '#testing-hubspot-workflow',
        text: log
      },
      {
        headers: {
          authorization: `Bearer ` + process.env.SLACK_TOKEN
        }
      }
    );
  }